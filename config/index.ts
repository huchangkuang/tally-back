const config = {
  serverPort: 3456,
  db: {
    database: "test_db",
    host: "127.0.0.1",
    username: "root",
    password: process.env.DB_PASSWORD,
  },
  log4js: {
    //设置追加器
    appenders: {
      console: { type: "console" }, //追加器1
      info: {
        //追加器2
        type: "file",
        filename: "logs/all-logs.log",
      },
      error: {
        //追加器3
        type: "dateFile",
        filename: "logs/log",
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true, // 设置文件名称为 filename + pattern
      },
    },
    //指定哪些追加器可以输出来
    categories: {
      default: { appenders: ["console"], level: "debug" },
      info: {
        appenders: ["info", "console"],
        level: "info",
      },
      error: {
        appenders: ["error", "console"],
        level: "error",
      },
    },
  },
};

export default config;
