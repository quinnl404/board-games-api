const { fetchUsers, fetchUserFromUsername } = require("../models/users.js");
exports.getUsers = (req, res, next) => {
    fetchUsers()
        .then((users) => res.status(200).send({ users }))
        .catch(next);
};
exports.getUserFromUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserFromUsername(username)
        .then((user) => res.status(200).send({ user }))
        .catch(next);
};
