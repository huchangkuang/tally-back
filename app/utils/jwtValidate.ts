import jwt from "jsonwebtoken";

export const sign = (option: { idName: string; password: string }) =>
  jwt.sign(
    { ...option, iat: Math.floor(Date.now() / 1000) },
    process.env.privateKey,
    { expiresIn: "7d" },
  );

export const verify = (token) => jwt.verify(token, process.env.privateKey);