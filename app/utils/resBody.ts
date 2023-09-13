export const resBody = (body: { msg: string; data: any; code: number }) => body;

export const successRes = (data: any = "") =>
  resBody({ data, msg: "success", code: 0 });
export const failRes = (msg = "", code = -1) =>
  resBody({ code, msg, data: null });
