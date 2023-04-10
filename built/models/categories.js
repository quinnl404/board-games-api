const db = require("../db/connection");
exports.fetchCategories = () => {
    return db
        .query("SELECT slug, description FROM categories;")
        .then(({ rows }) => {
        return rows;
    });
};
