import { objToSqlFields } from "../../db/utils";

describe("objToSqlFields", () => {
  it("should filter undefined", function () {
    const obj = {
      a: 1,
      b: "234",
      d: undefined,
      f: null,
      g: 0,
      i: "",
      h: false,
    };
    const str = objToSqlFields(obj);
    expect(str).toStrictEqual(`a=1,b='234',f=null,g=0,i='',h=false`);
  });
});
