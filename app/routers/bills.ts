import Router from "koa-router";
import { dbQuery, objToSqlFields } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { getToken, jwtVerify } from "../utils/jwtValidate";

const routers = new Router();

type BillItem = {
  id: number;
  name: string;
  userId: number;
  tags: string;
  cash: number;
  type: number;
  createAt: string;
  updateAt: string;
  remark: string;
};
routers
  .get("/list", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const bills = await dbQuery<BillItem[]>(
      `select * from bills where userId=${id};`,
    );
    ctx.body = successRes(
      bills.map((i) => ({ ...i, tags: JSON.parse(i.tags) })),
    );
  })
  .post("/add", async (ctx) => {
    // type: 1支出，收入
    const {
      cash,
      type,
      tags = [],
      remark = "",
      name,
    } = (ctx.request as any).body;
    if (!cash || !type) {
      ctx.body = failRes("名称|金额|类型不能为空");
      return;
    }
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    await dbQuery(
      `insert into bills (userId,cash,type,tags,remark,name) values (${id},${Number(
        cash,
      )},${Number(type)},'${JSON.stringify(tags)}','${remark}','${name}');`,
    );
    ctx.body = successRes();
  })
  .post("/update", async (ctx) => {
    const token = getToken(ctx.header);
    const { id: userId } = await jwtVerify(token);
    const { cash, type, tags, remark, name, id } = (ctx.request as any).body;
    if (!id) {
      ctx.body = failRes("账单id不能为空");
      return;
    }
    if (!cash && !name && !type && !tags && !remark) {
      ctx.body = failRes("至少修改一项账单内容");
      return;
    }
    await dbQuery(
      `update bills set ${objToSqlFields({
        cash,
        type,
        tags,
        remark,
        name,
      })},updateAt=current_timestamp where id=${Number(
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
    await dbQuery(
      `delete from bills where id=${Number(id)} and userId=${userId}`,
    );
    ctx.body = successRes();
  });

export default routers;
