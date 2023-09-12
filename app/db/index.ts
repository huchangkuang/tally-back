import { Sequelize } from "sequelize";
import config from "../../config";
import mysql from "mysql2";
import { sqlInfo } from "../utils/log4j";
import { dbQuery } from "./utils";

const { db } = config;

export const pool = mysql.createPool({
  host: db.host,
  user: db.username,
  password: db.password,
  database: db.database,
});

const initDb = async () => {
  try {
    console.log("Connection has been established successfully.");
  } catch (e) {
    console.log(e);
  }
};
export default initDb;
