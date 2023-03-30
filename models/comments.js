const db = require("../db/connection.js");

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
