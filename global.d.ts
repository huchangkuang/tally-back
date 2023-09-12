declare module "koa" {
  interface Request {
    body?: Record<string, any>;
    rawBody: string;
  }
}
