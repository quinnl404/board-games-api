const db = require("../db/connection.js");

exports.fetchReviewFromId = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found with review_id: ${review_id}`,
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

exports.fetchReviewCommentsFromId = (review_id) => {
  return db
    .query(
      `
      SELECT comments.* FROM reviews
      RIGHT JOIN comments ON (reviews.review_id = comments.review_id)
      WHERE comments.review_id = $1
      ORDER BY comments.created_at;
    `,
      [review_id]
    )
    .then(({ rows }) => {
      const comments = rows;
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: "No comments found.",
        });
      }
      console.log(comments);
      return comments;
    });
};

// {
//   body: 'I loved this game too!',
//   votes: 16,
//   author: 'bainesface',
//   review_id: 2,
//   created_at: new Date(1511354613389),
// },
