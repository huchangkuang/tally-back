import { pool } from "./index";

export const dbQuery = <T>(sql: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }
      connection.query(sql, (error, result: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  });
};

export const createTable = async (
  tableName: string,
  value: Record<string, string>,
  primaryKey?: string,
) => {
  const valueStr = Object.entries(value)
    .map((i) => i.join(" "))
    .join(",");
  try {
    await dbQuery(`create tables if not exists ${tableName} (
      ${valueStr}
      ${primaryKey ? `,PRIMARY KEY (${primaryKey})` : ""}
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  } catch (e) {}
};
