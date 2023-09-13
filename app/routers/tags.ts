import Router from "koa-router";
import { dbQuery } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { errorRule } from "../utils/errorRule";
import { getToken, jwtSign, jwtVerify } from "../utils/jwtValidate";
import { genPassword } from "../utils/genPassword";

const routers = new Router();

routers
  .get("/", async (ctx) => {
    const { name } = (ctx.request as any).body;
    // const tags = await dbQuery<{ name: string }[]>(sql.tagNames)
  })
  .post("/add", async (ctx) => {
    const token = getToken(ctx.header);
    const { idName, id } = await jwtVerify(token);
    const { name } = (ctx.request as any).body;
    const tags = await dbQuery<{ name: string }[]>(
      `select name from tags where userId=${id} and name='${name}';`,
    );
    if (tags.length) {
      ctx.body = failRes("标签名已存在");
      return;
    }
    const users = await dbQuery<{ id: number }[]>(
      `select id from users where idName='${idName}';`,
    );
    if (users.length) {
      await dbQuery(
        `insert into tags (name, userId) values ('${name}', ${users[0].id});`,
      );
      ctx.body = successRes();
      ctx.res.statusCode = 200;
    }
  });

export default routers;
