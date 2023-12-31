import jwt from "jsonwebtoken";

export const getToken = (header) => {
  const { authorization } = header;
  return authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : authorization;
};

export const jwtSign = (option: {
  idName: string;
  password: string;
  id: number;
}) =>
  jwt.sign(
    { ...option, iat: Math.floor(Date.now() / 1000) },
    process.env.PRIVATE_KEY,
    { expiresIn: "7d" },
  );

export const jwtVerify = (token: string): Promise<Record<string, any>> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.PRIVATE_KEY, (error, decode) => {
      if (error) {
        reject(error);
      } else {
        resolve(decode as Record<string, any>);
      }
    });
  });
