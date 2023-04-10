const { fetchApi } = require("../models/api.js");
exports.getApi = (req, res) => {
    res.status(200).send({ api: fetchApi() });
};
