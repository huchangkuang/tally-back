import Router from "koa-router";
import { error } from "../utils/log4j";

const routers = new Router();
routers
  .get("/", (ctx) => {
    ctx.body = "hello";
    ctx.res.statusCode = 200;
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
