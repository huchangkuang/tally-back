import Router from "koa-router";
import { dbQuery, sqlTask } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { getToken, jwtVerify } from "../utils/jwtValidate";

const routers = new Router();

export enum BillType {
  paid = 1,
  receive,
}
const { paid, receive } = BillType;
export const initTags = [
  { icon: "food", name: "餐饮", type: paid },
  { icon: "shop", name: "购物", type: paid },
  { icon: "clothes", name: "服饰", type: paid },
  { icon: "bus", name: "交通", type: paid },
  { icon: "entertainment", name: "娱乐", type: paid },
  { icon: "handshake", name: "社交", type: paid },
  { icon: "chat", name: "通讯", type: paid },
  { icon: "medical", name: "医疗", type: paid },
  { icon: "part_time_job", name: "兼职", type: receive },
  { icon: "salary", name: "工资", type: receive },
  { icon: "bonus", name: "奖金", type: receive },
  { icon: "lottery", name: "彩票", type: receive },
];

routers
  .get("/list", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const tags = await dbQuery<{ name: string }[]>(
      `select id,icon,name,type from tags where userId=${id};`,
    );
    ctx.body = successRes(tags);
  })
  .post("/add", async (ctx) => {
    const { name, type, icon } = (ctx.request as any).body;
    if (!name || !icon || !type) {
      ctx.body = failRes("名称|图标|类型不能为空");
      return;
    }
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const tags = await dbQuery<{ name: string }[]>(
      `select name from tags where userId=${id} and name='${name}';`,
    );
    if (tags.length) {
      ctx.body = failRes("标签名已存在");
      return;
    }
    await dbQuery(
      `insert into tags (name, userId, type, icon) values ('${name}',${id},${type},'${icon}');`,
    );
    ctx.body = successRes();
  })
  .post("/update", async (ctx) => {
    const token = getToken(ctx.header);
    const { id: userId } = await jwtVerify(token);
    const { id, name } = (ctx.request as any).body;
    if (!id || !name) {
      ctx.body = failRes("id或name不能为空");
      return;
    }
    await dbQuery(
      `update tags set name='${name}',updateAt=current_timestamp where id=${Number(
        id,
      )} and userId=${userId}`,
    );
    ctx.body = successRes();
  })
  .post("/del", async (ctx) => {
    const token = getToken(ctx.header);
    const { id: userId } = await jwtVerify(token);
    const { id } = (ctx.request as any).body;
    if (!id) {
      ctx.body = failRes("id不能为空");
      return;
    }
    await sqlTask(async () => {
      await dbQuery(
        `delete from tags where id=${Number(id)} and userId=${userId}`,
      );
      await dbQuery(`delete from billTags where tagId=${Number(id)};`);
    });
    ctx.body = successRes();
  });

export default routers;
