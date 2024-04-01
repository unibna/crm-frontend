import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { isReadAndWriteRole } from "utils/roleUtils";
import { LEAD_STATUS } from "views/LeadCenterView/constants";
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
  lead_status: [LEAD_STATUS.SPAM],
  ordering: "-created",
};
let SPAM_TAB_HIDDEN_COLUMN_NAMES: string[] = [
  "data_status",
  "handle_info",
  "assign_info",
  "lead_info",
  "data_status",
];

export interface SpamContextType<ParamType = any, ColumnSortType = any> {
  spamParams: ParamType;
  setSpamParams: Dispatch<SetStateAction<ParamType>>;
  isFullSpamTable: boolean;
  setFullSpamTable: Dispatch<SetStateAction<boolean>>;
  spamColumnsWidth: TableColumnWidthInfo[];
  setSpamColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  spamCO: string[];
  setSpamCO: Dispatch<SetStateAction<string[]>>;
  spamHC: string[];
  setSpamHC: Dispatch<SetStateAction<string[]>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

export const useSpamContext = (): SpamContextType => {
  const tabSpamStorageStringify = undefined;
  const { user } = useAuth();

  const [spamParams, setSpamParams] = useState({
    ...initParams,
    handle_by:
      !isReadAndWriteRole(user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ) && user
        ? [user.id]
        : undefined,
  });
  const [isFullSpamTable, setFullSpamTable] = useState(false);
  const [spamColumnsWidth, setSpamColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabSpamStorageStringify &&
      JSON.parse(tabSpamStorageStringify)?.columnWidths.length === LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabSpamStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [spamCO, setSpamCO] = useState(
    tabSpamStorageStringify &&
      JSON.parse(tabSpamStorageStringify)?.columnsOrder.length === LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabSpamStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [spamHC, setSpamHC] = useState(
    tabSpamStorageStringify && JSON.parse(tabSpamStorageStringify).columnsHidden
      ? JSON.parse(tabSpamStorageStringify).columnsHidden
      : SPAM_TAB_HIDDEN_COLUMN_NAMES
  );
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    setSpamParams((prev) => {
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
    isFullSpamTable,
    spamCO,
    spamColumnsWidth,
    spamHC,
    spamParams,
    setFullSpamTable,
    setSpamCO,
    setSpamColumnsWidth,
    setSpamHC,
    setSpamParams,
    columnShowSort,
    setColumnShowSort,
  };
};
