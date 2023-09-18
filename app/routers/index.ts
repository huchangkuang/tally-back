import Router from "koa-router";
import user from "./user";
import tags from "./tags";
import bills from "./bills";

const routers = new Router();
routers.use("/api/user", user.routes(), user.allowedMethods());
routers.use("/api/tags", tags.routes(), tags.allowedMethods());
routers.use("/api/bills", bills.routes(), bills.allowedMethods());

export default routers;
