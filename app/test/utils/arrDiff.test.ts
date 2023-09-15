import { arrDiff } from "../../utils/arrDiff";

describe("arrDiff", () => {
  it("diff arr1", function () {
    const arr1 = [1, 2, 3, 4, 5, 6];
    const arr2 = [1, 2, 3];
    const { commonArr, diff1, diff2 } = arrDiff(arr1, arr2);
    expect(commonArr).toStrictEqual([1, 2, 3]);
    expect(diff1).toStrictEqual([4, 5, 6]);
    expect(diff2).toStrictEqual([]);
  });
  it("diff arr2", function () {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3, 4, 5, 6];
    const { commonArr, diff1, diff2 } = arrDiff(arr1, arr2);
    expect(commonArr).toStrictEqual([1, 2, 3]);
    expect(diff1).toStrictEqual([]);
    expect(diff2).toStrictEqual([4, 5, 6]);
  });
  it("get union arr", function () {
    const arr1 = [3, 4, 5];
    const arr2 = [4, 5, 6];
    const { commonArr, diff1, diff2 } = arrDiff(arr1, arr2);
    expect(commonArr).toStrictEqual([4, 5]);
    expect(diff1).toStrictEqual([3]);
    expect(diff2).toStrictEqual([6]);
  });
});
