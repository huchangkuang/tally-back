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

const debugLog = (content: string) => {
  let logger = log4js.getLogger();
  logger.level = levels.debug;
  logger.debug(content);
};

const infoLog = (content: string) => {
  let logger = log4js.getLogger("info");
  logger.level = levels.info;
  logger.info(content);
};

const errorLog = (content: string) => {
  let logger = log4js.getLogger("error");
  logger.level = levels.error;
  logger.error(content);
};
export { debugLog, infoLog, errorLog };
