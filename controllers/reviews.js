const { fetchReviewFromId, fetchReviews } = require("../models/reviews.js");

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
