import { pool } from "./index";
import { errorLog } from "../utils/log4j";
import fs from "fs";
import { FileDirItem } from "../utils/walkFIle";

export const dbQuery = <T>(sql: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        errorLog(
          `errno:${err.errno}|path:${err.path}|code:${err.code}|message:${err.message}`,
        );
      }
      (connection as any).query(sql, (error, result: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
          connection.release();
        }
      });
    });
  });
};

export const runSqlScript = (files: FileDirItem[]) => {
  files.forEach((i) => {
    if (i.child) {
      runSqlScript(i.child);
    } else {
      const content = fs.readFileSync(i.path);
      dbQuery(content.toString());
    }
  });
};

export const objToSqlFields = (obj: Record<string, any>) =>
  Object.entries(obj)
    .filter((i) => i !== undefined)
    .map(([k, v]) => `${k}='${v}'`)
    .join(",");

export const sqlTask = async (fn: () => Promise<any>) => {
  await dbQuery("begin;");
  await fn();
  await dbQuery("commit;");
};
