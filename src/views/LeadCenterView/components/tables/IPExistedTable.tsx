import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import { phoneLeadApi } from "_apis_/lead.api";
import { DGridDataType } from "_types_/DGridType";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import { useCancelToken } from "hooks/useCancelToken";
import useSettings from "hooks/useSettings";
import { useCallback, useEffect, useState } from "react";
import { handleSizeTable } from "utils/tableUtil";
import { IS_EXISTED_COLUMN, IS_EXISTED_COLUMN_WIDTH } from "views/LeadCenterView/constants/columns";
import LeadTable from "./LeadTable";

interface Props {
  ipAddress?: string;
}

const IPExistedTable = ({ ipAddress }: Props) => {
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(IS_EXISTED_COLUMN_WIDTH);
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
    if (ipAddress) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await phoneLeadApi.get<PhoneLeadResType>({
        params: { page: 1, limit: 100, ip_address: ipAddress, cancelToken: newCancelToken() },
      });
      if (result.data) {
        const { count, next = "", previous = "", results } = result.data;

        setData({ data: results, next, previous, count: count || 0, loading: false });
      } else {
        // không nhận trạng thái của CANCEL_REQUEST
        if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
          return;
        }
        setData((prev) => ({ ...prev, loading: false }));
      }
    }
  }, [newCancelToken, ipAddress]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Box
      component={Paper}
      style={{ width: handleSizeTable(isTablet, !!(isCollapse && !isTablet)).width }}
      className="log-table-wrap"
    >
      <LeadTable
        columns={IS_EXISTED_COLUMN}
        defaultColumnOrders={IS_EXISTED_COLUMN.map((item) => item.name)}
        params={{ page: 1, limit: 100, ip_address: ipAddress }}
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        hiddenPagination
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

export default IPExistedTable;
