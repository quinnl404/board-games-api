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
    const path = "/api/reviews/";
    for (let index = 1; index < 14; index++) {
      return request(app)
        .get(path + String(index))
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            created_at: expect.any(String),
          });
        });
    }
  });
});
