import config from "../../config";
import mysql from "mysql2";
import walkFile from "../utils/walkFIle";
import path from "path";
import { runSqlScript } from "./utils";

const { db } = config;

export const pool = mysql.createPool({
  host: db.host,
  user: db.username,
  password: db.password,
  database: db.database,
});

const initDb = async () => {
  try {
    const files = await walkFile(path.resolve(__dirname, "sql"));
    runSqlScript(files);
    console.log("Connection has been established successfully.");
  } catch (e) {
    console.log(e);
  }
};
export default initDb;
