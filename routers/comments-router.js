const { deleteCommentFromId } = require("../controllers/comments");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentFromId);

module.exports = commentsRouter;
