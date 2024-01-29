const app = require("../index");
const request = require("supertest");
const path = require("path");

describe("Extract Rectangle Coordinates Endpoint Test Suite", () => {
  test("POST it should test only PNG is accepted", () => {
    return request(app)
      .post("/extract-rect-coords")
      .attach("image", path.resolve(__dirname, "/data/white.jpeg"))
      .expect("Only PNG files are allowed");
  });
});
