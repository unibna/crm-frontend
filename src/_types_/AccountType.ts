import { LabelColor } from "components/Labels";
import { GeneralType } from "./GeneralType";

export type AccountStatusType = "1" | "2" | "3" | "7" | "8" | "9";

export type StatusSync = "OH" | "IP" | "RJ" | "CO";

export interface AccountTypeDefault extends GeneralType {
  name?: string;
  page_id?: string;
  status_sync_show?: {
    value?: string;
    color?: LabelColor;
  };
  status_sync?: StatusSync;
  sync_is_active?: boolean;
  sync_habt?: boolean;
  sync_jp24?: boolean;
  time_refresh_data?: string;
  fb_account?: string;
  group_permission?: {
    id?: number;
    code?: string;
    route?: string;
    name?: string;
    data?: Partial<any>;
  };
  department?: string;
  user_type: 0 | 1;

  // Ad Account
  ad_account_name?: string;

  // Column header
  is_active: boolean;
  is_export_data: boolean;
  account: Partial<any>;
  info: Partial<any>;
  seller: Partial<any>;
  status: Partial<any>;
  shop: Partial<any>;
  time: Partial<any>;
  operation_resync: Partial<any>;
}

export interface AdAccountType extends AccountTypeDefault {
  ad_account_status?: AccountStatusType;
  access_token?: string;
  ad_account_id?: string;
  ad_account_name?: string;
  error_sync_status?: string;
}

export interface SkylinkAccountType extends AccountTypeDefault {
  ad_account_id?: string;
  name?: string;
  email?: string;
  last_login?: string;
  phone?: string;
  role?: string;
  id?: string;
  image?: {
    id?: string;
    url?: string;
  };
}

export interface FacebookAccountType extends AccountTypeDefault {}

export interface FanpageAccountType extends AccountTypeDefault {}

export interface GoogleAccountType extends AccountTypeDefault {
  login_customer_id?: string;
}
export interface CustomerAccountType extends AccountTypeDefault {
  currency_code?: string;
  time_zone?: string;
  gg_account?: string;
  customer_id?: string;
}

export interface ZaloAccountType extends AccountTypeDefault {
  account_name?: string;
  modified?: string;
  description?: string;
  is_verified?: boolean;
  created?: string;
  avatar?: string;
  id?: string;
}

export type TIKTOK_SHOP_TYPE = 1 | 2;
export interface TiktokAccountType extends AccountTypeDefault {
  seller_name?: string;
  created?: string;
  refresh_token_expire_in?: string;
  seller_base_region?: string;
  shop_name?: string;
  open_id?: string;
  created_shop?: string;
  shops?: {
    created?: string;
    modify?: string;
    region?: string;
    shop_id: string;
    shop_name?: string;
    type?: TIKTOK_SHOP_TYPE;
  }[];
}

export interface TiktokBmAccountType extends AccountTypeDefault {
  created_at?: string;
  created?: string;
  modified_at?: string;
  display_name?: string;
  email?: string;
  core_user_id?: string;
  create_time?: string;
  avatar_url?: string;
  is_activate?: boolean;
}

export interface TiktokAdvertiserUserType {
  advertiser_id: string;
  created: string;
  modified: string;
  name: string;
  advertiser_account_type: string;
  sync_first_time: true;
  sync_is_active: false;
  status_sync: "OH" | "IP" | "CO" | "ER";
  time_refresh_data?: string;
  error?: any;
  currency: string;
  status: string;
  other_field?: any;
  create_time: string;
  core_user: string;
}

export interface TiktokAdsAccountType extends AccountTypeDefault {
  sync_is_active?: boolean;
  name?: string;
  advertiser_id?: string;
}

export interface LazadaAccountType extends AccountTypeDefault {
  name_company?: string;
  uuid?: string;
  email?: string;
  location?: string;
  created_at?: string;
  modified_at?: string;
  refresh_token_expired_at?: string;
  authorized_at?: string;
}

export interface ShopeeAccountType extends AccountTypeDefault {
  shop_name?: string;
  expire_in?: string;
  region?: string;
  shop_id: string;
  shop_logo?: string;
}

export interface RoleType extends AccountTypeDefault {
  code?: string;
  route?: string;
}

export interface UserHistoryType extends AccountTypeDefault {
  history_date?: string;
  history_user?: string;
  history_type?: string;
  history_change_reason?: string;
  phone?: string;
}

export interface AccountType
  extends AdAccountType,
    SkylinkAccountType,
    FacebookAccountType,
    FanpageAccountType,
    GoogleAccountType,
    CustomerAccountType,
    ZaloAccountType,
    TiktokAccountType,
    LazadaAccountType,
    ShopeeAccountType,
    RoleType {}
