import Router from "koa-router";
import login from "./login";
import tags from "./tags";

const routers = new Router();
routers.use("/api/user", login.routes(), login.allowedMethods());
routers.use("/api/tags", tags.routes(), tags.allowedMethods());

export default routers;
