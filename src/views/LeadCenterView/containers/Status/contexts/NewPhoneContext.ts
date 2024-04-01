import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
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
  limit: 30,
  page: 1,
  lead_status: [LEAD_STATUS.NEW],
  data_status: ["null"],
  ordering: "-created",
};

export interface NewPhoneContextType<ParamType = any, ColumnSortType = any> {
  newPhoneParams: ParamType;
  setNewPhoneParams: Dispatch<SetStateAction<ParamType>>;
  isFullNewPhoneTable: boolean;
  setFullNewPhoneTable: Dispatch<SetStateAction<boolean>>;
  newPhoneColumnsWidth: TableColumnWidthInfo[];
  setNewPhoneColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  newPhoneCO: string[];
  setNewPhoneCO: Dispatch<SetStateAction<string[]>>;
  newPhoneHC: string[];
  setNewPhoneHC: Dispatch<SetStateAction<string[]>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

let NEW_TAB_HIDDEN_COLUMN_NAMES = ["assign_info", "lead_info", EDIT_LEAD_STATUS_COLUMN];

export const useNewPhoneContext = (): NewPhoneContextType => {
  const tabNewStorageStringify = undefined;

  const { user } = useAuth();
  const [newPhoneParams, setNewPhoneParams] = useState(initParams);
  const [isFullNewPhoneTable, setFullNewPhoneTable] = useState(false);
  const [newPhoneColumnsWidth, setNewPhoneColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabNewStorageStringify &&
      JSON.parse(tabNewStorageStringify)?.columnWidths.length === LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabNewStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [newPhoneCO, setNewPhoneCO] = useState(
    tabNewStorageStringify &&
      JSON.parse(tabNewStorageStringify)?.columnsOrder.length === LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabNewStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [newPhoneHC, setNewPhoneHC] = useState<string[]>(
    tabNewStorageStringify && JSON.parse(tabNewStorageStringify).columnsHidden
      ? JSON.parse(tabNewStorageStringify).columnsHidden
      : NEW_TAB_HIDDEN_COLUMN_NAMES
  );
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    const isNotControlHandleBy = !isReadAndWriteRole(user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
    );
    setNewPhoneParams((prev) => ({
      ...prev,
      created_by: isNotControlHandleBy ? [user?.id] : undefined,
    }));
  }, [user]);

  return {
    isFullNewPhoneTable,
    newPhoneCO,
    newPhoneColumnsWidth,
    newPhoneHC,
    newPhoneParams,
    setFullNewPhoneTable,
    setNewPhoneCO,
    setNewPhoneColumnsWidth,
    setNewPhoneHC,
    setNewPhoneParams,
    columnShowSort,
    setColumnShowSort,
  };
};
