const { removeCommentFromId, editCommentFromId, } = require("../models/comments.js");
exports.deleteCommentFromId = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentFromId(comment_id)
        .then((msg) => res.status(204).send(msg))
        .catch(next);
};
exports.patchCommentFromId = (req, res, next) => {
    const { comment_id } = req.params;
    const patchObject = req.body;
    editCommentFromId(comment_id, patchObject)
        .then((comment) => res.status(200).send({ comment }))
        .catch(next);
};
