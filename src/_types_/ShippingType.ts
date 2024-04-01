import { GeneralType } from "_types_/GeneralType";
import { SHIPPING_COMPANIES } from "./GHNType";

export enum ShippingStatusValue {
  WAITING_FOR_DELIVERY = "waiting_for_delivery",
  DELIVERING = "delivering",
  RETURNED = "returned",
  RETURN_TRANSPORTING = "return_transporting",
  DELIVERED = "delivered",
  WAITING_TO_RETURN = "waiting_to_return",
  CANCELED = "cancelled",
  LOST = "lost",
}
export interface ShippingType extends GeneralType {
  created_by: {
    id: string;
    name: string;
  };
  carrier_status: ShippingStatusValue;
  client_order_code: Partial<any>;
  cod_amount: number;
  created: string;
  delivery_company: {
    id: string;
    name: string;
    type: 1;
  };
  delivery_company_name: string;
  delivery_company_type: SHIPPING_COMPANIES;
  expected_delivery_time: string;
  finish_date: string | null;
  height: number;
  id: string;
  is_cod_collected: boolean;
  is_cod_transferred: boolean;
  items: ProductItemType[];
  length: number;
  modified: string;
  note: string | null;
  order: string;
  payment_type_id: number;
  picking_ship: number;
  required_note: "KHONGCHOXEMHANG" | "CHOXEMHANGKHONGTHU" | "CHOTHUHANG";
  return_address: string;
  return_district_id: number;
  return_full_address: string;
  return_name: string;
  return_phone: string;
  return_province_id: string;
  return_ward_code: string;
  service_type_id: number;
  to_address: string;
  to_district_id: number;
  to_full_address: string;
  to_name: string;
  to_phone: string;
  to_province_id: string;
  to_ward_code: string;
  trans_type: "truck" | "plane";
  weight: number;
  width: number;
  insurance_value: number;
  is_show_order_id?: boolean;
  hiddenColumns?: string[];
  created_by_name?: string;
  product_name?: string;
  product_price?: number;
  product_quantity?: number;

  tracking_number?: Partial<any>;
  payment_type_show?: Partial<any>;
  cod_transferred_show?: Partial<any>;
  delivery?: Partial<any>;
  delivery_company_type_show?: Partial<any>;
  carrier_status_show?: Partial<any>;
  product?: Partial<any>;
  customer?: Partial<any>;
  sender?: Partial<any>;
  payment?: Partial<any>;
  time: Partial<any>;
}

export interface ShippingReportType {
  total_order: number;
  total_order_completed: number;
  total_order_draft: number;
  total_order_cancel: number;
  total_order_shipment: number;
  total_order_not_shipment: number;
  total_order_finish: number;
  delivering: number;
  waiting_for_delivery: number;
  return_transporting: number;
  delivered: number;
  waiting_to_return: number;
  returned: number;
  cancelled: number;
  lost: number;
  delivered_revenue: number;

  created_at: string;
  total_order__revenue_net: number;
  total_order_completed__revenue_net: number;
  total_order_draft__revenue_net: number;
  total_order_cancel__revenue_net: number;
  total_order_shipment__revenue_net: number;
  total_order_not_shipment__revenue_net: number;
  total_order_finish__revenue_net: number;
  delivering__revenue_net: number;
  waiting_for_delivery__revenue_net: number;
  return_transporting__revenue_net: number;
  delivered__revenue_net: number;
  waiting_to_return__revenue_net: number;
  returned__revenue_net: number;
  cancelled__revenue_net: number;
  lost__revenue_net: number;
  total_order_not_cancel__revenue_net: number;
  total_order_not_cancel: number;
}
export interface ProductItemType {
  code: string;
  name: string;
  price: number;
  quantity: number;
  url: string;
}

export interface DeliveryType {
  id: string;
  created: string;
  modified: string;
  name: string;
  type: number;
  token: string;
  shop_id: string;
}
