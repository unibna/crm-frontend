import { AttributeVariant } from "./ProductType";

export interface CRMType {
  id: string;
  product?: {
    product_id?: string;
    product_name?: string;
    thumbnail_url?: string;
  };
  order_id?: string;
  customer_id?: string;
  quantity?: number;
  delivered_date: string;
  crm_date?: string;
}

export interface CDPProductType {
  variant: AttributeVariant;
  total_quantity: number;
  latest_order_quantity: number;
  latest_deliverd_date: string;
}
