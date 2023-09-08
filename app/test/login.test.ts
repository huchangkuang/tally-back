import run from "../server/app";
import request from "supertest";
import { Server } from "http";
import config from "../../config";

// jest.useFakeTimers()

describe("login", () => {
  let app: Server;
  beforeAll((done) => {
    app = run(config.serverPort);
    done();
  });
  it("get /login", async () => {
    await request(app).get("/login").expect(200);
  });
  it("post /login/signUp", async () => {
    await request(app)
      .post("/login/signUp")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toEqual("login");
      });
  });
  afterAll((done) => {
    app.close();
    done();
  });
});
