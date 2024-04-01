export enum TRANSPORTATION_HANDLE_STATUS_TYPE {
  NEW = "new",
  PENDING = "pending",
  PROCESSING = "processing",
  HANDLED = "handled",
  COMPLETED = "completed",
}
export interface TransportationAttributeGroupType {
  id: number;
  value: string;
  label: string;
}
export interface TransportationType {
  id: number;
  value: string;
  label: string;
  attribute_group: {
    id: number;
    value: string;
    label: string;
  };
}

export type TransportationHandleStatusType =
  | "new"
  | "pending"
  | "processing"
  | "handled"
  | "completed";
export interface TransportationOrderResType {
  id: string;
  order: any;
  title?: string;
  handle_by?: any;
  modified_by?: any;
  note?: string;
  appointment_date?: string;
  modified?: string;
  created?: string;
  status: TransportationHandleStatusType;
  late_created?: string;
  late_reason?: string | number;
  late_action?: string | number;
  wait_return_created?: string;
  wait_return_reason?: string | number;
  wait_return_action?: string | number;
  returning_created?: string;
  returning_reason?: string | number;
  returning_action?: string | number;
  returned_created?: string;
  returned_reason?: string | number;
  returned_action?: string | number;
}

export interface TransportationOrderType {
  id: string;
  order: any;
  title?: string;
  handle_by?: any;
  modified_by?: any;
  note?: string;
  appointment_date?: string;
  assigned_at?: string;
  modified?: string;
  created?: string;
  status: TransportationHandleStatusType;
  late_created?: string;
  late_reason?: string | number;
  late_action?: string | number;
  wait_return_created?: string;
  wait_return_reason?: string | number;
  wait_return_action?: string | number;
  returning_created?: string;
  returning_reason?: string | number;
  returning_action?: string | number;
  returned_created?: string;
  returned_reason?: string | number;
  returned_action?: string | number;
}

export enum TransportationCareTaskType {
  LATE = "late",
  WAIT_RETURN = "wait_return",
  RETURNING = "returning",
  RETURNED = "returned",
}

export interface TransportationCareFilterProps {
  filterTrackingStatus?: (value: string | number | (string | number)[]) => void;
  filterHandleBy?: (value: string | number | (string | number)[]) => void;
  filterModifiedBy?: (value: string | number | (string | number)[]) => void;
  modifiedByDefault?: (string | number)[] | number | string;
  filterAssignBy?: (value: string | number | (string | number)[]) => void;
  assignByDefault?: (string | number)[] | number | string;
  filterOrderCreatedBy?: (value: string | number | (string | number)[]) => void;
  orderCreatedByDefault?: (string | number)[] | number | string;
  filterOrderStatus?: (value: string | number | (string | number)[]) => void;
  filterDate?: (
    from: string | undefined,
    to: string | undefined,
    dateValue: number | string | undefined
  ) => void;
  filterTrackingCreatedDate?: (
    from: string | undefined,
    to: string | undefined,
    dateValue: number | string | undefined
  ) => void;
  filterConfirmDate?: (
    from: string | undefined,
    to: string | undefined,
    dateValue: number | string | undefined
  ) => void;
  filterAssignedDate?: (
    from: string | undefined,
    to: string | undefined,
    dateValue: number | string | undefined
  ) => void;
  trackingCreatedDefault?: number | string;
  completedTimeDefault?: number | string;
  assignedDateDefault?: number | string;
  handleByDefault?: (string | number)[] | number | string;
  skylinkStatusDefault?: (string | number)[] | number | string;
  filterDateDefault?: number | string;
  filterReferringSite?: (value: string | number | (string | number)[]) => void;
  referringSiteDefault?: (string | number)[] | number | string;
  orderStatusDefault?: (string | number)[] | number | string;
  tracking_created_from?: string;
  tracking_created_to?: string;
  date_from?: string;
  date_to?: string;
  last_handle_date_from?: string;
  last_handle_date_to?: string;
  onModifiedAt?: (
    from: string | undefined,
    to: string | undefined,
    dateValue: number | string | undefined
  ) => void;
  modifiedAtDefault?: number | string;
  filterCount: number;
  filterLateReason?: (value: string | number | (string | number)[]) => void;
  filterLateAction?: (value: string | number | (string | number)[]) => void;
  filterWaittingForReturnReason?: (value: string | number | (string | number)[]) => void;
  filterWaittingForReturnAction?: (value: string | number | (string | number)[]) => void;
  filterReturningReason?: (value: string | number | (string | number)[]) => void;
  filterReturningAction?: (value: string | number | (string | number)[]) => void;
  filterReturnedReason?: (value: string | number | (string | number)[]) => void;
  filterReturnedAction?: (value: string | number | (string | number)[]) => void;
  filterReasonCreated?: (value: string | number | (string | number)[]) => void;
  filterHandleStatus?: (value: string | number | (string | number)[]) => void;
  filterTrackingCompany?: (value: string | number | (string | number)[]) => void;
  handleStatusDefault?: string | number | (string | number)[];
  lateReasonDefault?: string | number | (string | number)[];
  lateActionDefault?: string | number | (string | number)[];
  waittingForReturnReasonDefault?: string | number | (string | number)[];
  waittingForReturnActionDefault?: string | number | (string | number)[];
  returningReasonDefault?: string | number | (string | number)[];
  returningActionDefault?: string | number | (string | number)[];
  returnedReasonDefault?: string | number | (string | number)[];
  returnedActionDefault?: string | number | (string | number)[];
  reasonCreatedDefault?: string | number | (string | number)[];
  trackingCompanyDefault?: string | number | (string | number)[];
  params?: any;
}
