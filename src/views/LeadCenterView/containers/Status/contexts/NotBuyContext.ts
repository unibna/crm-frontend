import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
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
  created_from: format(subDays(new Date(), 90), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dateValue: 91,
  lead_status: [LEAD_STATUS.NO_ORDER],
  ordering: "-created",
};
let NOT_ORDER_TAB_HIDDEN_COLUMN_NAMES: string[] = ["data_status", EDIT_LEAD_STATUS_COLUMN];

export interface NotOrderContextType<ParamType = any, ColumnSortType = any> {
  notOrderParams: ParamType;
  setNotOrderParams: Dispatch<SetStateAction<ParamType>>;
  isFullNotOrder: boolean;
  setFullNotOrder: Dispatch<SetStateAction<boolean>>;
  notOrderColumnsWidth: TableColumnWidthInfo[];
  setNotOrderColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  notOrderCO: string[];
  setNotOrderCO: Dispatch<SetStateAction<string[]>>;
  notOrderHC: string[];
  setNotOrderHC: Dispatch<SetStateAction<string[]>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

export const useNotBuyContext = (): NotOrderContextType => {
  const tabNoOrderStorageStringify = undefined;
  const { user } = useAuth();

  const [notOrderParams, setNotOrderParams] = useState({
    ...initParams,
    handle_by:
      !isReadAndWriteRole(user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ) && user
        ? [user.id]
        : undefined,
  });
  const [isFullNotOrder, setFullNotOrder] = useState(false);
  const [notOrderColumnsWidth, setNotOrderColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabNoOrderStorageStringify &&
      JSON.parse(tabNoOrderStorageStringify)?.columnWidths.length ===
        LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabNoOrderStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [notOrderCO, setNotOrderCO] = useState(
    tabNoOrderStorageStringify &&
      JSON.parse(tabNoOrderStorageStringify)?.columnsOrder.length ===
        LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabNoOrderStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [notOrderHC, setNotOrderHC] = useState(
    tabNoOrderStorageStringify && JSON.parse(tabNoOrderStorageStringify).columnsHidden
      ? JSON.parse(tabNoOrderStorageStringify).columnsHidden
      : NOT_ORDER_TAB_HIDDEN_COLUMN_NAMES
  );
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    setNotOrderParams((prev) => {
      return {
        ...prev,
        handle_by: !isReadAndWriteRole(user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
        )
          ? [user?.id]
          : undefined,
      };
    });
  }, [user]);

  return {
    isFullNotOrder,
    notOrderCO,
    notOrderColumnsWidth,
    notOrderHC,
    notOrderParams,
    setFullNotOrder,
    setNotOrderCO,
    setNotOrderColumnsWidth,
    setNotOrderHC,
    setNotOrderParams,
    columnShowSort,
    setColumnShowSort,
  };
};
