type ErrorRuleItem = {
  rule: boolean;
  msg: string;
  code?: number;
};
export const errorRule = (
  rules: ErrorRuleItem[],
): Omit<ErrorRuleItem, "rule"> => {
  const l = rules.filter((i) => i.rule);
  if (l.length) return l[0];
  return { msg: "" };
};
