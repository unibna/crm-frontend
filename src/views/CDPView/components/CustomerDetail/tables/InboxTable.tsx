import { useCallback, useEffect, useState } from "react";
import { facebookApi } from "_apis_/facebook.api";
import { MessageType } from "_types_/FacebookType";
import { INBOX_COLUMNS, INBOX_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import CDPTable from "views/CDPView/components/CDPTable";
import map from "lodash/map";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";

const InboxTable = ({ phone }: { phone: string }) => {
  const [data, setData] = useState<{
    data: MessageType[];
    loading: boolean;
    count: number;
  }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = useState({ limit: 200, page: 1 });
  const { newCancelToken } = useCancelToken();

  const getData = useCallback(async () => {
    if (phone) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await facebookApi.get<MessageType>(
        {
          phone,
          ...params,
          cancelToken: newCancelToken(),
        },
        "messages/"
      );
      if (result.data) {
        setData((prev) => ({
          ...prev,
          data: result.data.results,
          loading: false,
          count: result.data.count || 0,
        }));
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
  }, [phone, params, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CDPTable
      isFullRow
      columns={INBOX_COLUMNS}
      defaultColumnOrders={map(INBOX_COLUMNS, (column) => column.name)}
      defaultColumnWidths={INBOX_COLUMNS_WIDTH}
      data={data}
      label="Lịch sử tin nhắn"
      params={params}
      setParams={setParams}
      heightTable={480}
    />
  );
};

export default InboxTable;
