const { objectHasRequiredKeys } = require("./utils");
const db = require("../db/connection")

exports.removeCommentFromId = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Comment ${comment_id} does not exist.`,
        });
      }
    });
};

exports.editCommentFromId = (comment_id, patchObject) => {
  if (!objectHasRequiredKeys(patchObject, ["inc_votes"])) {
    return Promise.reject({
      status: 400,
      msg: "Incorrect properties on patch object.",
    });
  }
  return db
    .query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Comment ${comment_id} does not exist.`,
        });
      }
    })
    .then(() => {
      return db.query(
        `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;
      `,
        [patchObject.inc_votes, comment_id]
      );
    })
    .then(({ rows }) => {
      const comment = rows[0];
      return comment;
    });
};
