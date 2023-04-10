const { fetchCategories } = require("../models/categories.js");
exports.getCategories = (req, res) => {
    fetchCategories().then((categoriesToSend) => {
        res.status(200).send({ categories: categoriesToSend });
    });
};
