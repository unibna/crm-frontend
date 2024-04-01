import { STATUS_ROLE_SHIPPING } from "constants/rolesTab";
import { ShippingType } from "_types_/GHNType";
import { AddressType } from "./AddressType";
import { CustomerType } from "./CustomerType";
import { AttributeVariant } from "./ProductType";
import {
  DISCOUNT_METHOD,
  GiftVariantType,
  PromotionRequireType,
  PROMOTION_TYPE,
} from "./PromotionType";
import { UserType } from "./UserType";
import { WarehouseSheetType } from "./WarehouseType";
import { AttributeType } from "./AttributeType";
import { CollationType } from "./CollationType";

export type OrderStatusValue = "completed" | "cancel" | "draft" | "all";

export type OrderPaymentTypeValue = "COD" | "DIRECT_TRANSFER" | "CASH";
export type OrderPaymentStatusValue = "PENDING" | "DEPOSIT" | "PAID";

export interface OrderShippingType extends ShippingType {
  id?: string;
  created?: string;
  tracking_number?: number;
  full_name: string;
  phone: number;
  shipping_status: STATUS_ROLE_SHIPPING;
  tracking_company: string;
  tracking_created_at: string;
  estimated_delivery_date?: string;
  finished_date?: string;
  shipping_address?: { address: string; ward: string };
  to_full_address?: string;
  return_full_address?: string;
  expected_delivery_time?: string;
  delivery_company?: { id: string; name: string; type: number };
  carrier_status?: string;
  is_cod_transferred?: boolean;
  created_by?: any;
  modified?: string;
  finish_date?: string;
}

export interface OrderPaymentType {
  payment_status?: OrderPaymentStatusValue; // trạng thái thanh toán
  total_actual?: number; // tổng đơn hàng
  payment_date?: string; // ngày thanh toán
  is_confirmed?: boolean; // trạng thái xác nhận
  confirmed_date?: string; // ngày xác nhận thanh toán
  confirmed_by?: UserType; // người xác nhận thanh toán
  discount_promotion?: number; // voucher
  is_finished?: boolean; // ngày hoàn thành thanh toán
  total_variant_quantity?: number; // tổng số lượng sản phẩm
  total_variant_actual?: number; // tổng số tiền thanh toán
  total_variant_all?: number;
  cost?: number; // số tiền phải thanh toán
  fee_delivery?: number; // phí vận chuyển
  fee_additional?: number; // phí phụ thu
  payment_note?: string; // ghi chú
  discount_input?: number; // giảm giá tự nhập
  discount_input_validate?: string; // validate giảm giá
}

export interface OrderPaymentTypeV2 extends Partial<Omit<CollationType, "payment">> {
  id?: string | number;
  type: OrderPaymentTypeValue;
  is_confirmed?: boolean;
  confirmed_date?: string;
  confirmed_by?: UserType;
  internal_paid_status?: boolean;
  final_paid_status?: boolean;
  third_party_paid_status?: boolean;
  amount: number;
  order?: string;
  is_checked?: boolean;
  fee_delivery?: number;
  is_changed?: boolean;
  receive_time?: string;
  note?: string;
  actual_amount?: number;
  receive_info?: any;
  upload_info?: any;
  order_info?: any;
  collation_info?: any;
}

export interface OrderType extends OrderPaymentType {
  id?: string;
  created?: string;
  created_by?: Partial<UserType>;
  modified?: string;
  completed_time?: string;
  history_date?: string;
  history_action?: string;
  modified_by: Partial<UserType>;
  name?: string;
  order_number?: number;
  cancel_reason?: number | AttributeType;
  order_key?: string;
  note?: string;
  tags?: (string | number)[];
  source?: AttributeType;
  line_items: AttributeVariant[];
  ecommerce_code?: string;
  customer_offline_code?: string;
  customer: Partial<CustomerType>;
  customer_name?: string;
  customer_phone?: string;
  total_actual?: number;
  item_gift_variants?: GiftVariantType[];
  status?: OrderStatusValue;
  shipping?: OrderShippingType;
  payment?: OrderPaymentType;
  payments?: Partial<OrderPaymentTypeV2>[];
  shipping_address?: any;
  is_appointment?: boolean;
  appointment_date?: string;
  is_available_shipping?: boolean;
  delivery_note?: string;
  sheets?: WarehouseSheetType[];
  is_printed?: boolean;
  printed_by?: any;
  printed_at?: string;
  cross_sale_amount?: number;
  is_cross_sale?: boolean;
  promotions?: Partial<OrderPromotionType>[];
}

export interface OrderPromotionType {
  id?: string;
  discount_promotion?: number;
  discount_method: DISCOUNT_METHOD;
  discount_amount?: number;
  type: PROMOTION_TYPE;
  note: string;
  name: string;
  discount_percent?: number;
  requirements: PromotionRequireType[];
}

export interface OrderFormType {
  id?: string;
  name?: string;
  discount_input?: number;
  cross_sale_amount?: number;
  cancel_reason?: number | AttributeType;
  is_ecommerce_source?: boolean;
  is_offline_channel?: boolean;
  is_printed?: boolean;
  customer_staff_override?: boolean;
  ecommerce_code?: string;
  customer_offline_code?: string;
  is_cross_sale?: boolean;
  source?: AttributeType;
  customer?: Partial<CustomerType>;
  payment?: OrderPaymentType;
  shipping_address?: Partial<AddressType>;
  status?: OrderStatusValue;
  shipping?: OrderShippingType;
  line_items: any[];
  note?: string;
  completed_time?: string;
  //order promotions
  promotions?: Partial<OrderPromotionType>[];
  tags?: (string | number)[];
  is_available_shipping?: boolean;
  delivery_note?: string;
  order_key?: string;
  payments?: Partial<OrderPaymentTypeV2>[];
  appointment_date?: string;
  sheets?: WarehouseSheetType[];
  created?: string;
  created_by?: Partial<UserType>;
  customer_name?: string;
  customer_phone?: string;
}

export type OrderDTO = Omit<
  OrderType,
  "created_by" | "customer" | "modified_by" | "source" | "line_items" | "promotions"
> & {
  id?: string;
  line_items: LineItemDTO[];
  customer: string;
  created_by: string;
  modified_by: string;
  source: string;
  ecommerce_code?: string;
  customer_offline_code?: string;
  promotions?: string[];
  shipping_address?: string;
  delivery_note?: string;
  customer_staff_override?: boolean;
  payments?: any;
  is_cross_sale?: boolean;
  cross_sale_amount?: number;
};

export type LineItemDTO = {
  variant: string;
  batch?: number;
  warehouse?: number;
  promotion?: {
    id?: string;
    gift_variants?: { available_variant?: number; gift_quantity?: number }[];
  };
} & Omit<AttributeVariant, "variant" | "batch" | "warehouse" | "promotion">;

export interface OrderFilterProps {
  isFilterOrderStatus?: boolean;
  isFilterTrackingCompany?: boolean;
  isFilterCreator?: boolean;
  isFilterModifiedBy?: boolean;
  isFilterCrossSale?: boolean;
  isFilterCarrierStatus?: boolean;
  isFilterDate?: boolean;
  isFilterSource?: boolean;
  isFilterPaymentType?: boolean;
  isFilterPrinted?: boolean;
  isFilterModifiedDate?: boolean;
  filterCount?: number;
  isFilterTag?: boolean;
  isFilterConfirmDate?: boolean;
  params?: any;
  tagOptions?: { id: number; name: string }[];
}
