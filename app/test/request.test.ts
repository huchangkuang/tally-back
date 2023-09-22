import run from "../server/app";
import request from "supertest";
import { Server } from "http";
import config from "../../config";

const idName = "testUnit";
const password = "testUnit";
const userName = "userName";
const avatar = "avatar";
const budget = 2000;
let token = "";
let app: Server;
// jest.useFakeTimers()

describe("request", () => {
  beforeAll((done) => {
    app = run(config.serverPort);
    done();
  });
  it("post /api/user/signUp", async () => {
    await request(app)
      .post("/api/user/signUp")
      .send({ idName, password })
      .expect(200)
      .expect((res) => {
        expect(res.body.code).toEqual(0);
      });
  });
  it("post /api/user/login", async () => {
    await request(app)
      .post("/api/user/login")
      .send({ idName, password })
      .expect(200)
      .expect((res) => {
        expect(res.body.code).toEqual(0);
        token = res.body.data.token;
      });
  });
  it("post budget", async () => {
    await request(app)
      .post("/api/user/budget")
      .auth(token, { type: "bearer" })
      .send({ num: budget })
      .expect(200)
      .expect((res) => {
        expect(res.body.code).toEqual(0);
      });
  });
  it("post editInfo", async () => {
    await request(app)
      .post("/api/user/editInfo")
      .auth(token, { type: "bearer" })
      .send({ userName, avatar })
      .expect(200)
      .expect((res) => {
        expect(res.body.code).toEqual(0);
      });
  });
  it("post userInfo", async () => {
    await request(app)
      .get("/api/user/info")
      .auth(token, { type: "bearer" })
      .expect(200)
      .expect((res) => {
        const { data, code } = res.body;
        expect(code).toEqual(0);
        expect(data.userName).toEqual(userName);
        expect(data.avatar).toEqual(avatar);
        expect(data.budget).toEqual(budget);
      });
  });
  it("post /api/user/loginOut", async () => {
    await request(app)
      .post("/api/user/loginOut")
      .auth(token, { type: "bearer" })
      .expect(200)
      .expect((res) => {
        expect(res.body.code).toEqual(0);
      });
  });
  afterAll((done) => {
    app.close();
    done();
  });
});
