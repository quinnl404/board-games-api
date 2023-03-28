const {
  fetchReviewFromId,
  fetchReviews,
  addReviewComment,
} = require("../models/reviews.js");

exports.getReviewFromId = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewFromId(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => res.status(200).send({ reviews }))
    .catch(next);
};

exports.postReviewComment = (req, res, next) => {
  const { review_id } = req.params;
  const comment = req.body;
  addReviewComment(review_id, comment)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};
