const db = require("../db/connection.js");
const { convertTimestampToDate } = require("../db/seeds/utils.js");

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

exports.addReviewComment = (review_id, comment) => {
  const allowedKeys = ["username", "body"];
  for (const key of Object.keys(comment)) {
    if (!allowedKeys.includes(key)) {
      return Promise.reject({
        status: 400,
        msg: "Incorrect properties on comment object.",
      });
    }
  }

  const date = new Date(Date.now());
  return db
    .query(`SELECT review_id FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      const reviews = rows;
      if (!reviews.length) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist.`,
        });
      }
      return db.query(
        `
          INSERT INTO comments
            (body, review_id, author, votes, created_at)
          VALUES
            ($1, $2, $3, 0, $4)
          RETURNING *;
          `,
        [comment.body, review_id, comment.username, date]
      );
    })
    .then(({ rows }) => {
      const postedComment = rows[0];
      return postedComment;
    });
};
