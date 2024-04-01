import { dd_MM_yyyy } from "constants/time";
import format from "date-fns/format";

export const getStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const deleteStorage = (key: string) => {
  return localStorage.removeItem(key);
};

export const deleteAllStorages = () => {
  localStorage.clear();
  return localStorage.setItem("today", format(new Date(), dd_MM_yyyy));
};

export const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, value);
};
