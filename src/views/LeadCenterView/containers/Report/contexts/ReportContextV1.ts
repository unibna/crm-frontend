import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import {
  REPORT_COLUMNS,
  REPORT_COLUMNS_ORDER,
  REPORT_COLUMNS_WIDTH,
} from "views/LeadCenterView/constants/columns";
import { isReadAndWriteRole } from "utils/roleUtils";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

const initParams = {
  limit: 200,
  page: 1,
  created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dimension: "product",
  ordering: "total",
  dateValue: 31,
};

export interface ReportV1ContextType<ParamType = any> {
  reportV1Params: ParamType;
  setReportV1Params: Dispatch<SetStateAction<ParamType>>;
  isFullReportV1Table: boolean;
  setFullReportV1Table: Dispatch<SetStateAction<boolean>>;
  reportV1Columns: Column[];
  setReportV1Columns: Dispatch<SetStateAction<Column[]>>;
  reportV1CO: string[];
  setReportV1CO: Dispatch<SetStateAction<string[]>>;
  reportV1CW: TableColumnWidthInfo[];
  setReportV1CW: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  reportV1HC: string[];
  setReportV1HC: Dispatch<SetStateAction<string[]>>;
}

export const useReportV1Context = (): ReportV1ContextType => {
  const { user } = useAuth();
  const [reportV1Params, setReportV1Params] = useState(initParams);
  const [isFullReportV1Table, setFullReportV1Table] = useState(false);
  const [reportV1Columns, setReportV1Columns] = useState(REPORT_COLUMNS);
  const [reportV1CO, setReportV1CO] = useState(REPORT_COLUMNS_ORDER);
  const [reportV1CW, setReportV1CW] = useState(REPORT_COLUMNS_WIDTH);
  const [reportV1HC, setReportV1HC] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setReportV1Params((prev) => {
        return {
          ...prev,
          //đối với sale
          handle_by: user.group_permission?.code === "telesale" && user?.id ? [user.id] : undefined,
        };
      });
    }
  }, [user]);

  return {
    reportV1Params,
    setReportV1Params,
    isFullReportV1Table,
    setFullReportV1Table,
    reportV1CO,
    reportV1CW,
    reportV1Columns,
    setReportV1CO,
    setReportV1CW,
    setReportV1Columns,
    reportV1HC,
    setReportV1HC,
  };
};
