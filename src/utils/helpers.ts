import { CANCEL } from "constants/index";
import { getObjectPropSafely } from "./getObjectPropsSafelyUtil";
import { toSimplest } from "./stringsUtil";

export const groupBy = function (xs: any, key: any) {
  return xs.reduce(function (rv: any, x: any) {
    if (Array.isArray(x[key])) {
      x[key].map((item: any) => {
        (rv[item] = rv[item] || []).push(x);
      });
    } else (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const cloneData = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const isCancelRequest = (res: any) => {
  return res?.error?.message === CANCEL;
};

export function stringToSlug(str: string) {
  // remove accents
  let from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return str;
}

export const downscaleImage = async ({
  file,
  resizingFactor = 0.8,
  quality = 0.7,
}: {
  file: File;
  resizingFactor?: number;
  quality?: number;
}) => {
  return new Promise((resolve) => {
    const { type: mimeType } = file;
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      // Handle the failure properly
      console.log("Cannot load image");
      resolve(undefined);
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * resizingFactor;
      canvas.height = img.height * resizingFactor;

      const context = canvas.getContext("2d", { alpha: false });
      context?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, mimeType, quality);
    };
  });
};

export function dateIsValid(date: any) {
  return !Number.isNaN(new Date(date).getTime());
}

export const normalizeInput = (value: string, previousValue: string) => {
  // return nothing if no value
  if (!value) return value;

  // only allows 0-9 inputs
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    // returns: "x", "xx", "xxx"
    if (cvLength < 4) return currentValue;

    // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;

    // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
  return value;
};

function toLowerCaseNonAccentVietnamese(str: string) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const standardString = (value: string) => {
  return toLowerCaseNonAccentVietnamese(value).trim();
};

export function getPastelColor(number?: number) {
  return (
    "hsl(" +
    360 * (1 - (number || 0) || Math.random()) +
    "," +
    (25 + 70 * (number || 0) || Math.random() * Math.random()) +
    "%," +
    (85 + 10 * (number || 0) || Math.random() * Math.random()) +
    "%)"
  );
}

export function randomHSLA(number?: number) {
  return `hsla(${~~(360 * (number ? number : Math.random()))}, 70%,  72%, 0.6)`;
}

export function isValidImageURL(url: string) {
  if (typeof url !== "string") return false;
  return !!url.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
}

export function isValidPdfURL(url: string) {
  if (typeof url !== "string") return false;
  return !!url.match(/\w+\.(pdf)$/gi);
}

export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function formatDuration(duration: string) {
  if (!duration || duration[0] === ":" || duration[duration.length - 1] === ":") return "";
  const arr = duration.split(":");
  if (arr.length > 3) return "";
  if (arr.length === 1) {
    if (!isNumeric(arr[0])) return "";
    let totalMinutes = +arr[0];
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  }
  if (arr.length === 2) {
    const hourPart = arr[0];
    const minutePart = arr[1];

    if (!(isNumeric(hourPart) && isNumeric(minutePart))) return "";
    if (+minutePart < 60) {
      return String(+hourPart).padStart(2, "0") + ":" + String(+minutePart).padStart(2, "0");
    } else {
      let hours = +hourPart + Math.floor(+minutePart / 60);
      let minutes = +minutePart % 60;
      return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
    }
  }
  return "";
}

export const compareStringSearch = (value: string, search: string) => {
  return (
    toSimplest(value).includes(toSimplest(search)) || toSimplest(search).includes(toSimplest(value))
  );
};
export function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export function getSelectionText() {
  let text = "";
  let activeEl: any = document.activeElement;
  let activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    activeElTagName == "textarea" ||
    (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl?.type) &&
      typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection()?.toString() || "";
  }
  return text;
}
