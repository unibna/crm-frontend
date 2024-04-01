import { AddressType } from "./AddressType";
import { UserType } from "./UserType";

export interface CustomerType {
  created: string;
  birthday: string | null;
  customer_care_staff: Partial<UserType>;
  customer_phone: string;
  email: string;
  full_name: string;
  gender: string;
  latest_up_rank_date: string;
  id: string;
  last_lead_data_status: string;
  ranking: string;
  last_order_date: string;
  source?: "3rd" | "skycom" | "not_found";
  last_order_id: string;
  last_order_name: string;
  lead_note: string;
  orders_count: number;
  phone: string;
  second_phone: string;
  total_order: string;
  total_spent: string;
  shipping_completed_order: number;
  shipping_completed_spent: number;
  last_shipping_completed_date: string;
  tags: (string | number)[];
  customer_note: string;
  shipping_addresses: AddressType[];
  address: AddressType;
  customer_name: string; // để update cho order
  last_name: string; // để update cho order
  modified_care_staff_by: Partial<UserType>;
  address_3rd: string;
  birthday_3rd: string | null;
  facebook_id_3rd: string;
  full_name_3rd: string;
  gender_3rd: string;
  modified_3rd: string;
}

export interface CustomerCareStaffHistory {
  history_id: number;
  history_user: null;
  handle_by: null;
  customer_care_staff: Partial<UserType>;
  modified_care_staff_by: Partial<UserType>;
  created: string;
  modified: string;
  id: string;
  phone: string;
  first_name: null;
  last_name: string;
  email: null;
  province: null;
  gender: null;
  total_order: number;
  total_spent: number;
  shipping_completed_order: number;
  shipping_completed_spent: number;
  last_order_id: string;
  last_order_name: string;
  last_order_date: string;
  last_shipping_completed_date: null;
  addresses: null;
  lead_name: null;
  last_lead_data_status: null;
  is_member: boolean;
  second_phone: null;
  ecommerce_id: string;
  datetime_modified_care_staff: string;
  history_date: string;
  history_change_reason: null;
  history_type: string;
}
