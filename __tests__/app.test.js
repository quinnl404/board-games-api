const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const request = require("supertest");
const { app, server } = require("../app.js");

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  server.close();
  return db.end();
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
      });
  });
  it("200: returns an array of length 4", () => {
    return request(app)
      .get(path)
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories.length).toBe(4);
      });
  });
  it("200: returns an array of objects with slug and description properties", () => {
    return request(app)
      .get(path)
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
