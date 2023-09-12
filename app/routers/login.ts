import Router from "koa-router";
import { error } from "../utils/log4j";
import User from "../model/userModel";

const routers = new Router();

routers.post("/login", async (ctx) => {
  const { userName, password } = ctx.request.body;
  try {
    const res = await User.findOne({
      where: {
        name: userName,
        password: password,
      },
    });
    console.log(res);
    ctx.res.statusCode = 200;
  } catch (e) {
    console.log(e);
  }
  // console.log(userName, password);
  // ctx.body = "hello";
  // ctx.res.statusCode = 200;
  // const jane = await User.create({
  //   name: "Jane",
  //   age: 18,
  //   favoriteColor: "red",
  //   cash: 999,
  // });
});
// .post("/signUp", (ctx) => {
//   ctx.body = {
//     msg: "success",
//     data: "login",
//   };
//   ctx.res.statusCode = 200;
//   error("errorTest");
// });

export default routers;
