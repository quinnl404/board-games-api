const express = require("express");
const app = express();
const {
  handleNonexistantEndpoint,
  handlePSQLThrownError,
  handleCustomErrors,
  handleServerErrors,
  errorPrinter,
} = require("./middleware/errorHandlers.js");
const apiRouter = require("./routers/api-router.js");
const reviewsRouter = require("./routers/reviews-router.js");
const categoriesRouter = require("./routers/categories-router.js");
const userRouter = require("./routers/users-router.js");
const commentsRouter = require("./routers/comments-router");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentsRouter);
app.all("/*", handleNonexistantEndpoint);
app.use(errorPrinter);
app.use(handleCustomErrors);
app.use(handlePSQLThrownError);
app.use(handleServerErrors);

module.exports = app;
