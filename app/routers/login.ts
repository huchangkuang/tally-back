import Router from "koa-router";
import { dbQuery, objToSqlFields } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { errorRule } from "../utils/errorRule";
import { getToken, jwtSign, jwtVerify } from "../utils/jwtValidate";
import { genPassword } from "../utils/genPassword";

const routers = new Router();

routers
  .post("/login", async (ctx) => {
    const { idName, password } = (ctx.request as any).body;
    if (!idName || !password) {
      ctx.body = failRes("账号或密码不能为空");
      return;
    }
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
    if (!idName || !password) {
      ctx.body = failRes("账号或密码不能为空");
      return;
    }
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
  })
  .post("/editInfo", async (ctx) => {
    const { userName, avatar } = (ctx.request as any).body;
    if (!userName && !avatar) {
      ctx.body = failRes("用户名或头像不能为空");
      return;
    }
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    await dbQuery(
      `update users set ${objToSqlFields({
        userName,
        avatar,
      })},updateAt=current_timestamp where id=${id};`,
    );
    ctx.body = successRes();
  })
  .post("/budget", async (ctx) => {
    const { num } = (ctx.request as any).body;
    if (!num) {
      ctx.body = failRes("预算金额不能为空");
      return;
    }
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    await dbQuery(
      `update users set ${objToSqlFields({
        budget: Number(num),
      })},updateAt=current_timestamp where id=${id};`,
    );
    ctx.body = successRes();
  });

export default routers;
