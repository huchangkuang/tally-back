import { info } from "../utils/log4j";
const accessLog = async (ctx, next) => {
  const { path, header } = ctx;
  const content = `path:${path} | method:${header[method]} | `;
  info(path);
  return next();
};
export default accessLog;
