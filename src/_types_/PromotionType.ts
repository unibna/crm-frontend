import { AttributeVariant, BatchType } from "./ProductType";
import { WarehouseType } from "./WarehouseType";

export type ProductOrderType = Partial<
  Omit<AttributeVariant, "promotion"> & {
    quantity: number;
    selected?: boolean;
    disabled?: boolean;
  }
>;

export interface PromotionRequireType {
  requirement?: number;
  requirement_type?: "TOTAL_BILL" | "QUANTITY_MIN";
  limit?: number;
  limit_type?: "QUANTITY_MAX" | "TOTAL_MAX";
}

export enum DISCOUNT_METHOD {
  PERCENTAGE = "PERCENTAGE",
  AMOUNT = "AMOUNT",
  COMBO = "COMBO",
}

export enum PROMOTION_TYPE {
  "ORDER" = "ORDER",
  "VARIANT" = "VARIANT",
}
export interface GiftVariantType {
  id: number;
  promotion_variant: AttributeVariant;
  quantity: number;
  batch?: BatchType;
  warehouse?: WarehouseType;
  name: string;
  selected?: boolean;
}

export type PromotionStatus = "INACTIVED" | "ACTIVED" | "DEACTIVED";

export interface PromotionType {
  id?: string;
  type: PROMOTION_TYPE;
  name: string;
  date_end?: string;
  date_start?: string;
  discount_method: DISCOUNT_METHOD;
  discount_percent: number;
  discount_amount: number;
  is_cumulative?: boolean;
  discount_promotion?: number;
  applied_variant?: any;
  available_variants?: any[];
  product_selected?: any[];
  gift_variants?: any[];
  requirements: PromotionRequireType[];
  total_after_discount: number;
  search?: string;
  isSelected?: boolean;
  note: string;
  combo_times: number;
  status: PromotionStatus;
  created_by?: { id: string; name: string };
  created?: string;
  new_promotion_variant_quantity?: number;
  new_gift_variant_price?: number;
  selected?: boolean;
  //
  quantity?: number;
  gift_quantity?: number;
  batches?: BatchType[];
  sale_price?: number;
  batch?: BatchType;
  warehouse?: WarehouseType;
  image?: { id: string; url: string } | { id: string; url: string }[];
  variant?: any;
}

export enum PROMOTION_ACTIVE_STATUS {
  ACTIVED = "ACTIVED",
  INACTIVED = "INACTIVED",
  DEACTIVED = "DEACTIVED",
}
