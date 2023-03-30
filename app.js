const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.js");
const {
  getReviewFromId,
  getReviews,
  postReviewComment,
  getReviewCommentsFromId,
  patchReviewFromId,
} = require("./controllers/reviews.js");
const {
  handleNonexistantEndpoint,
  handlePSQLThrownError,
  handleCustomErrors,
  handleServerErrors,
  errorPrinter,
} = require("./middleware/errorHandlers.js");
const { deleteCommentFromId } = require("./controllers/comments.js");

app.use(express.json());
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewFromId);
app.patch("/api/reviews/:review_id", patchReviewFromId);
app.post("/api/reviews/:review_id/comments", postReviewComment);
app.get("/api/reviews/:review_id/comments", getReviewCommentsFromId);
app.delete("/api/comments/:comment_id", deleteCommentFromId);
app.all("/*", handleNonexistantEndpoint);
app.use(errorPrinter);
app.use(handleCustomErrors);
app.use(handlePSQLThrownError);
app.use(handleServerErrors);

module.exports = app;
