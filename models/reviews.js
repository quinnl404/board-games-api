const db = require("../db/connection.js");

exports.fetchReviewFromId = (id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found with review_id: ${id}`,
        });
      }
      return review;
    });
};
