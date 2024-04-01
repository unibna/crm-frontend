import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadResType, PhoneLeadTabNameType } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import { useCancelToken } from "hooks/useCancelToken";
import useSettings from "hooks/useSettings";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleSizeTable } from "utils/tableUtil";
import {
  STATIC_HISTORY_COLUMNS,
  STATIC_HISTORY_COLUMNS_WIDTH,
  UNSTATIC_HISTORY_COLUMNS,
  UNSTATIC_HISTORY_COLUMN_WIDTHS,
} from "views/LeadCenterView/constants/columns";
import LeadTable from "./LeadTable";
import { DGridDataType } from "_types_/DGridType";

/**
 * Is table show actions for each phone lead record
 */
interface Props {
  params?: any;
  id: string;
  isFullTable: boolean;
  tabName?: PhoneLeadTabNameType;
}
const PhoneLeadRowDetailTable = ({ id, params, isFullTable, tabName }: Props) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const { newCancelToken } = useCancelToken();

  const [data, setData] = useState<DGridDataType<PhoneLeadResType>>({
    data: [],
    count: 0,
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await phoneLeadApi.get<PhoneLeadResType>({
      params: { ...params, cancelToken: newCancelToken() },
      endpoint: `leads/${id}/history/`,
    });
    if (result.data) {
      const { count, results } = result.data;

      setData({ data: results, count: count || 0, loading: false });
    } else {
      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }

      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [id, newCancelToken, params]);

  useEffect(() => {
    getData();
  }, [getData]);

  const historyColumns = useMemo(() => {
    let columns: Column[] = [];
    let columnWidths: TableColumnWidthInfo[] = [];
    if (tabName === "new" || tabName === "waiting" || tabName === "handling") {
      columns = UNSTATIC_HISTORY_COLUMNS;
      columnWidths = UNSTATIC_HISTORY_COLUMN_WIDTHS;
    } else {
      columns = STATIC_HISTORY_COLUMNS;
      columnWidths = STATIC_HISTORY_COLUMNS_WIDTH;
    }
    return { columnWidths, columns };
  }, [tabName]);

  const columnOrders = historyColumns.columns.map((item) => item.name);

  return (
    <Box
      component={Paper}
      style={{ width: handleSizeTable(isTablet, !!(isCollapse && !isTablet)).width }}
      className="log-table-wrap"
    >
      <LeadTable
        columns={historyColumns.columns}
        defaultColumnOrders={columnOrders}
        params={{ ...params, page: 1, limit: 100 }}
        defaultColumnWidths={historyColumns.columnWidths}
        hiddenPagination
        isFullRow={isFullTable}
        heightTable={350}
        headerStyle={{ zIndex: 1 }}
        cellStyle={{ height: 60 }}
        isDataStatusLabel
        isHandleByLabel
        data={data}
      />
    </Box>
  );
};

export default PhoneLeadRowDetailTable;
