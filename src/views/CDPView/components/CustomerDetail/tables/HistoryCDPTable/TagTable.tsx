import React, { useCallback, useEffect, useState } from "react";
import { TAG_HISTORY_COLUMNS, TAG_HISTORY_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import { customerApi } from "_apis_/customer.api";
import map from "lodash/map";
import vi from "locales/vi.json";
import CDPTable from "views/CDPView/components/CDPTable";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";

interface TagHistoryType {
  change_date_time: string;
  change_by: { id: string; email: string; name: string };
  change_operation: string;
  customer_id: string;
  old_values: string;
  new_values: string;
}

const TagTable = ({ customerID }: { customerID?: string }) => {
  const [data, setData] = useState<{ data: TagHistoryType[]; loading: boolean; count: number }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = React.useState({
    limit: 200,
    page: 1,
  });
  const { newCancelToken } = useCancelToken();

  const getData = useCallback(async () => {
    if (customerID) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await customerApi.get<TagHistoryType>({
        endpoint: `${customerID}/tags/history/`,
        params: {
          customer_id: customerID,
          cancelToken: newCancelToken(),
        },
      });

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
  }, [newCancelToken, customerID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CDPTable
      isFullRow
      columns={TAG_HISTORY_COLUMNS}
      columnOrders={map(TAG_HISTORY_COLUMNS, (column) => column.name)}
      columnWidths={TAG_HISTORY_COLUMNS_WIDTH}
      data={data}
      label={vi.customer_tag}
      params={params}
      setParams={setParams}
    />
  );
};

export default TagTable;
