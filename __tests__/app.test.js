const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const { app } = require("../app.js");

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
  it("200: returns an array", () => {
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
  it("200: returns an array of reviews sorted in ascending order by date", () => {
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

  it("404: when accessing a review with no comments", () => {
    return request(app).get("/api/reviews/1/comments").expect(404);
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
