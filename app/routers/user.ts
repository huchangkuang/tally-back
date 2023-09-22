import Router from "koa-router";
import { dbQuery, objToSqlFields, sqlTask } from "../db/utils";
import { failRes, successRes } from "../utils/resBody";
import { getToken, jwtSign, jwtVerify } from "../utils/jwtValidate";
import { genPassword } from "../utils/genPassword";
import { initTags } from "./tags";
import dayjs from "dayjs";

const routers = new Router();

type UserInfo = {
  id: number;
  idName: string;
  userName: string;
  avatar: string;
  budget: number;
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
    await sqlTask(async () => {
      await dbQuery(
        `insert into users (idName, password) values ('${idName}', '${genPassword(
          password,
        )}');`,
      );
      const values = initTags.map(
        (i) => `('${i.name}',${i.type},'${i.icon}',last_insert_id())`,
      );
      await dbQuery(
        `insert into tags (name, type, icon, userId) values ${values}`,
      );
    });
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
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const startTime = `${year}-${(month + 1).toString().padStart(2, "0")}-01`;
      const endTime = `${year}-${(month + 2).toString().padStart(2, "0")}-01`;
      const [expenses, incomes, reports, billDates] = await Promise.all([
        dbQuery(
          `select sum(bills.cash) as expense from bills where bills.createAt >= '${startTime}' and bills.createAt < '${endTime}' and bills.type=1;`,
        ),
        dbQuery(
          `select sum(bills.cash) as income from bills where bills.createAt >= '${startTime}' and bills.createAt < '${endTime}' and bills.type=2;`,
        ),
        dbQuery(
          `select count(reportDate) as reportNum,max(reportDate) as reportDate from userReports where userId=${id};`,
        ),
        dbQuery(
          `select count(*) as recordNum from bills where userId=${id} group by date;`,
        ),
      ]);
      const { idName, userName, avatar, budget } = res[0];
      ctx.body = successRes({
        id,
        idName,
        userName,
        avatar,
        budget,
        expense: expenses[0]?.expense ?? 0,
        income: incomes[0]?.income,
        reportNum: reports[0]?.reportNum ?? 0,
        reportDate: reports[0]?.reportDate ?? "",
        billsNum: (billDates as { recordNum: number }[]).reduce(
          (sum, i) => sum + i.recordNum,
          0,
        ),
      });
    } else {
      ctx.body = failRes("找不到该用户信息");
    }
  })
  .post("/report", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    const date = dayjs().format("YYYY-MM-DD");
    const res = await dbQuery<{ reportDate: string }[]>(
      `select max(reportDate) as reportDate from userReports where userId=${id};`,
    );
    if (res.length && dayjs(res[0].reportDate).format("YYYY-MM-DD") === date) {
      ctx.body = failRes("当日已经打过卡了");
      return;
    }
    await dbQuery(
      `insert into userReports (userId, reportDate) values (${id},'${date}');`,
    );
    ctx.body = successRes();
  })
  .post("/loginOut", async (ctx) => {
    const token = getToken(ctx.header);
    const { id } = await jwtVerify(token);
    await sqlTask(async () => {
      await dbQuery(`delete from users where id=${id};`);
      await dbQuery(`delete from bills where userId=${id};`);
      const res = await dbQuery<{ id: number }[]>(
        `select id from tags where userId=${id};`,
      );
      await dbQuery(`delete from tags where userId=${id};`);
      if (res.length) {
        await dbQuery(
          `delete from billTags where tagId in (${res
            .map((i) => i.id)
            .join(",")});`,
        );
      }
      await dbQuery(`delete from userReports where userId=${id};`);
    });
    ctx.body = successRes();
  });

export default routers;
