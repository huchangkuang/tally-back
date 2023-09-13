import Router from "koa-router";
import login from "./login";

const routers = new Router();
routers.use("/api/user", login.routes(), login.allowedMethods());

export default routers;
