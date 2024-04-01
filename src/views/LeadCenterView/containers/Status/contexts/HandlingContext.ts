import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import { EDIT_LEAD_STATUS_COLUMN } from "views/LeadCenterView/constants";
import {
  LEAD_CENTER_COLUMNS_SHOW_SORT,
  LEAD_CENTER_COLUMNS_WIDTH,
  LEAD_CENTER_ORDER_COLUMNS,
} from "views/LeadCenterView/constants/columns";

let HANDLE_TAB_HIDDEN_COLUMN_NAMES: string[] = ["data_status", EDIT_LEAD_STATUS_COLUMN];

export interface HandlingContextType<ParamType = any, ColumnSortType = any> {
  handlingParams: ParamType;
  setHandlingParams: Dispatch<SetStateAction<ParamType>>;
  isFullHandlingTable: boolean;
  setFullHandlingTable: Dispatch<SetStateAction<boolean>>;
  handlingCO: string[];
  setHandlingCO: Dispatch<SetStateAction<string[]>>;
  handlingColumnsWidth: TableColumnWidthInfo[];
  setHandlingColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  handlingHC: string[];
  setHandlingHC: Dispatch<SetStateAction<string[]>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

const initParams = {
  limit: 30,
  page: 1,
  created_from: format(subDays(new Date(), 90), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dateValue: 91,
  lead_status: ["3"],
  ordering: "-created",
};

export const useHandlingContext = (): HandlingContextType => {
  const tabHandlingStorageStringify = undefined;
  const { user } = useAuth();

  const [handlingParams, setHandlingParams] = useState({
    ...initParams,
    handle_by:
      !isReadAndWriteRole(user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ) && user
        ? [user.id]
        : undefined,
  });
  const [handlingColumnsWidth, setHandlingColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabHandlingStorageStringify &&
      JSON.parse(tabHandlingStorageStringify)?.columnWidths.length ===
        LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabHandlingStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [handlingCO, setHandlingCO] = useState(
    tabHandlingStorageStringify &&
      JSON.parse(tabHandlingStorageStringify)?.columnsOrder.length ===
        LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabHandlingStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [handlingHC, setHandlingHC] = useState<string[]>(
    tabHandlingStorageStringify && JSON.parse(tabHandlingStorageStringify).columnsHidden
      ? JSON.parse(tabHandlingStorageStringify).columnsHidden
      : HANDLE_TAB_HIDDEN_COLUMN_NAMES
  );
  const [isFullHandlingTable, setFullHandlingTable] = useState(false);
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    if (user) {
      if (
        !isReadAndWriteRole(user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
        )
      ) {
        setHandlingParams((prev) => {
          return {
            ...prev,
            handle_by: user && user.id ? [user.id] : undefined,
          };
        });
      }
    }
  }, [user, handlingHC]);
  return {
    handlingCO,
    handlingColumnsWidth,
    handlingHC,
    handlingParams,
    isFullHandlingTable,
    setFullHandlingTable,
    setHandlingCO,
    setHandlingColumnsWidth,
    setHandlingHC,
    setHandlingParams,
    columnShowSort,
    setColumnShowSort,
  };
};
