export enum TypeWarehouseSheet {
  IMPORTS = "IP",
  EXPORTS = "EP",
  TRANSFER = "TF",
  STOCKTAKING = "IV", //Inventory
}

export interface VariantBatch {
  id: number;
  batch_name: string;
  expiry_date: string;
  variant: {
    id: number;
    name: string;
    image: {
      id: string;
      url: string;
    };
  };
}
export interface InventoryType {
  quantity?: number;
  warehouse?: { id: number; name: string };
  variant_batch?: VariantBatch;
  expiry_date?: string;
  variant?: string;
  batch_name?: string;
}

export interface InventoryByBatch {
  variant_batch: VariantBatch;
  inventories?: InventoryType[];
  quantity: number;
  quantity_confirm?: number;
  total_inventory?: number;
  quantity_variant?: number;
  reserved_inventory?: number;
  errorMessage?: string;
}

export interface InventorySheetDetailType {
  note_show?: {
    value: string;
    content: JSX.Element;
  };
  note?: string;
  actual_quantity: number;
  system_quantity: number;
  inventory_log?: {
    created?: string;
    is_draft?: boolean;
    quantity: number;
    variant_batch: VariantBatch;
    warehouse: object;
  }[];
  warehouse?: string;
  different?: number;
  variant_batch?: string;
  isError?: boolean;
  variant?: string;
  id?: string;
}
export interface WarehouseSheetType {
  code?: string;
  created?: string;
  created_by?: string;
  id: string;
  is_confirm?: boolean;
  note?: string;
  warehouse?: string;
  from_warehouse?: string;
  to_warehouse?: string;
  confirmed_by?: string;
  confirmed_date?: string;
  inventories?: InventoryType[];
  inventory_sheet_details?: InventorySheetDetailType[];

  type?: TypeWarehouseSheet;
  sheet_reason?: SheetReason;
  inventoried_warehouse?: null;
  order_key?: string;
  order_id?: string;
}

export interface SheetReason {
  id: number;
  name: string;
  type: string;
}

export interface WarehouseType {
  id?: number | string;
  name?: string;
  address?: Partial<any>;
  description?: string;
  is_default?: boolean;
  is_sales?: boolean;
  manager_name?: string;
  manager_phone?: string;
  value?: string;
  label?: string;
}

export interface WarehouseLogs {
  variant_batch?: string;
  created?: string;
  variant?: string;
  quantity?: number;
  sheet_code?: string;
  is_draft?: boolean;
  sheet?: string;
  confirmed_by?: string;
  confirmed_date?: string;
  SKU?: string;
  note?: string;
  warehouse_name?: string;
}

export interface IReportInventoryActivities {
  sheet__confirmed_date__date?: string;
  sheet__sheet_reason__type?: string | any;
  sheet__sheet_reason__name?: string;
  variant_batch__variant__name?: string | any;
  variant_batch__variant__SKU_code?: string;
  variant_batch__variant__id?: string;
  variant_quantity?: number;
  warehouse__name?: string;
  warehouse_from?: string;
  warehouse_to?: string;
  type?: TypeWarehouseSheet;
  note?: string;
  variant_batch__batch_name?: string | any;
  sheet__sheet_reason__id?: number;
  variant_batch__id?: number;
  warehouse__id?: number;
  quantity_import?: number;
  quantity_export?: number;
  action_type?: any;
}
