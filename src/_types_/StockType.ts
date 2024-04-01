export enum InventoryType {
  PURCHASE = "PU",
  MOVE = "MO",
  SALE = "SA",
  RETURN = "RE",
}

export interface ProductStockType {
  selected?: boolean;
  disabled?: boolean;
  id: string;
  body_html?: string;
  body_plain?: string;
  created_at: string;
  handle: string;
  product_type: string;
  published_at: string;
  published_scope: string;
  tags?: string[];
  template_suffix: string;
  title: string;
  updated_at: string;
  vendor: string;
  only_hide_from_list: boolean;
  not_allow_promotion: boolean;
  variantQuantityChecked: number;
  images: {
    id: string;
    created_at: string;
    position: number;
    src: string;
    updated_at: string;
    filename: string;
  }[];
  options: { id: string; name: string; position: number }[];
  variants: {
    disabled?: boolean;
    selected?: boolean;
    id: string;
    barcode: string;
    compare_at_price: number;
    created_at: string;
    fulfillment_service?: string;
    grams: number;
    inventory_management: string;
    inventory_policy: string;
    inventory_quantity: number;
    position: number;
    price: number;
    requires_shipping: boolean;
    sku: string;
    taxable: boolean;
    title: string;
    updated_at: string;
    option1: string;
    option2?: string;
    option3?: string;
    inventory_advance: {
      qty_onhand: number;
      qty_commited: number;
      qty_incoming: number;
      qty_available: number;
    };
    product: string;
    image?: {
      id: string;
      created_at: string;
      position: number;
      src?: string;
      updated_at: string;
      filename: string;
    };
    quantity: number;
  }[];
}
