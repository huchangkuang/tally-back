import Router from "koa-router";
import { dbQuery } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { errorRule } from "../utils/errorRule";
import { sign } from "../utils/jwtValidate";

const routers = new Router();

const sql = {
  queryUser: `select idName, password from user;`,
};
type UserAccount = { idName: string; password: string };

routers
  .post("/login", async (ctx) => {
    const { idName, password } = (ctx.request as any).body;
    console.log(idName, password);
    const res = await dbQuery<UserAccount[]>(sql.queryUser);
    const valid = res.some(
      (i) => i.idName === idName && i.password === password,
    );
    if (valid) {
      const token = sign({ idName: idName, password });
      ctx.body = successRes({ token });
      ctx.res.statusCode = 200;
    } else {
      const { msg, code } = errorRule([
        {
          rule: !res.some((i) => i.idName === idName),
          msg: "用户名不存在",
          code: 10,
        },
        {
          rule: res.find((i) => i.idName === idName)?.password !== password,
          msg: "密码错误",
          code: 20,
        },
      ]);
      ctx.body = failRes(msg, code);
      ctx.res.statusCode = 500;
    }
  })
  .post("/signUp", async (ctx) => {
    const { idName, password } = (ctx.request as any).body;
    const res = await dbQuery<UserAccount[]>(sql.queryUser);
    if (res.length && res[0].idName === idName) {
      ctx.body = failRes("用户已注册");
      ctx.res.statusCode = 200;
      return;
    }
    await dbQuery(
      `insert into user (idName, password) values ('${idName}', '${password}');`,
    );
    ctx.body = successRes();
  });

export default routers;
