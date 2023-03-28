const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.js");
const {
  getReviewFromId,
  getReviews,
  getReviewCommentsFromId,
} = require("./controllers/reviews.js");
const {
  handleNonexistantEndpoint,
  handlePSQLThrownError,
  handleCustomErrors,
  handleServerErrors,
  errorPrinter,
} = require("./middleware/errorHandlers.js");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewFromId);
app.get("/api/reviews/:review_id/comments", getReviewCommentsFromId);
app.all("/*", handleNonexistantEndpoint);
app.use(errorPrinter);
app.use(handleCustomErrors);
app.use(handlePSQLThrownError);
app.use(handleServerErrors);

module.exports = { app };
