import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { PHONE_REGEX } from "constants/index";
import { LEAD_STATUS } from "views/LeadCenterView/constants";
import * as yup from "yup";

export const leadFormSchema = yup.object().shape({
  phone: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).matches(PHONE_REGEX, {
    message: VALIDATION_MESSAGE.FORMAT_PHONE,
  }),
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
  product: yup.number().required(VALIDATION_MESSAGE.SELECT_PRODUCT),
  channel: yup.number().required(VALIDATION_MESSAGE.SELECT_CHANNEL),
  is_require_call_later_at: yup.boolean(),
  call_later_at: yup
    .string()
    .when("is_require_call_later_at", {
      is: (is_require_call_later_at: boolean = false) => !!is_require_call_later_at,
      then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CALL_LATER_AT).nullable(),
    })
    .nullable(),
  order_information: yup
    .string()
    .when("lead_status", {
      is: (lead_status: number) => lead_status?.toString() === LEAD_STATUS.HAS_ORDER,
      then: yup.string().required("Vui lòng nhập mã đơn hàng"),
    })
    .nullable(),
});
