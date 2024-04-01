import { OrderPaymentTypeV2 } from "./OrderType";
import { UserType } from "./UserType";

export interface CollationType {
  "3rd_cod_amount": number;
  "3rd_cod_transfer_date": number;
  amount: number;
  delivery_status: string;
  file_amount: number;
  file_name: string;
  id?: number | string;
  images: any;
  is_confirm: boolean;
  order_id: string;
  order_key: string;
  payment: OrderPaymentTypeV2;
  payment_method: string;
  receive_time?: string;
  shipping_unit: string;
  transaction_code: string;
  upload_at: string;
  upload_by: Partial<UserType>;
}
