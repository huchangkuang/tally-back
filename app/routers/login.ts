import Router from "koa-router";
import { Context } from "koa";

const routers = new Router();
routers.get("/", (ctx: Context) => {
  ctx.body = 'hello';
  ctx.res.statusCode = 200;
}).post("/signUp", (ctx: Context) => {
  ctx.body = {
    msg: "success",
    data: "login",
  };
  ctx.res.statusCode = 200;
});

export default routers;
