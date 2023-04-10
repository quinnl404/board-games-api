const {
  getReviewFromId,
  patchReviewFromId,
  getReviewCommentsFromId,
  postReviewComment,
  getReviews,
} = require("../controllers/reviews");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);

reviewsRouter
  .route("/:review_id")
  .get(getReviewFromId)
  .patch(patchReviewFromId);

reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsFromId)
  .post(postReviewComment);

module.exports = reviewsRouter;
