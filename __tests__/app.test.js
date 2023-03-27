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
