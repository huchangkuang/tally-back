import run from "../server/app";
import supertest from "supertest";
import { Server } from "http";

describe("login", () => {
  let app: Server;
  beforeAll(() => {
    app = run(3456);
  });
  it("get /login", function () {
    supertest(app).get("/login").expect(200);
  });
  afterAll(() => {
    app.close();
  });
});
