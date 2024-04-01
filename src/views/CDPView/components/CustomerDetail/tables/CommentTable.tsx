import { facebookApi } from "_apis_/facebook.api";
import { CommentType } from "_types_/FacebookType";
import { COMMENT_COLUMNS, COMMENT_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import CDPTable from "views/CDPView/components/CDPTable";
import map from "lodash/map";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useEffect, useState } from "react";
import { ErrorName } from "_types_/ResponseApiType";

const CommentTable = ({ phone }: { phone: string }) => {
  const [data, setData] = useState<{
    data: CommentType[];
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

      const result = await facebookApi.get<CommentType>(
        {
          phone,
          ...params,
          cancelToken: newCancelToken(),
        },
        "comments/"
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
  }, [newCancelToken, params, phone]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CDPTable
      isFullRow
      columns={COMMENT_COLUMNS}
      defaultColumnOrders={map(COMMENT_COLUMNS, (column) => column.name)}
      defaultColumnWidths={COMMENT_COLUMNS_WIDTH}
      data={data}
      label="Lịch sử Comment"
      params={params}
      setParams={setParams}
      heightTable={480}
    />
  );
};

export default CommentTable;
