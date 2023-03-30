const { removeCommentFromId } = require("../models/comments.js");

exports.deleteCommentFromId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentFromId(comment_id)
    .then((msg) => res.status(204).send(msg))
    .catch(next);
};
