import { GeneralType } from "./GeneralType";
import { InventoryType, WarehouseType } from "./WarehouseType";
import { UserType } from "./UserType";
import { PromotionType } from "./PromotionType";

export enum STATUS_PRODUCT {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ECOMMERCE_PLARFORM {
  LAZADA = "lazada",
  TIKTOK = "tik-tok",
  SHOPEE = "shopee",
  TIKI = "tiki",
}

export enum VARIANT_TYPE {
  SIMPLE = "simple",
  BUNDLE = "bundle",
}

export interface FilterChild {
  id: string | undefined;
  attribute: number | string;
  value: string[] | [];
}

export interface BatchType {
  id: number;
  batch_name: string;
  expiry_date: string;
  quantity: number;
  label?: string;
  value?: string | number;
  system_quantity?: number;
  inventory?: InventoryType[];
  variant?: string;
  isNew?: boolean;
  reserved_inventory?: number;
}

export interface VariantEcommer extends GeneralType {
  ecommerce_name?: string;
  ecommerce_platform?: ECOMMERCE_PLARFORM;
  ecommerce_sku?: string;
  ecommerce_price?: number;
}
export interface AttributeVariant extends GeneralType {
  id?: string;
  value?: string;
  sale_price?: number;
  created?: string;
  purchase_price?: number;
  status?: STATUS_PRODUCT | any;
  description?: string;
  SKU_code?: string;
  neo_price?: number;
  status_combo?: string;
  barcode?: string;
  image?: any;
  imageApi?: string[];
  batches?: BatchType[];
  batchesSelected?: BatchType[];
  warehouse?: WarehouseType;
  toWarehouse?: WarehouseType;
  batch?: BatchType;
  name?: string;
  selected?: boolean;
  disabled?: boolean;
  quantity?: number;
  total_inventory?: number;
  total?: number;
  is_cross_sale?: boolean;
  discount?: number;
  pay_amount?: number;
  promotion?: Partial<PromotionType>;
  created_by?: Partial<UserType>;
  modified_by?: Partial<UserType>;
  inventory_available?: {
    created: string;
    id: number;
    last_update_time: string;
    modified: string;
    quality_confirm: number;
    quality_non_confirm: number;
  };
  quality_confirm?: number;
  quality_non_confirm?: number;
  total_quantity_non_confirm?: number;
  total_quantity_confirm?: number;
  url?: string;
  modified?: string;
  ecommerce_platform?: string;
  variants_ecommerce_map?: VariantEcommer[];
  comboVariant?: Partial<any>;
  bundle_variants?: {
    quantity: number;
    variant_total?: number;
    variant: AttributeVariant;
    bundle_item_quantity?: number;
  }[];

  bundle_items?: {
    quantity: number;
    variant_total?: number;
    variant: AttributeVariant;
  }[]; // dùng để cache giá và số lượng các variant của bundle_variant

  // Column
  variant?: Partial<any>;
  info?: Partial<any>;
  action?: Partial<any>;
  ecommerce?: Partial<any>;

  //
  index?: number;
  default_quantity?: number;
  variant_total?: number;
  old_promotion_variant_quantity?: number;
  old_gift_variant_price?: number;
  isDenyConfirm?: boolean;

  //
  variant_id?: string;
  gift_variants?: PromotionType[];
  item_gift_variants?: {
    gift_quantity: number;
    variant_total?: number;
    total?: number;
    discount?: number;
    promotion_variant: { id: number; quantity: number; variant: PromotionType };
  }[];
}
export interface Product {
  SKU_code: string;
  barcode: string;
  brand: string;
  category: string;
  created: string;
  description: string;
  id: string;
  images: {
    id: string;
    url: string;
  }[];
  variants: AttributeVariant | [] | any[];
  attributes: FilterChild[];
  modified: string;
  name: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  tag: string;
  type: string;
  unit: string;
  url: string;
  total_inventory: number;
  created_by?: string;
  modified_by?: string;
  supplier?: string;
  total_variants: number;
}

export interface ProductDTO {
  category?: string | number;
  code?: string;
  id?: number;
  name?: string;
  type?: string;
}

export interface HistoryVariant {
  variant_batch: string;
  created: string;
  quantity: number;
  is_draft: boolean;
  warehouse: string;
  sheet: string;
  sheet_code: string;
  order_number: string;

  //
  warehouse_show?: Partial<any>;
}
