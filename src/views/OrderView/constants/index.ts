import { CustomerType } from "_types_/CustomerType";
import { OrderPaymentType, OrderPaymentTypeValue, OrderStatusValue } from "_types_/OrderType";

import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import isAfter from "date-fns/isAfter";
import subYears from "date-fns/subYears";
import * as yup from "yup";

export const DELIVERY_FILTER = {
  label: "delivery_company",
  color: "#91f7a4",
  title: "Đơn vị vận chuyển",
};

export const PROVINCE_FILTER = {
  label: "billing_province",
  color: "#91f7a4",
  title: "Tỉnh/ thành",
};

export const SOURCE_FILTER = { label: "source", color: "", title: "Kênh bánh hàng" };
export const PRINT_STATUS_FILTER = { label: "is_printed", color: "", title: "Đã in đơn" };
export const CREATED_BY_FILTER = { label: "created_by", color: "", title: "Người tạo đơn" };
export const CARRIER_STATUS = { label: "carrier_status", color: "", title: "Trạng thái giao hàng" };
export const TAG_FILTER = { label: "tags", color: "", title: "Thẻ" };
export const CROSS_SALE_FILTER = { label: "is_cross_sale", color: "", title: "Đơn CrossSale" };

export const SELECT_OPTIONS_FILTER_COLOR = [
  { label: "delivery_company", color: "#91f7a4", title: "ĐVVC" },
  { label: "billing_province", color: "#91f7a4", title: "Tỉnh/ thành" },
  { label: "source", color: "", title: "Kênh bánh hàng" },
  { label: "is_printed", color: "", title: "Đã in đơn" },
  { label: "created_by", color: "", title: "Người tạo đơn" },
  { label: "tags", color: "", title: "Thẻ" },
  { label: "is_cross_sale", color: "", title: "Đơn CrossSale" },
];

export const DATE_OPTIONS_FILTER_COLOR = [
  {
    title: "Ngày tạo đơn",
    keyFilters: [
      { label: "created_from", color: "#91f7a4", title: "Ngày tạo đơn từ" },
      { label: "created_to", color: "#91f7a4", title: "Ngày tạo đơn tới" },
    ],
  },
  {
    title: "Ngày xác nhận",
    keyFilters: [
      { label: "completed_time_from", color: "#91f7a4", title: "Ngày xác nhận từ" },
      { label: "completed_time_to", color: "#91f7a4", title: "Ngày xác nhận tới" },
    ],
  },
];

export const ORDER_STATUS_VALUE: {
  [key in OrderStatusValue]: {
    value: string;
    color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  };
} = {
  draft: { value: "Đơn chưa xác nhận", color: "warning" },
  cancel: { value: "Đơn huỷ", color: "error" },
  completed: { value: "Đơn đã xác nhận", color: "success" },
  all: { value: "Tất cả", color: "default" },
};

export const ORDER_PAYMENT_TYPE: {
  [key in OrderPaymentTypeValue]: {
    value: string;
    color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  };
} = {
  COD: { value: "COD", color: "error" },
  DIRECT_TRANSFER: { value: "Chuyển khoản", color: "info" },
  CASH: { value: "Trực tiếp", color: "success" },
};

