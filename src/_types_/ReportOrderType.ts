import { SHIPPING_COMPANIES } from "./GHNType";
import { GeneralType } from "./GeneralType";
export interface ReportOrderType extends GeneralType {
  id?: number | string;
  order_key?: string;
  created?: string;
  created_by__name?: string;
  // status?: string;
  completed_time?: string;
  modified_by__name?: string;
  modified_by?: {
    name: string;
  };
  source?: {
    name: string;
  };
  is_printed?: boolean;
  printed_at?: string;
  printed_by__name?: string;
  source__name?: string;
  tags__name?: string;
  customer_phone?: string;
  exported?: boolean;
  imported?: boolean;

  fee_delivery?: number;
  fee_additional?: number;
  discount_promotion?: number;
  discount_input?: number;
  promotion__name?: string;
  payment_note?: string;
  note?: string;
  quantity_variant?: number;

  total_variant_all?: number;
  total_variant_actual?: number;
  total_actual?: number;

  payment_cod?: number;
  payment_cash?: string;
  payment_direct_transfer?: string;

  shipping__created?: string;
  shipping__tracking_number?: string;
  shipping__note?: string;
  shipping_address?: string;
  shipping__return_full_address?: string;
  shipping__return_name?: string;
  shipping__finish_date?: string;
  shipping__delivery_company_type?: SHIPPING_COMPANIES;

  line_items__variant__SKU_code?: string;
  line_items__variant__name?: string;
  line_items__quantity?: number;
  line_items__promotion__name?: string;
  line_items__total?: number;
  line_items__variant_total?: number;
  shipping__carrier_status?: string;
  shipping__delivery_company_name?: string;

  customer_name?: string;
  promotions__name?: string;
  is_gift?: boolean;
  exported_date?: string;
  imported_date?: string;
  shipping__modified?: string;
  ecommerce_code?: string;
  payment_cod_confirm_date?: string;
  payment_cash_date?: string;
  payment_direct_transfer_date?: string;

  // Column show header
  customer: Partial<any>;
  info: Partial<any>;
  status: Partial<any> | string;
  order: Partial<any>;
  cost: Partial<any>;
  shipping: Partial<any>;
  payment: Partial<any>;
  product: Partial<any>;
}
