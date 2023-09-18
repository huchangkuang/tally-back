import { getToken, jwtVerify } from "../utils/jwtValidate";
import { failRes } from "../utils/resBody";

const needControlApi = [
  "/api/tags/list",
  "/api/tags/add",
  "/api/tags/update",
  "/api/tags/del",
  "/api/bills/list",
  "/api/bills/add",
  "/api/bills/update",
  "/api/bills/del",
  "/api/user/editInfo",
  "/api/user/budget",
  "/api/user/info",
];
const tokenInvalid = (ctx) => {
  ctx.body = failRes("登录失效", 401);
  ctx.res.statusCode = 401;
};
const authorityControl = async (ctx, next) => {
  const { path, header } = ctx;
  if (needControlApi.includes(path)) {
    const token = getToken(header);
    if (!token) {
      tokenInvalid(ctx);
      return;
    }
    try {
      const { exp } = await jwtVerify(token);
      if (exp < Date.now().valueOf() / 1000) {
        tokenInvalid(ctx);
        return;
      }
    } catch (e) {
      tokenInvalid(ctx);
      return;
    }
  }
  return next();
};
export default authorityControl;
