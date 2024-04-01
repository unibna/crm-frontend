import { PHONE_REGEX } from "constants/index";

export const regexAlphanumeric = (str: string) => {
  return str.replace(/[^a-zA-Z0-9\s]/gi, "") as string;
};

export const regexNumeric = (str: string) => {
  return str.replace(/[^0-9\s]/gi, "") as string;
};

export const isVietnamesePhoneNumber = (number: string) => {
  //eslint-disable-next-line
  return PHONE_REGEX.test(number);
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const toSimplest = (str: string = "") => {
  str = str.toString();
  if (str) {
    str = str.toLowerCase();
    str = str.replace(/ /g, "");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\r\n|\r|\n|\t/g, ""); //
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ""
    );

    str = str.replace(/ + /g, "");
  } else {
    str = "";
  }
  return str;
};

export function linkifyUtil(text: string) {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function matchPhoneNumber(input: string = "") {
  if (input.length > 9) {
    const frontRegex = /0(.+)/;
    const behindRegex = /(.+)[0-9]/;
    const match = input.match(frontRegex);
    return match?.[0].match(behindRegex)?.[0] || input;
  }
  return input;
}
