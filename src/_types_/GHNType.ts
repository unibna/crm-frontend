export enum SHIPPING_COMPANIES {
  NONE = -1,
  OTHER = 0,
  GHN = 1,
  VNPOST = 2,
  E_COMMERCE = 3,
  GRAB = 4,
  LALAMOVE = 5,
  VIETTEL_POST = 6,
}

export interface GHNProvinceType {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}

export interface GHNDistrictType {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
}

export interface GHNWardType {
  WardCode: number;
  DistrictID: number;
  WardName: string;
}

export interface GHNFeeType {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
}

export interface GHNProductType {
  name: string;
  code: string;
  quantity: number;
  weight?: number;
  height?: number;
  length?: number;
  width?: number;
  category: { level1?: string; level2?: string; level3?: string };
}

export interface ShippingType {
  order_code?: string;
  service_id?: string;
  status?: string;
  shop_id?: string; // get from env
  token?: string; // get from env
  return_phone: string;
  return_address: string;
  delivery_company_type: SHIPPING_COMPANIES;
  return_district_id?: number;
  created_date?: string;
  return_name?: string;
  return_ward_code?: string;
  to_name: string;
  to_phone: string;
  to_address?: string;
  to_district_id?: number;
  to_ward_code?: string;
  cod_amount: number;
  content: string; // content of order
  weight: number;
  height: number;
  width: number;
  length?: number;
  insurance_value?: number; // insurance transportation
  coupon?: string;
  service_type_id: 1 | 2; //1: express, 2: standard, default: 2
  payment_type_id: 1 | 2; // 1: seller, 2:buyer, default: 1
  note?: string; //note for shipper before shipper get order
  required_note: "CHOTHUHANG" | "CHOXEMHANGKHONGTHU" | "KHONGCHOXEMHANG"; //default "KHONGCHOXEMHANG"
  picking_ship?: number; //picking time shipper get order
  items?: GHNProductType[];
  name: string;
  quantity: number;
  trans_type?: "truck" | "plane";
  to_province_id?: number;
  return_province_id?: number;
}

export interface GHNPickingShift {
  id: number;
  title: string;
  from_time: number;
  to_time: number;
}

export interface GHNShippingResponseType {
  _id?: string;
  action?: string; //"TRANSPORTING",
  shape?: string; // for devexpress column
  products?: GHNProductType[];
  client_id?: number;
  client_order_code?: string;
  cod_amount: number;
  cod_collect_date?: string;
  cod_transfer_date?: string;
  content?: string;
  converted_weight?: number;
  coupon?: string;
  created_client?: number;
  created_date?: string;
  created_employee?: number;
  created_ip?: string;
  created_source?: string;
  current_transport_warehouse_id?: number;
  current_warehouse_id?: number;
  custom_service_fee?: number;
  data?: {
    last_sort_code_print: string;
    print_by_user_id: number;
    print_time: string;
  };
  deliver_station_id?: number;
  deliver_warehouse_id?: number;
  employee_note?: string;
  finish_date?: string;
  from_address: string;
  from_district_id: number;
  from_location?: {
    cell_code: string;
    lat: number;
    long: number;
    place_id: string;
    trust_level: number;
    wardcode: string;
  };
  from_name: string;
  from_phone: string;
  from_ward_code: string;
  height: number;
  image_ids?: string;
  insurance_value: number;
  internal_process?: {
    status?: string;
    type?: string;
  };
  is_cod_collected?: boolean;
  is_cod_transferred?: boolean;
  is_partial_return?: boolean;
  items?: GHNProductType[];
  leadtime?: string;
  length?: number;
  log?: {
    driver_id: number;
    driver_name: string;
    payment_type_id: number;
    status: string;
    trip_code: string;
    updated_date: string;
  }[];
  next_warehouse_id?: number;
  note?: string;
  order_code?: string;
  order_date?: string;
  order_value: number;
  payment_type_id?: 1 | 2;
  payment_type_ids?: number[];
  pick_station_id?: number;
  pick_warehouse_id?: number;
  pickup_time?: string;
  required_note: "CHOTHUHANG" | "CHOXEMHANGKHONGTHU" | "KHONGCHOXEMHANG"; //default "KHONGCHOXEMHANG"
  return_address?: string;
  return_district_id?: number;
  return_location?: {
    cell_code?: string;
    lat?: number;
    long?: number;
    place_id?: string;
    trust_level?: number;
    wardcode?: string;
  };
  return_name?: string;
  return_phone?: string;
  return_ward_code?: string;
  return_warehouse_id?: number;
  seal_code?: string;
  service_id?: number;
  service_type_id?: 1 | 2;
  shop_id?: number;
  soc_id?: string;
  sort_code?: string;
  status?: string; //"transporting",
  tag?: string[]; // ["truck"],
  to_address?: string;
  to_district_id?: number;
  to_location?: {
    cell_code?: string;
    lat?: number;
    long?: number;
    trust_level?: number;
    wardcode?: string;
  };
  to_name?: string;
  to_phone?: string;
  to_ward_code?: string;
  updated_client?: number;
  updated_date?: string;
  updated_employee?: number;
  updated_ip?: string;
  updated_source?: string;
  updated_warehouse?: number;
  version_no?: string;
  warehouse_log?: {
    current_warehouse_id?: number;
    deliver_warehouse_id?: number;
    pick_warehouse_id?: number;
    return_warehouse_id?: number;
    updated_date?: string;
  }[];
  weight?: number;
  width?: number;
  to_province_id?: number;
  return_province_id?: number;
}

export interface GHNServiceType {
  service_id: number;
  short_name: string;
  service_type_id: number;
}
