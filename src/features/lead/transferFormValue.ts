import { PhoneLeadType } from "_types_/PhoneLeadType";
import { regexNumeric } from "utils/stringsUtil";

export const transferLeadValue = (value: any, name?: keyof PhoneLeadType) => {
  let valueFormat = value;
  if (value === "false") {
    valueFormat = false;
  }
  if (value === "true") {
    valueFormat = true;
  }
  if (value === "none") {
    valueFormat = null;
  }
  if (name === "phone") {
    if (value === "-" || value === "+") return;
    valueFormat = regexNumeric(value);
  }
  return valueFormat;
};
