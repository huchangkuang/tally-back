import { infoLog } from "../utils/log4j";
const accessLog = async (ctx, next) => {
  const {
    path,
    request: { body },
    method,
  } = ctx;
  const content = `path:${path} | method:${method} | body: ${JSON.stringify(
    body,
  )}`;
  infoLog(content);
  return next();
};
export default accessLog;
