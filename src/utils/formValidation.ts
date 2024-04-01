import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import omitBy from "lodash/omitBy";
import { fDateTime } from "./dateUtil";
import { isVietnamesePhoneNumber, toSimplest } from "./stringsUtil";

export const requiredRule = {
  isValid: (value: string | number) => value?.toString().trim().length > 0,
  errorText: (value: string) => "Double click để thêm giá trị",
};

export const phoneRule = {
  isValid: (phone: string) => (phone ? isVietnamesePhoneNumber(toSimplest(phone)) : false),
  errorText: (value: string) => VALIDATION_MESSAGE.FORMAT_PHONE,
};

export const dateRule = {
  isValid: (value: string) => (fDateTime(value) ? true : false),
  errorText: (value: string) => VALIDATION_MESSAGE.REQUIRE_PAYMENT_DATE,
};

export const numberRule = {
  isValid: (value: string) => (parseInt(value) >= 0 ? true : false),
  errorText: (value: string) => VALIDATION_MESSAGE.REQUIRE_NUMBER,
};

export const errorLabel = (validationStatus: { [key: string]: object } = {}) => {
  const rowError = Object.keys(validationStatus);
  if (rowError.length) {
    // dòng lỗi đầu tiên
    const errorObject = validationStatus?.[rowError[0]];
    const errorObjectKeys = Object.keys(errorObject);
    // ô lỗi đầu tiên
    const errorLabel = (errorObject?.[errorObjectKeys[0] as keyof typeof errorObject] as any).error;

    return `${errorLabel} dòng ${rowError[0]}`;
  }
  return "";
};

/**
 *
 * @author ngovanvien1010
 * @param changed là object chứa trường của cột đã thay đổi kèm theo index của row
 * @param validationStatus là trạng thái lỗi trước đó nếu có
 * @param validationRules  scope để check các trường
 * @var isValid kiểm tra giá trị thay đổi có match với validateRules không
 * @var rowStatus chứa các trường lỗi thuộc 1 dòng
 * @var acc là một trường trong các trường lỗi của @var rowStatus
 * @var field là tên trường thay đổi dữ liệu
 * @returns các trường lỗi của nhiều dòng trong bảng
 */

export const validate = (
  changed: {
    [key: string]: any;
  },
  validationStatus: {
    [key: string]: any;
  },
  validationRules: any
) =>
  Object.keys(changed).reduce((status: { [key: string]: any }, id) => {
    let rowStatus = validationStatus[id] || {};
    if (changed[id]) {
      rowStatus = {
        ...rowStatus,
        ...Object.keys(changed[id]).reduce((acc, field) => {
          const isValid = validationRules[field]?.isValid(changed[id][field]);
          return isValid === false
            ? // nếu giá trị trường lỗi bị thay đổi thì tạo object message
              {
                ...acc,
                [field]: {
                  isValid: false,
                  error: validationRules[field]?.errorText(changed[id][field]),
                },
              }
            : // khi giá trị trường đúng
              { ...acc, [field]: undefined };
        }, {}),
      };
      // xoá bỏ các trường đúng
      rowStatus = omitBy(rowStatus, (item) => item === undefined);
    }

    if (Object.keys(rowStatus).length > 0) {
      // nếu có trường bị lỗi thì kế thừa từ lỗi trước đó và chèn tiếp vào
      return { ...validationStatus, ...status, [id]: rowStatus };
    } else {
      //nếu khong có trường nào bị lỗi của row thì xoá row đó ra khỏi validationStatus thông qua id
      delete status[id];
      delete validationStatus[id];
      return { ...validationStatus, ...status };
    }
  }, {});
