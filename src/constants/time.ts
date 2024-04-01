import { ALL_OPTION } from "constants/index";

export const yyyy_MM_dd = "yyyy-MM-dd";
export const yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss";
export const dd_MM_yyyy = "dd/MM/yyyy";
export const dd_MM_yyyy_HH_mm_ss = "dd-MM-yyyy-HH:mm:ss";
export const HH_mm_ss_dd_MM_yyyy = "HH:mm dd/MM/yyyy";
export const dd_MM_yyyy_HH_mm = "dd/MM/yyyy HH:mm";

export const RANGE_DATE_OPTIONS = [
  { ...ALL_OPTION },
  { label: "Hôm nay", value: 0, haveToday: true },
  { label: "Hôm qua", value: 1, haveToday: false },
  { label: "3 ngày trước", value: 3, haveToday: false },
  { label: "7 ngày trước", value: 7, haveToday: false },
  { label: "14 ngày trước", value: 14, haveToday: false },
  { label: "30 ngày trước", value: 30, haveToday: false },
  { label: "90 ngày trước", value: 90, haveToday: false },
  { label: "Tháng trước", value: -2, haveToday: false },
  { label: "Tháng này", value: -1, haveToday: true },
  { label: "3 ngày trước và hôm nay", value: 4, haveToday: true },
  { label: "7 ngày trước và hôm nay", value: 8, haveToday: true },
  { label: "14 ngày trước và hôm nay", value: 15, haveToday: true },
  { label: "30 ngày trước và hôm nay", value: 31, haveToday: true },
  { label: "90 ngày trước và hôm nay", value: 91, haveToday: true },
  { label: "Tùy chọn", value: "custom_date" },
  // { label: "Tùy chọn so sánh", value: "custom_compare_date" },
];

export const RANGE_MONTH_OPTIONS = [
  { ...ALL_OPTION },
  { label: "Tháng 1", value: 1 },
  { label: "Tháng 2", value: 2 },
  { label: "Tháng 3", value: 3 },
  { label: "Tháng 4", value: 4 },
  { label: "Tháng 5", value: 5 },
  { label: "Tháng 6", value: 6 },
  { label: "Tháng 7", value: 7 },
  { label: "Tháng 8", value: 8 },
  { label: "Tháng 9", value: 9 },
  { label: "Tháng 10", value: 10 },
  { label: "Tháng 11", value: 11 },
  { label: "Tháng 12", value: 12 },
  { label: "Tùy chọn", value: "custom_date" },
];

export const arrDateTimeDefault = [
  "created_time",
  "start_time",
  "stop_time",
  "updated_time",
  "created",
  "modified",
  "updated_at",
  "created_at",
  "tracking_created_at",
  "estimated_delivery_date",
  "finish_date",
];
