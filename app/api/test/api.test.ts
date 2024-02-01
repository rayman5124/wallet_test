import request from "supertest";
import { Server } from "../../server/server";

describe("endpoint test", () => {
  const app = new Server().app;

  it("/coin/transfer", async (done) => {
    request(app)
      .post("/api/coin/transfer")
      .expect(200, done)
      .end(() => {});
  });
});
