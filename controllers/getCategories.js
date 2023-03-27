const { fetchCategories } = require("../models/index.js");

module.exports = (req, res) => {
  fetchCategories().then((categoriesToSend) => {
    res.status(200).send({ categories: categoriesToSend });
  });
};
