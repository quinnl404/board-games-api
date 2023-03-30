const { fetchApi } = require("../models/api.js");

exports.getApi = (req, res) => {
  fetchApi().then((api) => {
    res.status(200).send({ api });
  });
};
