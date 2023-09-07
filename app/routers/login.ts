import Router from "koa-router";
import { error } from "../utils/log4j";
import User from "../model/userModel";

const routers = new Router();
routers
  .get("/", async (ctx) => {
    ctx.body = "hello";
    ctx.res.statusCode = 200;
    const jane = await User.create({
      name: "Jane",
      age: 18,
      favoriteColor: "red",
      cash: 999,
    });
    console.log(JSON.stringify(jane), "=======");
  })
  .post("/signUp", (ctx) => {
    ctx.body = {
      msg: "success",
      data: "login",
    };
    ctx.res.statusCode = 200;
    error("errorTest");
  });

export default routers;
