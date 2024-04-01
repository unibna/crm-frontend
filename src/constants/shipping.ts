import { STATUS_ROLE_SHIPPING } from "./rolesTab";

// biến này ban đầu đc đặt trong views/ShippingView/constant.tsx
// nhưng do lỗi Failed to reload khi import biến này nên tách ra đây
export const LABEL_STATUS_SHIPPING: { [key: string]: string } = {
  [STATUS_ROLE_SHIPPING.WAITING_FOR_DELIVERY]: "Chờ lấy hàng",
  [STATUS_ROLE_SHIPPING.PICKING]: "Chờ lấy hàng",
  [STATUS_ROLE_SHIPPING.DELIVERING]: "Đang giao hàng",
  [STATUS_ROLE_SHIPPING.RETURNED]: "Đã hoàn",
  [STATUS_ROLE_SHIPPING.RETURNING]: "Đang hoàn",
  [STATUS_ROLE_SHIPPING.SUCCESS]: "Giao thành công",
  [STATUS_ROLE_SHIPPING.DELIVERED]: "Giao thành công",
  [STATUS_ROLE_SHIPPING.WAIT_DELIVERY]: "Chờ giao lại",
  [STATUS_ROLE_SHIPPING.CANCELLED]: "Đã hủy",
  [STATUS_ROLE_SHIPPING.LOST]: "Thất lạc",
};
