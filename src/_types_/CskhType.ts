import { GeneralType } from "./GeneralType";

export interface CskhType extends GeneralType {
  date_created?: string;
  phone?: string;
  handle_by?: string;
  description?: string;
  note?: string;
  order_number?: string;
  link_jira?: string;
  solution_description?: string;
  status?: string;
  channel?: string;
  product?: string;
  handle_reason?: string;
  solution?: string;
  comment?: string;
  created?: string;
  modified?: string;
}

export interface HistoryCskhType extends GeneralType {
  history_date?: string;
  modified_by?: string;
  phone?: string;
  handle_by?: string;
  description?: string;
  note?: string;
  order_number?: string;
  link_jira?: string;
  status?: string;
  channel?: string;
  product?: string;
  history_type?: string;
}