export const ORDER_FORM_SCHEMA = yup.object().shape(
  {
    customer_name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
    line_items: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .min(1, VALIDATION_MESSAGE.REQUIRE_AMOUNT)
            .required(VALIDATION_MESSAGE.REQUIRE_AMOUNT),
          promotion: yup.object().shape(
            {
              gift_variants: yup.array().of(
                yup.object().shape({
                  quantity: yup
                    .number()
                    .when(["variant", "status"], {
                      is: (variant: number, status: OrderStatusValue) => {
                        return status !== "completed";
                      },
                      otherwise: yup
                        .number()
                        .max(
                          yup.ref("variant.total_inventory"),
                          "Vui lòng kiểm tra số lượng sản phẩm khuyến mãi"
                        ),
                    })
                    .min(1, "Số lượng sản phẩm ít nhất là 1"),
                })
              ),
            },
            [["quantity", "quantity"]]
          ),
        })
      )
      .min(1, VALIDATION_MESSAGE.SELECT_PRODUCT)
      .required(VALIDATION_MESSAGE.SELECT_PRODUCT),
    source: yup.object({
      id: yup.number().required(VALIDATION_MESSAGE.SELECT_CHANNEL),
    }),
    ecommerce_code: yup
      .string()
      .when("is_ecommerce_source", {
        is: (is_ecommerce_source: boolean) => is_ecommerce_source,
        then: yup.string().required("Vui lòng nhập mã thương mại điện tử"),
      })
      .nullable(),
    customer_offline_code: yup
      .string()
      .when("is_offline_channel", {
        is: (is_offline_channel: boolean) => is_offline_channel,
        then: yup.string().required("Vui lòng nhập mã offline"),
      })
      .nullable(),
    customer: yup.object({
      id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CUSTOMER),
      birthday: yup
        .date()
        .nullable()
        .test("birthday", VALIDATION_MESSAGE.FORMAT_BIRTHDAY, (value) => {
          if (!value) {
            return true;
          } else {
            const eighteenYearsAgo = subYears(new Date(), 16);
            var birthday = new Date(value);
            return isAfter(eighteenYearsAgo, birthday);
          }
        }),
    }),
    cross_sale_amount: yup
      .number()
      .when(["is_cross_sale", "cross_sale_amount", "payment"], {
        is: (is_cross_sale: boolean, cross_sale_amount: number, payment: OrderPaymentType) => {
          return (
            is_cross_sale &&
            (!cross_sale_amount ||
              cross_sale_amount <= 0 ||
              cross_sale_amount > (payment.total_actual || 0))
          );
        },
        then: yup
          .number()
          .min(1, "Vui lòng nhập > 0 và < số tiền cần thanh toán")
          .max(0, "Vui lòng nhập > 0 và < số tiền cần thanh toán")
          .required("Vui lòng nhập > 0 và < số tiền cần thanh toán"),
      })
      .nullable(),
    shipping_address: yup
      .object()
      .when(["customer", "is_ecommerce_source"], {
        is: (customer?: CustomerType, is_ecommerce_source?: boolean) =>
          is_ecommerce_source ? false : !!customer,
        then: yup.object().shape({
          id: yup.string().required("Vui lòng cung cấp địa chỉ giao hàng"),
        }),
      })
      .required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
    is_available_shipping: yup
      .bool()
      .isTrue("Địa chỉ hiện tại không thể giao hàng vui lòng chọn địa chỉ khác"),
    payment: yup
      .object({
        payment_note: yup
          .string()
          .when("fee_additional", {
            is: (fee_additional: number) => fee_additional > 0,
            then: yup.string().required("Vui lòng nhập ghi chú thanh toán"),
          })
          .when("discount_input", {
            is: (discount_input: number) => discount_input > 0,
            then: yup.string().required("Vui lòng nhập ghi chú thanh toán"),
          })
          .nullable(),
        discount_input_validate: yup
          .string()
          .when(["cost", "discount_input"], {
            is: (cost: number = 0, discount_input: number = 0) => discount_input > 0 && cost < 0,
            then: yup.string().required("Giảm giá không được áp dụng"),
          })
          .nullable(),
      })
      .when("is_ecommerce_source", {
        is: (is_ecommerce_source: boolean) => is_ecommerce_source,
        then: yup.object({
          payment_note: yup.string(),
          discount_input_validate: yup
            .string()
            .when(["cost", "discount_input"], {
              is: (cost: number = 0, discount_input: number = 0) => discount_input > 0 && cost < 0,
              then: yup.string().required("Giảm giá không được áp dụng"),
            })
            .nullable(),
        }),
      }),
    tags: yup.array().when(["payment", "is_ecommerce_source"], {
      is: (payment: OrderPaymentType, is_ecommerce_source: boolean) =>
        is_ecommerce_source ? false : payment.discount_input || payment.fee_additional,
      then: yup.array().min(1, "Vui lòng chọn thẻ").required("Vui lòng chọn thẻ"),
    }),
    payments: yup
      .array()
      .min(1, "Vui lòng chọn phương thức thanh toán")
      .required("Vui lòng chọn phương thức thanh toán"),
  },
  [
    ["cross_sale_amount", "cross_sale_amount"],
    ["is_cross_sale", "is_cross_sale"],
  ]
);

export const PAYMENT_TYPES: {
  [key in OrderPaymentTypeValue]: OrderPaymentTypeValue;
} = {
  COD: "COD",
  CASH: "CASH",
  DIRECT_TRANSFER: "DIRECT_TRANSFER",
};

export const EXPORT_DATA_TO_GMAIL_KEY: { [key in string]: string } = {
  order_key: "Mã đơn",
  status: "Trạng thái",
  "source.name": "Kênh bán hàng",
  "tags.name": "Thẻ",
  created: "Ngày tạo",
  "created_by.name": "Người tạo",
  is_cross_sale: "Đơn CrossSale",
  cross_sale_amount: "Giá trị CrossSale",
  customer_name: "Tên khách hàng",
  customer_phone: "SĐT khách hàng",
  note: "Ghi chú",
  cancel_reason: "Lý do huỷ đơn",
  "shipping.tracking_number": "Mã vận đơn",
  "shipping.created": "Ngày tạo mã vận đơn",
  "shipping.expected_delivery_time": "T/g dự kiến giao hàng",
  "shipping.return_full_address": "Địa chỉ giao",
  "shipping.to_full_address": "Địa chỉ nhận",
  delivery_note: "Ghi chú vận đơn",
  total_variant_quantity: "Số lượng sản phẩm",
  total_variant_all: "Tổng tiền hàng",
  total_variant_actual: "Tổng đơn hàng",
  fee_delivery: "Phí vận chuyển",
  fee_additional: "Phụ thu",
  discount_input: "Khuyến mãi",
  "payments.amount": "Giá trị thanh toán",
  "payments.actual_amount": "Thực toán",
  "payments.type": "Loại thanh toán",
  cost: "Số tiền phải trả",
  payment_note: "Ghi chú thanh toán",
  total_actual: "Số tiền đơn hàng",
};
