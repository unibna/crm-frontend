//hooks
import React, { useEffect, useState } from "react";
import useIsMountedRef from "hooks/useIsMountedRef";

//components
import WrapPage from "layouts/WrapPage";
import OrderTable from "./OrderTable";

//types
import { OrderType } from "_types_/OrderType";

//apis
import { orderApi } from "_apis_/order.api";

//utils
import { ORDER_HISTORY_COLUMN, ORDER_HISTORY_COLUMN_WIDTH } from "../constants/columns";
import map from "lodash/map";
import { fDateTime } from "utils/dateUtil";

const OrderHistoryTable = ({
  orderID,
  isDetail = true,
}: {
  orderID: string;
  isDetail?: boolean;
}) => {
  const [data, setData] = useState<{ orders: OrderType[]; total: number; loading: boolean }>({
    orders: [],
    loading: false,
    total: 0,
  });
  const isMountedRef = useIsMountedRef();
  const [params, setParams] = useState<any>({ limit: 50, page: 1, ordering: "-history_date" });

  const getData = React.useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<OrderType>({
      params: { ...params, order_id: orderID },
      endpoint: "history/",
    });
    if (result?.data && isMountedRef.current) {
      const newData = map(result?.data?.results || [], (item) => ({
        ...item,
        history_modified_by: item?.modified_by?.name || "",
        history_modified: fDateTime(item.history_date),
      }));
      setData((prev) => ({
        ...prev,
        orders: newData,
        total: result.data.count || 0,
        loading: false,
      }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [isMountedRef, params, orderID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <OrderTable
        data={{ data: data.orders, loading: data.loading, count: data.total }}
        columns={ORDER_HISTORY_COLUMN}
        defaultColumnWidths={ORDER_HISTORY_COLUMN_WIDTH}
        hiddenPagination
        isFullRow={true}
        heightTable={"auto"}
        headerStyle={isDetail ? { zIndex: 0 } : undefined}
        params={params}
        setParams={setParams}
        cellStyle={{ height: 60 }}
      />
    </WrapPage>
  );
};

export default OrderHistoryTable;
