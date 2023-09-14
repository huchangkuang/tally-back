import Router from "koa-router";
import login from "./login";
import tags from "./tags";
import bills from "./bills";

const routers = new Router();
routers.use("/api/user", login.routes(), login.allowedMethods());
routers.use("/api/tags", tags.routes(), tags.allowedMethods());
routers.use("/api/bills", bills.routes(), bills.allowedMethods());

export default routers;
