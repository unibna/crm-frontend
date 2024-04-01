import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import { ErrorName } from "_types_/ResponseApiType";
import { useCancelToken } from "hooks/useCancelToken";
import useSettings from "hooks/useSettings";
import { useCallback, useEffect, useState } from "react";
import { handleSizeTable } from "utils/tableUtil";
import { IS_EXISTED_COLUMN, IS_EXISTED_COLUMN_WIDTH } from "views/LeadCenterView/constants/columns";
import LeadTable from "./LeadTable";
import { DGridDataType } from "_types_/DGridType";

interface Props {
  phone?: string;
}

const PhoneExistedTable = ({ phone }: Props) => {
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(IS_EXISTED_COLUMN_WIDTH);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const { newCancelToken } = useCancelToken();
  const [params, setParams] = useState({ limit: 500, page: 1 });

  const [data, setData] = useState<DGridDataType<PhoneLeadResType>>({
    data: [],
    count: 0,
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await phoneLeadApi.get<PhoneLeadResType>({
      params: { ...params, search: phone, cancelToken: newCancelToken() },
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
  }, [newCancelToken, params, phone]);

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
        params={{ page: 1, limit: 200, phone }}
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        hiddenPagination
        heightTable={350}
        cellStyle={{ height: 60 }}
        headerStyle={{ zIndex: 1 }}
        isDataStatusLabel
        isHandleByLabel
        data={data}
      />
    </Box>
  );
};

export default PhoneExistedTable;
