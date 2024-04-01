import { COMMAS_REGEX } from "constants/index";
import replace from "lodash/replace";
import numeral from "numeral";

// ----------------------------------------------------------------------

export function fCurrency(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number: string | number) {
  return numeral(number).format("0.0%");
}

export function fPercentOmitDecimal(number: string | number) {
  return numeral(number).format("0%");
}

export function fNumber(number: string | number = 0) {
  return numeral(number).format();
}

export function fShortenNumber(number: string | number) {
  return replace(numeral(number).format("0.00a"), ".00", "");
}

export function fData(number: string | number) {
  return numeral(number).format("0.0 b");
}

export function fCurrency2(value: string | number, attach?: string) {
  return (value && `${value.toLocaleString("vi-VI")}${attach || ""}`) || value;
}

export const fValueVnd = (value: number, hideAttach?: boolean) => {
  return `${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0}${
    hideAttach ? "" : " ₫"
  }`;
};
