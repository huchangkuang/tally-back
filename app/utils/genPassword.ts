import crypto from "crypto";

export const genPassword = (password: string) => {
  const str = `password=${password}&key=${process.env.SECRET_KEY}`;
  const md5 = crypto.createHash("md5");
  return md5.update(str).digest("hex"); // 把输出编程16进制的格式
};
