const { getUsers, getUserFromUsername } = require("../controllers/users");
const usersRouter = require("express").Router();
usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserFromUsername);
module.exports = usersRouter;
