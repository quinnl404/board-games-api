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

exports.fetchReviews = () => {
  return db
    .query(
      `
  SELECT reviews.*, count(comments.review_id)::INTEGER AS comment_count FROM reviews
  LEFT JOIN comments ON (reviews.review_id = comments.review_id)
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at;
  `
    )
    .then(({ rows }) => {
      const reviews = rows;
      if (!reviews.length) {
        return Promise.reject({
          status: 404,
          msg: "No reviews found.",
        });
      }
      return reviews;
    });
};
