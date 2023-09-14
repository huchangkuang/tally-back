export const arrDiff = <T extends string | number>(arr1: T[], arr2: T[]) => {
  const commonArr = arr1.reduce(
    (arr, i) => (arr2.includes(i) ? [...arr, i] : arr),
    [],
  );
  const diff1 = arr1.filter((i) => !commonArr.includes(i));
  const diff2 = arr2.filter((i) => !commonArr.includes(i));
  return {
    commonArr,
    diff1,
    diff2,
  };
};
