import Router from "koa-router";
import { dbQuery } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { errorRule } from "../utils/errorRule";
import { jwtSign } from "../utils/jwtValidate";
import { genPassword } from "../utils/genPassword";

const routers = new Router();

routers
  .post("/login", async (ctx) => {
    const { idName, password } = (ctx.request as any).body;
    const md5pwd = genPassword(password);
    const res = await dbQuery<{ id: number; password: string }[]>(
      `select id, password from users where idName='${idName}';`,
    );
    if (res.length) {
      const token = jwtSign({
        idName: idName,
        password: md5pwd,
        id: res[0].id,
      });
      ctx.body = successRes({ token });
      ctx.res.statusCode = 200;
    } else {
      const { msg, code } = errorRule([
        {
          rule: !res.length,
          msg: "用户名不存在",
          code: 10,
        },
        {
          rule: res.length && res[0].password !== md5pwd,
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
    const res = await dbQuery<{ idName: string }[]>(
      `select idName from users where idName='${idName}';`,
    );
    if (res.length) {
      ctx.body = failRes("用户已注册");
      ctx.res.statusCode = 200;
      return;
    }
    await dbQuery(
      `insert into users (idName, password) values ('${idName}', '${genPassword(
        password,
      )}');`,
    );
    ctx.body = successRes();
  });

export default routers;
