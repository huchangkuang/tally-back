import run from "../server/app";
import request from "supertest";
import { Server } from "http";
import config from "../../config";

describe("login", () => {
  let app: Server;
  beforeAll(() => {
    app = run(config.serverPort);
  });
  it("get /login", function () {
    request(app).get("/login").expect(200);
  });
  it("post /login/signUp", function () {
    request(app)
      .post("/login/signUp")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toEqual("login1");
      });
  });
  afterAll(() => {
    app.close();
  });
});
