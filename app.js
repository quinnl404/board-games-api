const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.js");
const { handleNonexistantEndpoint } = require("./middleware/errorHandlers.js");

app.get("/api/categories", getCategories);
app.all("/*", handleNonexistantEndpoint);

module.exports = { app };
