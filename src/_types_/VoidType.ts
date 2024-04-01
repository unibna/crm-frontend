export interface VoidType {
  id?: number;
  calldate?: string;
  callid: string;
  recording?: string;
  play?: string;
  eplay?: string;
  download?: string;
  did?: string;
  src?: string;
  dst?: string;
  status?: string;
  note?: string;
  disposition?: string;
  lastapp?: string;
  telephonist?: string;
  billsec?: string;
  duration?: string;
  type?: string;
  duration_minutes?: string;
  duration_seconds?: string;
  skylink_note?: string;
  voip_account: string;
  business_call_type?: { id: number; value: string };
  modified?: string;
  modified_by_name?: string;
}
