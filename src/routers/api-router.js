const apiRouter = require("express").Router();
const { getApi } = require(".././controllers/api.js");

apiRouter.get("/", getApi);

module.exports = apiRouter;
