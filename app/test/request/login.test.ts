import run from "../../server/app";
import request from "supertest";
import { Server } from "http";
import config from "../../../config";

// jest.useFakeTimers()

describe("login", () => {
  it("test", function () {
    expect(1 + 1).toEqual(2);
  });
  // let app: Server;
  // beforeAll((done) => {
  //   app = run(config.serverPort);
  //   done();
  // });
  // it("post /api/user/login", async () => {
  //   await request(app).post("/api/user/login").expect(200).expect((res) => {
  //     expect(res.body.code).toEqual(0)
  //   });
  // });
  // it("post /api/user/signUp", async () => {
  //   await request(app)
  //     .post("/api/user/signUp")
  //     .expect(200)
  //     .expect((res) => {
  //       console.log(res.body.code);
  //     });
  // });
  // afterAll((done) => {
  //   app.close();
  //   done();
  // });
});
