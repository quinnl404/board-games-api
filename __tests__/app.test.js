const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("GET /this-will-never-ever-be-an-end-point", () => {
  it("404: returns 404 when trying to access a bad endpoint", () => {
    return request(app)
      .get("/this-will-never-ever-be-an-end-point")
      .expect(404);
  });
});

describe("GET /api/categories", () => {
  const path = "/api/categories";
  it("200: returns categories", () => {
    return request(app)
      .get(path)
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("404: when accessing a nonexistant review", () => {
    return request(app).get("/api/reviews/14").expect(404);
  });

  it("400: when supplying an invalid review id (not a number)", () => {
    return request(app)
      .get("/api/reviews/aaaa")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("200: returns a review object with correct properties", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          title: "Dolor reprehenderit",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          category: "social deduction",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 7,
        });
      });
  });
});

describe("GET: /api/reviews", () => {
  it("200: returns reviews in ascending order, sorted by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("created_at", { descending: false });
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET: /api/reviews/:review_id/comments", () => {
  it("404: when accessing a non-existant review", () => {
    return request(app).get("/api/reviews/20/comments").expect(404);
  });

  it("400: when supplying an invalid review id (not a number)", () => {
    return request(app)
      .get("/api/reviews/aaaa/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("200: when accessing a review with no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

  it("200: returns an array of comments pertaining to a review", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(3);
        expect(comments).toBeSortedBy("created_at", { descending: false });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
});

describe("POST: /api/reviews/:review_id/comments", () => {
  it("400: rejects comments lacking all required fields", () => {
    const commentToPost = {
      body: "wooooooaaah what a game !!!",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect properties on comment object.");
      });
  });

  it("400: rejects comments with extra fields", () => {
    const commentToPost = {
      username: "bainesface",
      body: "wooooooaaah what a game !!!",
      favourite_food: "icecream",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect properties on comment object.");
      });
  });

  it("404: rejects posts to a non-existant review", () => {
    const commentToPost = {
      username: "bainesface",
      body: "wooooooaaah what a game !!!",
    };

    return request(app)
      .post("/api/reviews/39/comments")
      .send(commentToPost)
      .expect(404);
  });

  it("201: returns the succesfully created comment", () => {
    const commentToPost = {
      username: "bainesface",
      body: "wooaah what a game !!!",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "wooaah what a game !!!",
          votes: expect.any(Number),
          author: "bainesface",
          review_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});

describe("PATCH: /api/reviews/:review_id", () => {
  it("400: rejects patches lacking the required fields", () => {
    const patchObject = { spice_level: "maximum" };
    return request(app)
      .patch("/api/reviews/3")
      .send(patchObject)
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Incorrect properties on patch object.")
      );
  });

  it("400: rejects patches with extraneous fields", () => {
    const patchObject = { inc_votes: 10, spice_level: "maximum" };
    return request(app)
      .patch("/api/reviews/3")
      .send(patchObject)
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Incorrect properties on patch object.")
      );
  });

  it("400: rejects patches to invalid review_ids", () => {
    const patchObject = { inc_votes: 5 };

    return request(app).patch("/api/reviews/aaa").send(patchObject).expect(400);
  });

  it("404: rejects patches to nonexistant reviews", () => {
    const patchObject = { inc_votes: 5 };

    return request(app).patch("/api/reviews/39").send(patchObject).expect(404);
  });

  it("200: succesfully increments the votes on a review", () => {
    const patchObject = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/3")
      .send(patchObject)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 7,
        });
      });
  });

  it("200: succesfully decerements the votes on a review", () => {
    const patchObject = { inc_votes: -3 };
    return request(app)
      .patch("/api/reviews/3")
      .send(patchObject)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 2,
        });
      });
  });
});

describe("GET: /api/users", () => {
  it("200: returns an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((review) => {
          expect(review).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  it("404: rejects deletes to nonexistant comments", () => {
    return request(app)
      .delete("/api/comments/39")
      .expect(404)
      .then(({ body }) => {
        const notFoundMessage = body;
        expect(notFoundMessage).toEqual({
          msg: "Comment 39 does not exist.",
        });
      });
  });

  it("400: rejects deletes to invalid comment_ids", () => {
    return request(app).delete("/api/comments/aaaa").expect(400);
  });

  it("204: succesfully deletes a comment and returns no content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("GET: /api/users", () => {
  it("200: returns an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((review) => {
          expect(review).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
