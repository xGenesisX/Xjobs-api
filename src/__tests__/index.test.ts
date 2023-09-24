import supertest from "supertest";

import { app } from "../index";

describe("Routing", () => {
  it("should return `200` when GET index", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toEqual(200);
  });
});
