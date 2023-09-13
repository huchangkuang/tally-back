import { getToken, jwtVerify } from "../utils/jwtValidate";
import { failRes } from "../utils/resBody";

const needControlApi = ["/api/tags/add"];
const authorityControl = async (ctx, next) => {
  const { path, header } = ctx;
  if (needControlApi.includes(path)) {
    const token = getToken(header);
    if (!token) {
      ctx.body = failRes("登录失效", 401);
      ctx.res.statusCode = 401;
      return;
    }
    try {
      await jwtVerify(token);
    } catch (e) {
      ctx.body = failRes("登录失效", 401);
      ctx.res.statusCode = 401;
    }
  }
  return next();
};
export default authorityControl;
