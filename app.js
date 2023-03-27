const express = require("express");
const app = express();
const { getNonexistantEndpoint } = require("./controllers/index.js");

app.all("/*", getNonexistantEndpoint);

const server = app.listen(9090, () => {
  console.log("Server is listening on port 9090.");
});

module.exports = { app, server };
