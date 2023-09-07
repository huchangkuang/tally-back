import { Sequelize } from "sequelize";
import config from "../../config";
import { sqlInfo } from "../utils/log4j";

const { db } = config;
export const sequelize = new Sequelize("test_db", db.username, db.password, {
  host: db.host,
  dialect: "mysql",
  logging: (sql) => sqlInfo(sql),
  define: {
    freezeTableName: true,
  },
});

const initDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (e) {
    console.log(e);
  }
};
export default initDb;
