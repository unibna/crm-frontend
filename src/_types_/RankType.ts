import { HISTORY_ACTIONS } from "constants/index";
import { AttributeType } from "./AttributeType";
import { CustomerType } from "./CustomerType";

export enum RankStatus {
  PENDING = "1",
  INPROCESS = "2",
  COMPLETE = "3",
}

export interface RankType extends Partial<CustomerType> {
  change_operation: HISTORY_ACTIONS;
  created: string;
  customer?: Partial<CustomerType>;
  customer_change_by?: string;
  field_changed: "ranking" | "birthday";
  id?: string;
  modified: string;
  modified_by?: string;
  modified_status?: string;
  new_value?: string;
  old_value?: string;
  modified_reason?: AttributeType;
}
