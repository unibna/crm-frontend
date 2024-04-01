import { OrderPaymentTypeValue } from "_types_/OrderType";

export const ORDER_PAYMENT_STATUS = [
  { label: "Chờ lấy hàng", value: "PENDING" },
  { label: "Đặt cọc", value: "DEPOSIT" },
  { label: "Đã thanh toán", value: "PAID" },
];

export const ORDER_TYPE = [
  { label: "Thanh toán khi nhận hàng", value: "COD" },
  { label: "Chuyển khoản", value: "DIRECT_TRANSFER" },
];

export const CHECK_PRODUCT_OPTIONS = [
  { label: "Không cho xem hàng", value: "KHONGCHOXEMHANG" },
  { label: "Cho xem không cho thử", value: "CHOXEMHANGKHONGTHU" },
  { label: "Cho thử hàng", value: "CHOTHUHANG" },
];

export const SHIPPING_VEHICEL_OPTIONS = [
  { label: "Xe tải", value: "truck" },
  { label: "Máy bay", value: "plane" },
];

export const PAYMENT_TYPE_VALUES: { label: string; value: OrderPaymentTypeValue }[] = [
  { value: "DIRECT_TRANSFER", label: "Chuyển khoản" },
  { value: "CASH", label: "Thanh toán tại kho" },
  { value: "COD", label: "Thanh toán khi nhận hàng" },
];

export const PAYMENT_FREE_OPTIONS = [
  { value: 1, label: "Người giao" },
  { value: 2, label: "Người nhận" },
];

export const ORDER_STATUS = [
  { label: "Đơn chờ", value: "draft", color: "info" },
  { label: "Đơn xác nhận", value: "completed", color: "success" },
  { label: "Đơn huỷ", value: "cancel", color: "error" },
];

export const BOOLEAN_VALUES = [
  { label: "Phải", value: "true", color: "info" },
  { label: "Không phải", value: "false", color: "success" },
];
