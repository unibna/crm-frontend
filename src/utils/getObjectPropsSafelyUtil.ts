import mapValues from "lodash/mapValues";
import groupBy from "lodash/groupBy";

export const getObjectPropSafely = (fn: any, defaultValue = "") => {
  try {
    return fn();
  } catch (error) {
    return defaultValue;
  }
};

export const multiGroupBy = (seq: any[], keys: string[]) => {
  if (!keys.length) return seq;
  var first = keys[0];
  var rest = keys.slice(1);
  const values: any = mapValues(groupBy(seq, first), function (value) {
    return multiGroupBy(value, rest);
  });
  return values;
};
