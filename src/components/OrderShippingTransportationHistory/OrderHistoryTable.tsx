import { useCallback, useEffect, useState } from "react";
import useIsMountedRef from "hooks/useIsMountedRef";
import { OrderType } from "_types_/OrderType";
import { orderApi } from "_apis_/order.api";
import map from "lodash/map";
import { fDateTime } from "utils/dateUtil";
import WrapPage from "layouts/WrapPage";
import OrderTable from "views/OrderView/components/OrderTable";
import {
  ORDER_HISTORY_COLUMN,
  ORDER_HISTORY_COLUMN_WIDTH,
} from "views/OrderView/constants/columns";

const OrderHistoryTable = ({
  orderID,
  isDetail = true,
}: {
  orderID: string;
  isDetail?: boolean;
}) => {
  const [data, setData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataTotal, setDataTotal] = useState(0);
  const isMountedRef = useIsMountedRef();
  const [params, setParams] = useState<any>({ limit: 50, page: 1, ordering: "-history_date" });

  const getData = useCallback(async () => {
    setLoading(true);
    const result = await orderApi.get<OrderType>({
      params: { ...params, order_id: orderID },
      endpoint: "history/",
    });
    if (result.data && isMountedRef.current) {
      const newData = map(result.data.results || [], (item) => ({
        ...item,
        history_modified_by: item?.modified_by?.name || "",
        history_modified: fDateTime(item.history_date),
      }));
      setData(newData || []);
      setDataTotal(result.data.count || 0);
    }
    setLoading(false);
  }, [isMountedRef, params, orderID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <OrderTable
        data={{ data, loading, count: dataTotal }}
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
