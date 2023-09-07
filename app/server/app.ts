import dotenv from "dotenv";
dotenv.config();
import Koa from "koa";
import path from "path";
import bodyParser from "koa-bodyparser";
import koaStatic from "koa-static";
import routers from "../routers/index";
import { Server } from "http";

const app = new Koa();

// 配置控制台日志中间件
// app.use(koaLogger())

// 配置ctx.body解析中间件
app.use(bodyParser());

// 配置静态资源加载中间件
app.use(koaStatic(path.join(__dirname, "./../static")));

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods());

const run = (port: number): Server => {
  return app.listen(port, () => {
    console.log(`监听端口：${port}成功`);
  });
};
export default run;
