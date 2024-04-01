import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import useAuth from "hooks/useAuth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import {
  REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_ORDER_V2,
  REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_V2,
  REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMN_WIDTHS_V2,
} from "views/LeadCenterView/constants/columns";
import { isReadAndWriteRole } from "utils/roleUtils";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { useSelector } from "react-redux";
import { leadStore } from "store/redux/leads/slice";
import { toSimplest } from "utils/stringsUtil";

const initParams = {
  limit: 500,
  page: 1,
  created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
  created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  dateValue: 31,
  assigned_from: format(subDays(new Date(), 0), yyyy_MM_dd),
  assigned_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  defaultAssignedDate: 0,
  dimension: ["lead_product", "telesale"],
};

export interface ReportHandleLeadByProductContextType<ParamType = any> {
  reportHandleLeadByProductParams: ParamType;
  setReportHandleLeadByProductParams: Dispatch<SetStateAction<ParamType>>;
  isFullReportHandleLeadByProductTable: boolean;
  setFullReportHandleLeadByProductTable: Dispatch<SetStateAction<boolean>>;
  reportHandleLeadByProductColumns: Column[];
  setReportHandleLeadByProductColumns: Dispatch<SetStateAction<Column[]>>;
  reportHandleLeadByProductCO: string[];
  setReportHandleLeadByProductCO: Dispatch<SetStateAction<string[]>>;
  reportHandleLeadByProductCW: TableColumnWidthInfo[];
  setReportHandleLeadByProductCW: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  reportHandleLeadByProductHC: string[];
  setReportHandleLeadByProductHC: Dispatch<SetStateAction<string[]>>;
}

export const useReportHandleLeadByProductContext = (): ReportHandleLeadByProductContextType => {
  const { user } = useAuth();
  const channelAttributes = useSelector(leadStore).attributes.channel;

  const [reportHandleLeadByProductParams, setReportHandleLeadByProductParams] = useState<any>({
    ...initParams,
    handle_by:
      !isReadAndWriteRole(
        user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ) && user?.id
        ? [user.id]
        : undefined,
  });
  const [isFullReportHandleLeadByProductTable, setFullReportHandleLeadByProductTable] =
    useState(false);
  const [reportHandleLeadByProductColumns, setReportHandleLeadByProductColumns] = useState(
    REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_V2
  );
  const [reportHandleLeadByProductCO, setReportHandleLeadByProductCO] = useState(
    REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_ORDER_V2
  );
  const [reportHandleLeadByProductCW, setReportHandleLeadByProductCW] = useState(
    REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMN_WIDTHS_V2
  );
  const [reportHandleLeadByProductHC, setReportHandleLeadByProductHC] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setReportHandleLeadByProductParams((prev: any) => {
        return {
          ...prev,
          //đối với sale
          handle_by:
            !isReadAndWriteRole(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
            ) && user?.id
              ? [user.id]
              : undefined,
        };
      });
    }
  }, [user]);

  const crmChannel = channelAttributes
    .filter((item) => toSimplest(item.name).includes("crm"))
    .map((item) => item.name);

  return {
    reportHandleLeadByProductParams: { ...reportHandleLeadByProductParams, channel: crmChannel },
    setReportHandleLeadByProductParams,
    isFullReportHandleLeadByProductTable,
    setFullReportHandleLeadByProductTable,
    reportHandleLeadByProductCO,
    reportHandleLeadByProductCW,
    reportHandleLeadByProductColumns,
    setReportHandleLeadByProductCO,
    setReportHandleLeadByProductCW,
    setReportHandleLeadByProductColumns,
    reportHandleLeadByProductHC,
    setReportHandleLeadByProductHC,
  };
};
