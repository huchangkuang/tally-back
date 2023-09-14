import Router from "koa-router";
import { dbQuery } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { getToken, jwtVerify } from "../utils/jwtValidate";

const routers = new Router();

routers
  .get("/list", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const tags = await dbQuery<{ name: string }[]>(
      `select id,name from tags where userId=${id};`,
    );
    ctx.body = successRes(tags);
  })
  .post("/add", async (ctx) => {
    const { name } = (ctx.request as any).body;
    if (!name) {
      ctx.body = failRes("标签名不能为空");
      return;
    }
    const token = getToken(ctx.header);
    const { idName, id } = await jwtVerify(token);
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
    }
  })
  .post("/update", async (ctx) => {
    const { id, name } = (ctx.request as any).body;
    if (!id || !name) {
      ctx.body = failRes("id或name不能为空");
      return;
    }
    await dbQuery(`update tags set name='${name}' where id=${Number(id)}`);
    ctx.body = successRes();
  })
  .post("del", async (ctx) => {
    const { id } = (ctx.request as any).body;
    if (!id) {
      ctx.body = failRes("id不能为空");
      return;
    }
    await dbQuery(`delete from tags where id=${Number(id)}`);
    ctx.body = successRes();
  });

export default routers;
