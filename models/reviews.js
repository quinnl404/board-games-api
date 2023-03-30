const db = require("../db/connection.js");
const { objectHasRequiredKeys } = require("./utils.js");

exports.fetchReviewFromId = (review_id) => {
  return db
    .query(
      `
    SELECT reviews.*, count(comments.review_id)::INTEGER AS comment_count FROM reviews
    LEFT JOIN comments ON (reviews.review_id = comments.review_id)
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found with review_id: ${review_id}`,
        });
      }
      return review;
    });
};

exports.fetchReviews = (query) => {
  return db
    .query("SELECT DISTINCT slug FROM categories")
    .then((categoryResults) => {
      const categories = categoryResults.rows.map((categoryObject) => {
        return categoryObject.slug;
      });
      const options = {
        sort_by: [
          "title",
          "designer",
          "owner",
          "review_body",
          "category",
          "created_at",
          "votes",
        ],
        order: ["asc", "desc"],
        category: categories,
      };

      const { sort_by = "created_at", order = "desc", category } = query;

      for (const key of Object.keys(options)) {
        const validValues = options[key];
        const queryValue = query[key];
        if (!validValues.includes(queryValue) && queryValue !== undefined) {
          return Promise.reject({
            status: 400,
            msg: `${queryValue} is not a valid ${key} value`,
          });
        }
      }

      let queryString = `
      SELECT reviews.*, count(comments.review_id)::INTEGER as comment_count
      FROM reviews
      LEFT JOIN comments ON (reviews.review_id = comments.review_id)`;

      if (category) {
        queryString += `
        WHERE reviews.category = '${category}'`;
      }

      queryString += `
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order};`;

      return db.query(queryString).then(({ rows }) => {
        const reviews = rows;
        if (!reviews.length) {
          return Promise.reject({
            status: 404,
            msg: "No reviews found.",
          });
        }
        return reviews;
      });
    });
};

exports.fetchReviewCommentsFromId = (review_id) => {
  return db
    .query(`SELECT review_id FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      const reviews = rows;
      if (!reviews.length) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist.`,
        });
      }
      return db.query(
        `
          SELECT comments.* FROM reviews
          RIGHT JOIN comments ON (reviews.review_id = comments.review_id)
          WHERE comments.review_id = $1
          ORDER BY comments.created_at;
        `,
        [review_id]
      );
    })
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};

exports.addReviewComment = (review_id, comment) => {
  if (!objectHasRequiredKeys(comment, ["username", "body"])) {
    return Promise.reject({
      status: 400,
      msg: "Incorrect properties on comment object.",
    });
  }

  const date = new Date(Date.now());
  return db
    .query(`SELECT review_id FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      const reviews = rows;
      if (!reviews.length) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist.`,
        });
      }
      return db.query(
        `
          INSERT INTO comments
            (body, review_id, author, votes, created_at)
          VALUES
            ($1, $2, $3, 0, $4)
          RETURNING *;
          `,
        [comment.body, review_id, comment.username, date]
      );
    })
    .then(({ rows }) => {
      const postedComment = rows[0];
      return postedComment;
    });
};

exports.editReviewFromId = (review_id, patchObject) => {
  if (!objectHasRequiredKeys(patchObject, ["inc_votes"])) {
    return Promise.reject({
      status: 400,
      msg: "Incorrect properties on patch object.",
    });
  }
  return db
    .query(`SELECT review_id FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist.`,
        });
      }
    })
    .then(() => {
      return db.query(
        `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
      `,
        [patchObject.inc_votes, review_id]
      );
    })
    .then(({ rows }) => {
      const review = rows[0];
      return review;
    });
};
