import { info } from "../utils/log4j";
const accessLog = async (ctx, next) => {
  const {
    path,
    req: { statusCode },
    method,
  } = ctx;
  const content = `path:${path} | method:${method} | statusCode: ${statusCode}`;
  info(content);
  return next();
};
export default accessLog;
