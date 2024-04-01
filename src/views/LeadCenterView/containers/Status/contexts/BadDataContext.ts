import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
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

let BAD_DATA_TAB_HIDDEN_COLUMN_NAMES: string[] = ["data_status", EDIT_LEAD_STATUS_COLUMN];

const initParams = {
  lead_status: [LEAD_STATUS.NOT_QUALITY_DATA],
  limit: 30,
  page: 1,
  created_from: format(subDays(new Date(), 90), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dateValue: 91,
  ordering: "-created",
};

export interface BadDataContextType<ParamType = any, ColumnSortType = any> {
  isFullBadDataTable: boolean;
  setFullBadDataTable: Dispatch<SetStateAction<boolean>>;
  badDataColumnsWidth: TableColumnWidthInfo[];
  setBadDataColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  badDataHC: string[];
  setBadDataHC: Dispatch<SetStateAction<string[]>>;
  badDataHO: string[];
  setBadDataHO: Dispatch<SetStateAction<string[]>>;
  badDataParams: ParamType;
  setBadDataParams: Dispatch<SetStateAction<ParamType>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

export const useBadDataContext = (): BadDataContextType => {
  const tabBadDataStorageStringify = undefined;

  const { user } = useAuth();
  const [isFullBadDataTable, setFullBadDataTable] = useState(false);
  const [badDataHC, setBadDataHC] = useState(
    tabBadDataStorageStringify && JSON.parse(tabBadDataStorageStringify).columnsHidden
      ? JSON.parse(tabBadDataStorageStringify).columnsHidden
      : BAD_DATA_TAB_HIDDEN_COLUMN_NAMES
  );
  const [badDataColumnsWidth, setBadDataColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabBadDataStorageStringify &&
      JSON.parse(tabBadDataStorageStringify)?.columnWidths.length ===
        LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabBadDataStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [badDataHO, setBadDataHO] = useState(
    tabBadDataStorageStringify &&
      JSON.parse(tabBadDataStorageStringify)?.columnsOrder.length ===
        LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabBadDataStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [badDataParams, setBadDataParams] = useState({
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
      setBadDataParams((prev) => {
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
    badDataColumnsWidth,
    badDataHC,
    badDataHO,
    badDataParams,
    isFullBadDataTable,
    setFullBadDataTable,
    setBadDataColumnsWidth,
    setBadDataHC,
    setBadDataHO,
    setBadDataParams,
    columnShowSort,
    setColumnShowSort,
  };
};
