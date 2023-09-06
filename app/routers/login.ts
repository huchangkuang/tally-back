import Router from "koa-router";

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
  });

export default routers;
