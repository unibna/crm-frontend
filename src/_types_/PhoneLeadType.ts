import { HISTORY_ACTIONS } from "constants/index";
import { AddressType } from "./AddressType";
import { AttributeType } from "./AttributeType";
import { UserType } from "./UserType";

export interface PhoneLeadType {
  ad_id?: string;
  ad_id_content?: string;
  ad_channel?: string;
  channel: number | string;
  fail_reason: number | string | null;
  handle_status: number;
  handle_reason: number | string;
  data_status: number | string | null;
  lead_status?: string;
  id?: string;
  recent_handling?: number;
  call_later_at?: string;
  is_require_call_later_at?: boolean;
  note: string;
  order_information: string;
  name: string;
  handle_by?: string;
  fanpage: number | string;
  phone?: string;
  phone_number?: string;
  product: number | string;
  bad_data_reason: string;
  customer_group?: string | number;
  refresh?: string;
  tags: string[];
  modified_by?: string;
  created_by?: string;
  address?: AddressType;
  additional_data?: any;
}

export interface PhoneLeadResType {
  tags?: string[];
  order?: string;
  handle?: string;
  name?: string;
  landing_page_url?: string;
  call_later_at?: string;
  order_information: string;
  os?: string;
  handle_status?: number;
  is_new_customer?: boolean;
  is_existed?: boolean;
  is_duplicated_ip?: boolean;
  is_valid: boolean;
  ip_address?: string;
  data_status?: AttributeType;
  handle_by?: { id: string; name: string; email: string };
  created: string;
  channel?: AttributeType;
  fail_reason?: AttributeType;
  created_by: { id: string; name: string; email: string };
  bad_data_reason: AttributeType;
  handle_reason?: AttributeType;
  modified_by?: Partial<UserType>;
  lead_status?: LeadStatusType;
  id?: string;
  recent_handling?: number;
  note: string;
  fanpage?: AttributeType;
  phone?: string;
  phone_number?: string;
  product?: AttributeType;
  modified_at?: string;
  modified?: string;
  isCheckHandleBy?: boolean;
  edit_handle_by_column?: boolean;
  isCheckDataStatus?: boolean;
  ad_channel?: string;
  ad_id?: string;
  ad_id_content?: string;
}

export interface ParamsPhoneLeadType {
  status?: string;
  channel: string[];
  ip_address?: string;
  fail_reason: string[];
  handle_status: string[];
  lead_status?: LeadStatusType[];
  limit: number;
  data_status?: string[];
  handle_by?: string[];
  dimension?: string;
  is_new_customer?: boolean;
  page: number;
  fanpage: string[];
  bad_data_reason?: string[];
  product: string[];
  search: string | undefined;
  created_from: string;
  created_to: string;
  modified_by: number | string;
  ordering: string;
  orderingParent?: string;
  created_by?: string[];
  handle_reason?: string[];
  customer_group?: string[];
  phone?: string;
  handler_assigned_from: string;
  handler_assigned_to: string;
  process_done_from: string;
  process_done_to: string;
  defaultProcessDate?: number | string;
  dateValue?: string | number;
  call_later_at?: string | number;
  ad_channel?: string;
  ad_id?: string;
  ad_id_content?: string;
}

export type PhoneLeadAttributeType = {
  channel: AttributeType[];
  data_status: AttributeType[];
  fail_reason: AttributeType[];
  fanpage: AttributeType[];
  handle_reason: AttributeType[];
  product: AttributeType[];
  bad_data_reason: AttributeType[];
  tag: AttributeType[];
};

export interface PhoneLogType {
  history_id: number;
  history_user: { id: string; name: string; email: string };
  created_at?: Date;
  modified_at?: Date;
  created?: Date;
  modified?: Date;
  id: string;
  name: string;
  phone_number: string;
  phone: string;
  order_information: string;
  action: string;
  note: string;
  call_later_at: Date;
  landing_page_url: string;
  ip_address: string;
  os: string;
  recent_handling: number;
  lead_status: LeadStatusType;
  is_existed: boolean;
  address: boolean;
  is_valid: boolean;
  history_date: Date;
  history_change_reason: string;
  history_type: HISTORY_ACTIONS;
  modified_by: { id: string; name: string; email: string };
  created_by: { id: string; name: string; email: string };
  handle_by: { id: string; name: string; email: string };
  bad_data_reason: { id: string; name: string; email: string };
  handle_status: { id: string; name: string };
  handle_reason: { id: string; name: string; email: string };
  channel: { id: string; name: string };
  fanpage: { id: string; name: string };
  product: { id: string; name: string };
  fail_reason: { id: string; name: string };
  data_status: { id: string; name: string };
  customer_group: { id: string; name: string };
  additional_data?: any;
  ad_channel?: string;
  ad_id?: string;
  ad_id_content?: string;
}
export interface PhoneLogInfoType {
  count: number;
  results: PhoneLogType[];
}

