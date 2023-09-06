import Router from "koa-router";
import login from "./login";

const routers = new Router();
routers.use(login.routes(), login.allowedMethods());

export default routers;
