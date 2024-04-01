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

const initParams = {
  limit: 30,
  page: 1,
  created_from: format(subDays(new Date(), 90), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dateValue: 91,
  ordering: "-created",
};

export interface AllPhoneLeadContextType<ParamType = any, ColumnSortType = any> {
  allPhoneColumnsWidth: TableColumnWidthInfo[];
  setAllPhoneColumnsWidth: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  allPhoneCO: string[];
  setAllPhoneCO: Dispatch<SetStateAction<string[]>>;
  allPhoneHC: string[];
  setAllPhoneHC: Dispatch<SetStateAction<string[]>>;
  isFullAllPhoneTable: boolean;
  setFullAllPhoneTable: Dispatch<SetStateAction<boolean>>;
  allPhoneParams: ParamType;
  setAllPhoneParams: Dispatch<SetStateAction<ParamType>>;
  columnShowSort?: ColumnSortType;
  setColumnShowSort?: Dispatch<SetStateAction<ColumnSortType>>;
}

const ALL_TAB_HIDE_COLUMNS = [EDIT_LEAD_STATUS_COLUMN];
export const useAllPhoneContext = (): AllPhoneLeadContextType => {
  //object columns resize and columns order in tab all
  // const tabAllStorageStringify = getStorage("tab-all-phone-lead");
  const tabAllStorageStringify = undefined;
  const { user } = useAuth();
  const isControlLead = isReadAndWriteRole(user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
  );

  const [allPhoneParams, setAllPhoneParams] = useState({
    ...initParams,
    handle_by: !isControlLead && user ? [user.id] : undefined,
  });
  const [allPhoneColumnsWidth, setAllPhoneColumnsWidth] = useState<TableColumnWidthInfo[]>(
    tabAllStorageStringify &&
      JSON.parse(tabAllStorageStringify)?.columnWidths.length === LEAD_CENTER_COLUMNS_WIDTH.length
      ? JSON.parse(tabAllStorageStringify).columnWidths
      : LEAD_CENTER_COLUMNS_WIDTH
  );
  const [allPhoneCO, setAllPhoneCO] = useState(
    tabAllStorageStringify &&
      JSON.parse(tabAllStorageStringify)?.columnsOrder.length === LEAD_CENTER_ORDER_COLUMNS.length
      ? JSON.parse(tabAllStorageStringify).columnsOrder
      : LEAD_CENTER_ORDER_COLUMNS
  );
  const [allPhoneHC, setAllPhoneHC] = useState<string[]>(
    tabAllStorageStringify && JSON.parse(tabAllStorageStringify).columnsHidden
      ? JSON.parse(tabAllStorageStringify).columnsHidden
      : []
  );
  const [isFullAllPhoneTable, setFullAllPhoneTable] = useState(false);
  const [columnShowSort, setColumnShowSort] = useState(LEAD_CENTER_COLUMNS_SHOW_SORT);

  useEffect(() => {
    if (user) {
      if (!isControlLead) {
        setAllPhoneParams((prev) => {
          return {
            ...prev,
            handle_by: user && user.id ? [user.id] : undefined,
          };
        });
      }
    }
  }, [user, allPhoneHC, isControlLead]);

  return {
    allPhoneCO,
    setAllPhoneCO,
    allPhoneColumnsWidth,
    setAllPhoneColumnsWidth,
    isFullAllPhoneTable,
    setFullAllPhoneTable,
    allPhoneHC,
    setAllPhoneHC,
    allPhoneParams,
    setAllPhoneParams,
    columnShowSort,
    setColumnShowSort,
  };
};
