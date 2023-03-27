const db = require("../db/connection.js");

module.exports = () => {
  return db
    .query("SELECT slug, description FROM categories;")
    .then(({ rows }) => {
      return rows;
    });
};
