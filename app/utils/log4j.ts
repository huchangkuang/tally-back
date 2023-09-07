import log4js from "log4js";
import config from "../../config";

const levels = {
  trace: log4js.levels.TRACE, //固定常量
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
};

log4js.configure(config.log4js);

const debug = (content: string) => {
  let logger = log4js.getLogger();
  logger.level = levels.debug;
  logger.debug(content);
};

const info = (content: string) => {
  let logger = log4js.getLogger("info");
  logger.level = levels.info;
  logger.info(content);
};

const error = (content: string) => {
  let logger = log4js.getLogger("error");
  logger.level = levels.error;
  logger.error(content);
};
export { debug, info, error };
