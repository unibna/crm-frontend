import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import {
  REPORT_COLUMNS_ORDER_V2,
  REPORT_COLUMNS_V2,
  REPORT_COLUMN_WIDTHS_V2,
} from "views/LeadCenterView/constants/columns";
import { isReadAndWriteRole } from "utils/roleUtils";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

const initParams = {
  limit: 200,
  page: 1,
  created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dimension: ["lead_product"],
  dateValue: 31,
};

export interface ReportV2ContextType<ParamType = any> {
  reportV2Params: ParamType;
  setReportV2Params: Dispatch<SetStateAction<ParamType>>;
  isFullReportV2Table: boolean;
  setFullReportV2Table: Dispatch<SetStateAction<boolean>>;
  reportV2Columns: Column[];
  setReportV2Columns: Dispatch<SetStateAction<Column[]>>;
  reportV2CO: string[];
  setReportV2CO: Dispatch<SetStateAction<string[]>>;
  reportV2CW: TableColumnWidthInfo[];
  setReportV2CW: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  reportV2HC: string[];
  setReportV2HC: Dispatch<SetStateAction<string[]>>;
}

export const useReportV2Context = () => {
  const { user } = useAuth();
  const [reportV2Params, setReportV2Params] = useState({
    ...initParams,
    handle_by:
      !isReadAndWriteRole(user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ) &&
      user?.id &&
      user.id
        ? [user.id]
        : undefined,
  });
  const [isFullReportV2Table, setFullReportV2Table] = useState(false);
  const [reportV2Columns, setReportV2Columns] = useState(REPORT_COLUMNS_V2);
  const [reportV2CO, setReportV2CO] = useState(REPORT_COLUMNS_ORDER_V2);
  const [reportV2CW, setReportV2CW] = useState(REPORT_COLUMN_WIDTHS_V2);
  const [reportV2HC, setReportV2HC] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setReportV2Params((prev) => {
        return {
          ...prev,
          //đối với sale
          handle_by:
            !isReadAndWriteRole(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
            ) && user?.id
              ? [user.id]
              : undefined,
        };
      });
    }
  }, [user]);

  return {
    reportV2Params,
    setReportV2Params,
    isFullReportV2Table,
    setFullReportV2Table,
    reportV2CO,
    reportV2CW,
    reportV2Columns,
    setReportV2CO,
    setReportV2CW,
    setReportV2Columns,
    reportV2HC,
    setReportV2HC,
  };
};
