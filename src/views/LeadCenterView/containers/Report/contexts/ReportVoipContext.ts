import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";
import { Dispatch, SetStateAction, useState } from "react";
import {
  REPORT_VOIP_COLUMNS_ORDER_V2,
  REPORT_VOIP_COLUMNS_V2,
  REPORT_VOIP_COLUMN_WIDTHS_V2,
} from "views/LeadCenterView/constants/columns";

const initParams = {
  limit: 200,
  page: 1,
  dimension: ["calldate"],
  date_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  date_to: format(new Date(), yyyy_MM_dd),
  callDateValue: -1,
};

export interface ReportVoipContextType<ParamType = any> {
  reportVoipParams: ParamType;
  setReportVoipParams: Dispatch<SetStateAction<ParamType>>;
  isFullReportVoipTable: boolean;
  setFullReportVoipTable: Dispatch<SetStateAction<boolean>>;
  reportVoipColumns: Column[];
  setReportVoipColumns: Dispatch<SetStateAction<Column[]>>;
  reportVoipCO: string[];
  setReportVoipCO: Dispatch<SetStateAction<string[]>>;
  reportVoipCW: TableColumnWidthInfo[];
  setReportVoipCW: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  reportVoipHC: string[];
  setReportVoipHC: Dispatch<SetStateAction<string[]>>;
}

export const useReportVoipContext = () => {
  const [reportVoipParams, setReportVoipParams] = useState(initParams);
  const [isFullReportVoipTable, setFullReportVoipTable] = useState(false);
  const [reportVoipColumns, setReportVoipColumns] = useState(REPORT_VOIP_COLUMNS_V2);
  const [reportVoipCO, setReportVoipCO] = useState(REPORT_VOIP_COLUMNS_ORDER_V2);
  const [reportVoipCW, setReportVoipCW] = useState(REPORT_VOIP_COLUMN_WIDTHS_V2);
  const [reportVoipHC, setReportVoipHC] = useState<string[]>([]);

  return {
    reportVoipParams,
    isFullReportVoipTable,
    reportVoipCO,
    reportVoipCW,
    reportVoipHC,
    reportVoipColumns,
    setReportVoipParams,
    setFullReportVoipTable,
    setReportVoipCO,
    setReportVoipCW,
    setReportVoipColumns,
    setReportVoipHC,
  };
};
