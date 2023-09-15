import Router from "koa-router";
import { dbQuery, objToSqlFields, sqlTask } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { getToken, jwtVerify } from "../utils/jwtValidate";
import { arrDiff } from "../utils/arrDiff";

const routers = new Router();

type BillItem = {
  id: number;
  name: string;
  userId: number;
  cash: number;
  type: number;
  createAt: string;
  updateAt: string;
  remark: string;
};
type TagItem = {
  billId: number;
  tagId: number;
};
routers
  .get("/list", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const [bills, tags] = await Promise.all([
      dbQuery<BillItem[]>(`select * from bills where userId=${id};`),
      dbQuery<TagItem[]>(
        `select billId,tagId from billTags left join bills on billTags.billId=bills.id where userId=${id};`,
      ),
    ]);
    ctx.body = successRes(
      bills.map((i) => ({
        ...i,
        tags: tags.filter((j) => j.billId === i.id).map((t) => t.tagId),
      })),
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
    if (tags.length) {
      const queryTags = await dbQuery<{ id: number }[]>(
        `select id from tags where id in (${tags.join(",")});`,
      );
      if (tags.length !== queryTags.length) {
        ctx.body = failRes("添加的标签不存在或已删除");
        return;
      }
    }
    const tagValues = tags.map((i) => `(last_insert_id(),${i})`).join(",");
    await sqlTask(async () => {
      await dbQuery(
        `insert into bills (userId,cash,type,remark,name) values (${id},${Number(
          cash,
        )},${Number(type)},'${remark}','${name}');`,
      );
      if (tags.length) {
        await dbQuery(
          `insert into billTags (billId,tagId) values ${tagValues};`,
        );
      }
    });
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
    const noUpdate = !cash && !name && !type && !remark;
    if (noUpdate && !tags) {
      ctx.body = failRes("至少修改一项账单内容");
      return;
    }
    if (tags.length) {
      const queryTags = await dbQuery<{ id: number }[]>(
        `select id from tags where id in (${tags.join(",")});`,
      );
      if (tags.length !== queryTags.length) {
        ctx.body = failRes("修改的标签不存在或已删除");
        return;
      }
    }
    const fields = objToSqlFields({
      cash,
      type,
      remark,
      name,
    });
    await sqlTask(async () => {
      if (!noUpdate) {
        await dbQuery(
          `update bills set ${fields},updateAt=current_timestamp where id=${Number(
            id,
          )} and userId=${userId};`,
        );
      }
      if (tags !== undefined) {
        const preTags = await dbQuery<{ tagId: number }[]>(
          `select tagId from billTags where billId=${id};`,
        );
        const { diff1, diff2 } = arrDiff(
          preTags.map((i) => i.tagId),
          tags,
        );
        const insertTagValues = diff2.map((i) => `(${id},${i})`).join(",");
        await sqlTask(async () => {
          await dbQuery(
            `delete from billTags where tagId in (${diff1.join(
              ",",
            )}) and billId=${id};`,
          );
          await dbQuery(
            `insert into billTags (billId, tagId) values ${insertTagValues};`,
          );
        });
      }
    });
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
        `delete from bills where id=${Number(id)} and userId=${userId};`,
      );
      await dbQuery(`delete from billTags where billId=${id};`);
    });
    ctx.body = successRes();
  });

export default routers;
