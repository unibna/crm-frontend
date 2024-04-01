import { useMediaQuery, useTheme } from "@mui/material";
import { orderApi } from "_apis_/order.api";
import { TransportationOrderType } from "_types_/TransportationType";
import WrapPage from "layouts/WrapPage";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useEffect, useState } from "react";
import TransportationDetailTable from "./TransportationDetailTable";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

export const TRANSPORTATION_HISTORY_COLUMNS = [
  { name: "modified", title: "Thời gian chỉnh sửa" },
  { name: "modified_by", title: "Người chỉnh sửa" },
  { name: "appointment_date", title: "Ngày hẹn gọi lại" },
  { name: "note", title: "Ghi chú" },
  { name: "handle_by", title: "Người nhận xử lý" },
  { name: "status", title: "Trạng thái xử lý" },
  { name: "reasons_created", title: "Task" },
  { name: "reason", title: "Lý do xử lý" },
  { name: "action", title: "Hướng xử lý" },
];

export const TRANSPORTATION_HISTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "modified", width: 200 },
  { columnName: "modified_by", width: 200 },
  { columnName: "appointment_date", width: 150 },
  { columnName: "note", width: 150 },
  { columnName: "handle_by", width: 200 },
  { columnName: "status", width: 150 },
  { columnName: "reasons_created", width: 250 },
  { columnName: "reason", width: 250 },
  { columnName: "action", width: 250 },
];

interface Props {
  isFullTable?: boolean;
  id: string;
}

const TransportationHistoryTable = ({ id, isFullTable }: Props) => {
  const theme = useTheme();

  const { newCancelToken } = useCancelToken();

  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [loading, setLoading] = useState(false);
  const [columnWidths, setColumnWidths] = useState(TRANSPORTATION_HISTORY_COLUMN_WIDTHS);
  const [columnOrders, setColumnOrders] = useState(
    TRANSPORTATION_HISTORY_COLUMNS.map((column: any) => column.name)
  );
  const [data, setData] = useState<{ data: TransportationOrderType[]; total: number }>({
    data: [],
    total: 0,
  });
  const [params, setParams] = useState<any>({ ordering: "-created", page: 1, limit: 200 });

  const getTransportationHistory = useCallback(async () => {
    setLoading(true);

    const result = await orderApi.get<TransportationOrderType>({
      params: {
        ...params,
        cancelToken: newCancelToken(),
      },
      endpoint: `transportation-care/${id}/history/`,
    });
    if (result.data) {
      const newData = result.data.results.map((item) => ({
        ...item,
        reason_created:
          item.late_created ||
          item.wait_return_created ||
          item.returning_created ||
          item.returned_created,
        reason:
          item.late_reason ||
          item.wait_return_reason ||
          item.returning_reason ||
          item.returned_reason,
        action:
          item.late_action ||
          item.wait_return_action ||
          item.returning_action ||
          item.returned_action,
      }));
      setData((prev) => ({ ...prev, total: result.data.count || 0, data: newData }));
    }
    setLoading(false);
  }, [id, newCancelToken, params]);

  useEffect(() => {
    getTransportationHistory();
  }, [getTransportationHistory, newCancelToken]);

  return (
    <WrapPage>
      <TransportationDetailTable
        heightTable={"auto"}
        data={{ data: data.data, loading, count: data.total }}
        columns={TRANSPORTATION_HISTORY_COLUMNS}
        columnWidths={columnWidths}
        isFullRow={isFullTable}
        setColumnWidths={(data) => setColumnWidths(data)}
        columnOrders={columnOrders}
        setColumnOrders={setColumnOrders}
        params={params}
        setParams={setParams}
        headerStyle={{ zIndex: 1 }}
        hiddenPagination
      />
    </WrapPage>
  );
};

export default TransportationHistoryTable;
