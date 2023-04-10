const {
  deleteCommentFromId,
  patchCommentFromId,
} = require("../controllers/comments");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentFromId)
  .patch(patchCommentFromId);

module.exports = commentsRouter;
