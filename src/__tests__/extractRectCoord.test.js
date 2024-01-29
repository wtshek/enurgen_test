const app = require("../index");
const request = require("supertest");
const path = require("path");

describe("Extract Rectangle Coordinates Endpoint Test Suite", () => {
  test("POST it should attached an image in the request", () => {
    return request(app).post("/extract-rect-coords").expect("Image required");
  });

  test("POST it should accept only PNG", () => {
    return request(app)
      .post("/extract-rect-coords")
      .attach("image", path.resolve(__dirname, "./data/white.jpeg"))
      .expect("Only PNG files are allowed");
  });

  test("POST it should accept only PNG", () => {
    return request(app)
      .post("/extract-rect-coords")
      .attach("image", path.resolve(__dirname, "./data/simple.png"))
      .expect([
        {
          id: 0,
          coordinates: [
            [387, 56],
            [437, 56],
            [387, 456],
            [437, 456],
          ],
        },
        {
          id: 1,
          coordinates: [
            [231, 56],
            [281, 56],
            [231, 456],
            [281, 456],
          ],
        },
        {
          id: 2,
          coordinates: [
            [75, 56],
            [125, 56],
            [75, 456],
            [125, 456],
          ],
        },
      ]);
  });
});
