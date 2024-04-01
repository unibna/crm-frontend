import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MultiSelect } from "components/Selectors";
import OrderHistoryTable from "views/OrderView/components/OrderHistoryTable";
import OrderTable from "views/OrderView/components/OrderTable";

import { orderApi } from "_apis_/order.api";

import { OrderType } from "_types_/OrderType";
import { ErrorName } from "_types_/ResponseApiType";

import { ORDER_STATUS } from "views/OrderView/constants/options";
import { ALL_OPTION } from "constants/index";
import { LABEL_STATUS_SHIPPING } from "constants/shipping";

import filter from "lodash/filter";
import map from "lodash/map";
import sum from "lodash/sum";

import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useEffect, useState } from "react";

import { fNumber } from "utils/formatNumber";
import { formatSelectorForQueryParams, revertFromQueryForSelector } from "utils/formatParamsUtil";

export const ORDER_COLUMNS: Column[] = [
  { name: "cdp_order", title: "Đơn hàng" },
  { name: "status", title: "Trạng thái đơn" },
  { name: "completed_time", title: "Ngày xác nhận" },
  { name: "source", title: "Kênh bán hàng" },
  { name: "tags", title: "Thẻ" },
  { name: "cdp_shipping_status", title: "Trạng thái giao hàng" },
  { name: "cdp_shipping_code", title: "Mã vận đơn" },
  { name: "cdp_payment", title: "Giá trị đơn hàng" },
];

export const ORDER_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "cdp_order", width: 100 },
  { columnName: "status", width: 100 },
  { columnName: "completed_time", width: 130 },
  { columnName: "source", width: 100 },
  { columnName: "tags", width: 180 },
  { columnName: "cdp_shipping_status", width: 150 },
  { columnName: "cdp_shipping_code", width: 150 },
  { columnName: "cdp_payment", width: 200 },
];

const OrderSkylinkTable = ({
  id,
  analystOrderStatus,
}: {
  id?: string;
  analystOrderStatus?: ({ orders, total }: { orders: number[]; total: number }) => void;
}) => {
  const [data, setData] = useState<{
    data: {
      cdp_order?: string;
      cdp_shipping_code?: number;
      cdp_shipping_status?: string;
      cdp_payment?: string;
    }[];
    count: number;
    loading: boolean;
  }>({ data: [], loading: false, count: 0 });
  const [params, setParams] = useState<{
    limit?: number;
    page?: number;
    ordering?: string;
    status?: any;
  }>({ limit: 200, page: 1, ordering: "-created" });
  const { newCancelToken } = useCancelToken();

  const calculatorOrderStatus = useCallback(
    (data: OrderType[], count: number) => {
      const result = map(
        Object.keys(LABEL_STATUS_SHIPPING),
        (status) => filter(data, (item) => item.shipping?.carrier_status === status)?.length
      );
      analystOrderStatus &&
        analystOrderStatus({ orders: [count - sum(result), ...result], total: count });
    },
    [analystOrderStatus]
  );

  const getData = useCallback(async () => {
    if (id) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await orderApi.get<OrderType>({
        params: {
          customer: id,
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: "get/all/",
      });

      if (result.data) {
        const data = map(result.data.results, (item) => {
          return {
            id: item.id,
            cdp_order: item.order_key,
            cdp_order_id: item.id,
            cdp_shipping_status: item.shipping?.carrier_status,
            cdp_shipping_code: item.shipping?.tracking_number,
            delivery_company_type: item.shipping?.delivery_company_type,
            cdp_payment: fNumber(item.total_actual),
            completed_time: item.completed_time,
            source: item.source,
            status: item.status,
            tags: item.tags,
          };
        });
        setData((prev) => ({
          ...prev,
          data,
          loading: false,
          count: result.data.count || 0,
        }));
        // khi get data mà không filter theo status và số lượng dữ liệu đơn hàng đủ lơn (>=50) thì tính trạng thái đơn
        !params.status &&
          (params.limit || 0) >= 50 &&
          calculatorOrderStatus(result.data.results, result.data.count || 0);
        return;
      }
      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }

      setData((prev) => ({ ...prev, loading: false }));
    } else {
      setData((prev) => ({
        ...prev,
        data: [],
        loading: false,
        count: 0,
      }));
    }
  }, [calculatorOrderStatus, id, newCancelToken, params]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Paper style={{ height: "100%" }} elevation={3}>
      <Stack direction="row" alignItems="center" padding={2}>
        <Typography style={{ fontSize: 18, marginLeft: 8, fontWeight: "bold" }}>
          Đơn hàng
        </Typography>
        <div
          style={{
            display: "flex",
            flex: 1,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <MultiSelect
            onChange={(value) => {
              const filterValue = formatSelectorForQueryParams(value);
              setParams((prev) => ({
                ...prev,
                status: filterValue ? [formatSelectorForQueryParams(value)] : filterValue,
              }));
            }}
            options={[ALL_OPTION, ...ORDER_STATUS]}
            title="Trạng thái đơn"
            selectorId="status-order-skylink"
            defaultValue={revertFromQueryForSelector(params.status)}
            simpleSelect
            style={{ marginBottom: 8, width: 180 }}
          />
        </div>
      </Stack>
      <OrderTable
        cellStyle={{ height: 80 }}
        data={data}
        tabName="all"
        detailComponent={({ row }) => <OrderHistoryTable orderID={row.id} />}
        columns={ORDER_COLUMNS}
        defaultColumnWidths={ORDER_COLUMN_WIDTHS}
        heightTable={480}
        params={params}
        setParams={(pr) => setParams({ ...params, ...pr })}
        onRefresh={() => setParams((prev: any) => ({ ...prev }))}
        shipping_isShowCreateBy={false}
        shipping_isShowFromAddress={false}
        shipping_isShowExpectedDate={false}
        shipping_isShowToAddress={false}
      />
    </Paper>
  );
};

export default OrderSkylinkTable;
