// Libraries
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
// Constants
import { yyyy_MM_dd } from "constants/time";
// Hooks
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import { EDIT_LEAD_STATUS_COLUMN, LEAD_STATUS } from "views/LeadCenterView/constants";
import {
  LEAD_CENTER_COLUMNS_SHOW_SORT,
  LEAD_CENTER_COLUMNS_WIDTH,
  LEAD_CENTER_ORDER_COLUMNS,
} from "views/LeadCenterView/constants/columns";

const initParams = {
  lead_status: [LEAD_STATUS.HAS_ORDER],
  limit: 30,
  page: 1,
  created_from: format(subDays(new Date(), 90), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dateValue: 91,
  ordering: "-created",
};

export interface HasOrderContextType<ParamType = any, ColumnSortType = any> {
  isFullHasOrderTable: boolean;
  setFullHasOrderTable: Dispatch<SetStateAction<boolean>>;
  hasOrderColumnsWidth: TableColumnWidthInfo[];
  setHasOrderColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  hasOrderHC: string[];
  setHasOrderHC: Dispatch<SetStateAction<string[]>>;
  hasOrderCO: string[];
  setHasOrderCO: Dispatch<SetStateAction<string[]>>;
  hasOrderParams: ParamType;
  setHasOrderParams: Dispatch<SetStateAction<ParamType>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

let HAS_ORDER_TAB_HIDDEN_COLUMN_NAMES = ["lead_info", "data_status", EDIT_LEAD_STATUS_COLUMN];

export const useHasOrderContext = (): HasOrderContextType => {
  const tabOrderStorageStringify = undefined;

  const { user } = useAuth();
  const [isFullHasOrderTable, setFullHasOrderTable] = useState(false);
  const [hasOrderHC, setHasOrderHC] = useState(
    tabOrderStorageStringify && JSON.parse(tabOrderStorageStringify).columnsHidden
      ? JSON.parse(tabOrderStorageStringify).columnsHidden
      : HAS_ORDER_TAB_HIDDEN_COLUMN_NAMES
  );
  const [hasOrderColumnsWidth, setHasOrderColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabOrderStorageStringify &&
      JSON.parse(tabOrderStorageStringify)?.columnWidths.length === LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabOrderStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [hasOrderCO, setHasOrderCO] = useState(
    tabOrderStorageStringify &&
      JSON.parse(tabOrderStorageStringify)?.columnsOrder.length === LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabOrderStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [hasOrderParams, setHasOrderParams] = useState({
    ...initParams,
    handle_by:
      !isReadAndWriteRole(user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ) && user
        ? [user.id]
        : undefined,
  });
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    if (user) {
      setHasOrderParams((prev) => {
        return {
          ...prev,
          handle_by:
            !isReadAndWriteRole(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
            ) && user
              ? [user.id]
              : undefined,
        };
      });
    }
  }, [user]);
  return {
    hasOrderColumnsWidth,
    hasOrderCO,
    setHasOrderCO,
    hasOrderParams,
    isFullHasOrderTable,
    setFullHasOrderTable,
    setHasOrderColumnsWidth,
    setHasOrderHC,
    setHasOrderParams,
    columnShowSort,
    setColumnShowSort,
    hasOrderHC,
  };
};
