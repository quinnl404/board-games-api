const db = require("../db/connection")

exports.fetchUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then(({ rows }) => {
      const users = rows;
      return users;
    });
};

exports.fetchUserFromUsername = (username) => {
  return db
    .query(
      "SELECT username, name, avatar_url FROM users WHERE username = $1;",
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `User '${username}' does not exist.`,
        });
      }
      const user = rows[0];
      return user;
    });
};
