import { skycallApi } from "_apis_/skycall.api";
import { ErrorName } from "_types_/ResponseApiType";
import { SkycallType } from "_types_/SkycallType";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import { useCancelToken } from "hooks/useCancelToken";
import map from "lodash/map";
import { useCallback, useEffect, useState } from "react";
import CDPTable from "views/CDPView/components/CDPTable";
import { CALL_COLUMNS, CALL_COLUMNS_WIDTH } from "views/CDPView/constants/columns";

const CallTable = ({ phone }: { phone: string }) => {
  const [data, setData] = useState<{ data: SkycallType[]; loading: boolean; count: number }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = useState<any>({ limit: 200, page: 1, ordering: "-date_from" });
  const { newCancelToken } = useCancelToken();

  const getData = useCallback(async () => {
    if (phone) {
      setData((prev) => ({ ...prev, loading: true }));

      const { date_from, date_to } = params;
      //lấy voip từ ngày tạo lead => ngày hoàn thành lead
      const rangeDateFilter = {
        date_from: date_from ? format(new Date(date_from), yyyy_MM_dd) : undefined,
        date_to: date_to ? format(new Date(date_to), yyyy_MM_dd) : undefined,
      };
      const result = await skycallApi.get<SkycallType>({
        params: {
          search: phone,
          ...params,
          ...rangeDateFilter,
          cancelToken: newCancelToken(),
        },
        endpoint: "sky-calls/",
      });
      if (result.data) {
        const { data = [], total = 0 } = result.data;
        setData((prev) => ({ ...prev, data, loading: false, count: total }));
        return;
      }

      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }

      setData((prev) => ({ ...prev, loading: false }));
    } else {
      setData((prev) => ({ ...prev, data: [], loading: false, count: 0 }));
    }
  }, [newCancelToken, params, phone]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CDPTable
      isFullRow
      columns={CALL_COLUMNS}
      defaultColumnWidths={CALL_COLUMNS_WIDTH}
      defaultColumnOrders={map(CALL_COLUMNS, (column) => column.name)}
      data={data}
      label="Lịch sử cuộc gọi"
      setParams={setParams}
      heightTable={480}
      params={params}
    />
  );
};

export default CallTable;
