const express = require("express");
const app = express();
import {handleCustomErrors, handleNonexistantEndpoint, handlePSQLThrownError, handleServerErrors, errorPrinter} from "./middleware/errorHandlers";
const apiRouter = require("./routers/api-router");
const reviewsRouter = require("./routers/reviews-router");
const categoriesRouter = require("./routers/categories-router");
const userRouter = require("./routers/users-router");
const commentsRouter = require("./routers/comments-router");

app.use(express.json());
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

export default app;