import Router from "koa-router";
import { dbQuery, objToSqlFields } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { errorRule } from "../utils/errorRule";
import { getToken, jwtSign, jwtVerify } from "../utils/jwtValidate";
import { genPassword } from "../utils/genPassword";

const routers = new Router();

type UserInfo = {
  id: number;
  userName: string;
  avatar: string;
  password: string;
  createAt: string;
  updateAt: string;
};
routers
  .post("/login", async (ctx) => {
    const { idName, password } = (ctx.request as any).body;
    if (!idName || !password) {
      ctx.body = failRes("账号或密码不能为空");
      return;
    }
    const md5pwd = genPassword(password);
    const res = await dbQuery<UserInfo[]>(
      `select * from users where idName='${idName}';`,
    );
    if (res.length) {
      const { userName, id, avatar, password } = res[0];
      if (password !== md5pwd) {
        ctx.body = failRes("密码错误", 20);
        ctx.res.statusCode = 500;
        return;
      }
      const token = jwtSign({
        idName: idName,
        password: md5pwd,
        id,
      });
      ctx.body = successRes({ token, userName, avatar });
    } else {
      ctx.body = failRes("用户名不存在", 10);
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
  })
  .get("/info", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const res = await dbQuery<UserInfo[]>(
      `select * from users where id='${id}';`,
    );
    if (res.length) {
      const { userName, avatar, id } = res[0];
      ctx.body = successRes({ userName, avatar, id });
    } else {
      ctx.body = failRes("找不到该用户信息");
    }
  });

export default routers;
