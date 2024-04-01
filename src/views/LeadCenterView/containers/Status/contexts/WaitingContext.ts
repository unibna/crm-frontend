import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { isReadAndWriteRole } from "utils/roleUtils";
import { EDIT_LEAD_STATUS_COLUMN, LEAD_STATUS } from "views/LeadCenterView/constants";
import {
  LEAD_CENTER_COLUMNS_SHOW_SORT,
  LEAD_CENTER_COLUMNS_WIDTH,
  LEAD_CENTER_ORDER_COLUMNS,
} from "views/LeadCenterView/constants/columns";

const initParams = {
  limit: 30,
  page: 1,
  lead_status: [LEAD_STATUS.WAITING],
  ordering: "-created",
};
let WAITING_TAB_HIDDEN_COLUMN_NAMES: string[] = ["data_status", EDIT_LEAD_STATUS_COLUMN];

export interface WaitingContextType<ParamType = any, ColumnSortType = any> {
  waitingColumnsWidth: TableColumnWidthInfo[];
  setWaitingColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  waitingCO: string[];
  setWaitingCO: Dispatch<SetStateAction<string[]>>;
  waitingHC: string[];
  setWaitingHC: Dispatch<SetStateAction<string[]>>;
  isFullWaitingTable: boolean;
  setFullWaitingTable: Dispatch<SetStateAction<boolean>>;
  waitingParams: ParamType;
  setWaitingParams: Dispatch<SetStateAction<ParamType>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

export const useWaitingContext = (): WaitingContextType => {
  const tabWaitingStorageStringify = undefined;

  const { user } = useAuth();

  const [waitingParams, setWaitingParams] = useState({
    ...initParams,
    handle_by: !isReadAndWriteRole(user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
    )
      ? [user?.id]
      : undefined,
  });
  const [isFullWaitingTable, setFullWaitingTable] = useState(false);
  const [waitingColumnsWidth, setWaitingColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabWaitingStorageStringify &&
      JSON.parse(tabWaitingStorageStringify)?.columnWidths.length ===
        LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabWaitingStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [waitingCO, setWaitingCO] = useState(
    tabWaitingStorageStringify &&
      JSON.parse(tabWaitingStorageStringify)?.columnsOrder.length ===
        LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabWaitingStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [waitingHC, setWaitingHC] = useState<string[]>(
    tabWaitingStorageStringify && JSON.parse(tabWaitingStorageStringify).columnsHidden
      ? JSON.parse(tabWaitingStorageStringify).columnsHidden
      : WAITING_TAB_HIDDEN_COLUMN_NAMES
  );
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    if (user) {
      setWaitingParams((prev) => {
        return {
          ...prev,
          handle_by: !isReadAndWriteRole(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
          )
            ? [user.id]
            : undefined,
        };
      });
    }
  }, [user, waitingHC]);

  return {
    isFullWaitingTable,
    setFullWaitingTable,
    setWaitingCO,
    setWaitingColumnsWidth,
    setWaitingHC,
    setWaitingParams,
    waitingCO,
    waitingColumnsWidth,
    waitingHC,
    waitingParams,
    columnShowSort,
    setColumnShowSort,
  };
};