export type LeadStatusType = "0" | "1" | "2" | "3" | "4" | "5" | "7";

export type PhoneLeadTabNameType =
  | "new"
  | "waiting"
  | "all"
  | "handling"
  | "considering"
  | "has_order"
  | "no_order"
  | "report"
  | "bad_data"
  | "user"
  | "spam"
  | "report-crm";

export interface PhoneLeadReportType {
  new: number;
  buy: number;
  date: string;
  total: number;
  channel?: string;
  product?: string;
  not_buy: number;
  fanpage?: string;
  consider: number;
  unprocessed: number;
  handle_by?: string;
  pre_qualified: number;
  waiting: number;
  post_qualified: number;
  processed: number;
  created_by?: string;
  processing: number;
  data_status?: string;
  fail_reason?: string;
  buy_rate?: number;
  handle_status?: string;
  handle_reason?: string;
  post_not_qualified: number;
  pre_not_qualified: number;
  bad_data_reason?: string;
}

export interface ReportType extends PhoneLeadAttributeType {
  handle_by: string;
  created_date: string;
  created_by: string;
  handler_assigned_date: string;
  handle_status: string;
  ad_channel: string;
  ad_account: string;
  ad_id_content: string;
  ad_campaign_type: string;
  ad_partner: string;
  ad_product_code: string;
}

export interface ReportSaleType {
  lead_product?: string;
  aov: number;
  assigned_lead: number;
  buy_lead: number;
  buy_ratio: number;
  lasted_created_date: string;
  lead_channel: string;
  not_buy_lead: number;
  processed_lead: number;
  processing_lead: number;
  qualified_lead: number;
  total_customer: number;
  total_lead: number;
  total_order: number;
  total_revenue: number;
  waiting_lead: number;
  unassigned_lead: number;
}

export interface LeadFilterProps {
  isFilterHandler?: boolean;
  isFilterCreator?: boolean;
  isFilterChannel?: boolean;
  isFilterProduct?: boolean;
  isFilterFanpage?: boolean;
  isFilterLeadStatus?: boolean;
  isFilterHandleStatus?: boolean;
  isFilterBadDataReason?: boolean;
  isFilterFailReason?: boolean;
  isFilterAds?: boolean;
  isFilterHandleReason?: boolean;
  // isFilterCustomerGroup?: boolean;
  isFilterCreatedDate?: boolean;
  isFilterCallLaterAt?: boolean;
  isFilterProcessTime?: boolean;
  isFilterAssignedDate?: boolean;
  // isFilterVoipProccess?: boolean;
  isFilterDataStatus?: boolean;
  isFilterCustomerType?: boolean;
  isFilterChannelByName?: boolean;
  // isFilterCallDate?: boolean;
  tabName?: PhoneLeadTabNameType;
  isFilterProductByName?: boolean;
  // isFilterCallAttribute?: boolean;
  // defaultCallLaterAtDate?: number | string;
}

export interface ReportVoipType {
  business_call_type__value?: string;
  date?: string;
  telephonist?: string;
  inbound: number;
  missed_inbound: number;
  missed_outbound: number;
  outbound: number;
  total: number;
  answered_inbound: number;
  answered_outbound: number;
  busy_outbound: number;
  failed_outbound: number;
  total_billsec: number;
  total_inbound_billsec: number;
  total_outbound_billsec: number;
}

export interface ForeCastType {
  customer__phone: string;
  predicted_date: string;
  product_name: string;
}

export interface CRMDailyResponse {
  created: string;
  forecast: Partial<ForeCastType>[];
  detail_today: Partial<CRMDailyDetail>[];
}

export interface CRMDailyDetail {
  created: string;
  completed_time: string;
  crm_date_mark: string;
  customer_id: string;
  delivery_shift: string;
  id: string;
  is_main_product: string;
  name: string;
  order_key: string;
  period: string;
  phone: string;
  product_id: string;
  product_name: string;
  shipping__carrier_status: string;
  shipping__finish_date: string;
  shipping_address__location__province__label: string;
  status: string;
  customer__phone: string;
  predicted_date: string;
}

export interface CRMDaily {
  created?: string;
  name: "forecast" | "detail_today";
  crm_daily_detail: Partial<CRMDailyDetail>[];
}

export interface InterceptDataType {
  is_show: boolean;
  spam_type: string;
  status: string;
  data: string;
  note: string;
  spam_count: number;
  created_by_id: string;
  modified_by_id: string;
  tenant: string;
}
