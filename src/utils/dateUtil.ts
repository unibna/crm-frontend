import { dd_MM_yyyy, dd_MM_yyyy_HH_mm_ss, HH_mm_ss_dd_MM_yyyy } from "constants/time";
import { addMinutes } from "date-fns";
import addMonths from "date-fns/addMonths";
import endOfMonth from "date-fns/endOfMonth";
import format from "date-fns/format";
import getMonth from "date-fns/getMonth";
import startOfMonth from "date-fns/startOfMonth";
import subDays from "date-fns/subDays";
import subMonths from "date-fns/subMonths";

export const INVALID_DATE = "Invalid date";
export const formatStringToLocalTime = (value: string) => {
  return format(new Date(value), dd_MM_yyyy_HH_mm_ss);
};

export type fDateType = string | number | null | undefined | Date;
export const fDate = (value: fDateType, typeFormat: string = dd_MM_yyyy): fDateType => {
  const result = value ? format(new Date(value), typeFormat) : null;
  return result === INVALID_DATE ? value : result;
};

export const fDateTime = (
  value: fDateType,
  typeFormat: string = HH_mm_ss_dd_MM_yyyy
): string | null => {
  const formatValue = value ? format(new Date(value), typeFormat) : null;
  return formatValue === INVALID_DATE ? null : formatValue;
};

export type timeStringFormatType = "%h" | "%h %m" | "%h %m %s";

export const fMinutesToTimeString = (value: number, format: timeStringFormatType = "%h %m %s") => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  const seconds = value * 60 - hours * 60 * 60 - minutes * 60;
  switch (format) {
    case "%h":
      return `${hours}h`;
    case "%h %m":
      return `${hours}h ${minutes}m`;
    default:
      return `${hours}h ${minutes}m ${seconds}s`;
  }
};

export const fSecondsToTimeString = (value: number, format: timeStringFormatType = "%h %m %s") => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor(value / 60) % 60;
  const seconds = value - hours * 60 * 60 - minutes * 60;
  switch (format) {
    case "%h":
      return `${hours}h`;
    case "%h %m":
      return `${hours}h ${minutes}m`;
    default:
      return `${hours}h ${minutes}m ${seconds}s`;
  }
};

export const transformDateFilter = (
  days = 1,
  formatString: string,
  haveToday: boolean,
  milestoneDate?: any
) => {
  if (Array.isArray(days)) {
    return {
      created_from: days[0],
      created_to: days[1],
    };
  }
  days = Number(days);
  // today
  if (days === 0) {
    return {
      created_from: format(subDays(milestoneDate || new Date(), 0), formatString),
      created_to: format(subDays(milestoneDate || new Date(), 0), formatString),
    };
  }
  // last n days
  if (days >= 0) {
    return {
      created_from: format(
        subDays(milestoneDate || new Date(), haveToday ? days - 1 : days),
        formatString
      ),
      created_to: format(subDays(milestoneDate || new Date(), haveToday ? 0 : 1), formatString),
    };
  }
  if (days === -2) {
    return {
      created_from: format(startOfMonth(subMonths(milestoneDate || new Date(), 1)), formatString),
      created_to: format(endOfMonth(subMonths(milestoneDate || new Date(), 1)), formatString),
    };
  }
  return {
    created_from: format(startOfMonth(milestoneDate || new Date()), formatString),
    created_to: format(milestoneDate || new Date(), formatString),
  };
};

export const transformMonthFilter = (days = 1, formatString: string) => {
  if (Array.isArray(days)) {
    return {
      created_from: days[0],
      created_to: days[1],
    };
  }
  days = Number(days);

  const month = getMonth(new Date());

  return {
    created_from:
      month > days
        ? format(startOfMonth(subMonths(new Date(), month - days)), formatString)
        : format(startOfMonth(addMonths(new Date(), days - month)), formatString),
    created_to:
      month > days
        ? format(endOfMonth(subMonths(new Date(), month - days)), formatString)
        : format(endOfMonth(addMonths(new Date(), days - month)), formatString),
  };
};

export const compareDateSelected = (from: string, to: string, value: string | number) => {
  if (value === "all") {
    return {
      date_from: undefined,
      date_to: undefined,
      value,
    };
  }
  return {
    date_from: from,
    date_to: to,
    value: value,
  };
};

export const convertFromDateToTimeStamp = (date: string | Date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

export const convertFromTimeStampToDate = (date: number) => {
  return fDate(date * 1000);
};

export const timeStampOfStartDate = (date: Date | string) => {
  return Math.floor(new Date(date).setUTCHours(0, 0, 0, 0) / 1000);
};

export const timeStampOfEndDate = (date: Date | string) => {
  return Math.floor(new Date(date).setUTCHours(23, 59, 59, 999) / 1000);
};

export const isDuration = (duration: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(duration);
};

export const formatISOToLocalDateString = (value?: string) => {
  return value?.replace("Z", "") + "+07:00";
};

export const formatDateTimeOriginalTimeZone = (date: any,dateTimeFormat: string) => {
  return format(
    addMinutes(new Date(date), new Date(date).getTimezoneOffset()),
    dateTimeFormat || "yyyy-MM-dd HH:mm:ss"
  );
}
