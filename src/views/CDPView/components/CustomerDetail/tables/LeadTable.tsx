import { useCallback, useEffect, useState } from "react";
import { phoneLeadApi } from "_apis_/lead.api";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import { PHONE_COLUMNS, PHONE_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import CDPTable from "views/CDPView/components/CDPTable";
import map from "lodash/map";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";

const LeadTable = ({ phone }: { phone: string }) => {
  const [data, setData] = useState<{ data: PhoneLeadResType[]; loading: boolean; count: number }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = useState({
    limit: 200,
    page: 1,
    ordering: "-created",
  });
  const { newCancelToken } = useCancelToken();

  const getData = useCallback(async () => {
    if (phone) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await phoneLeadApi.get<PhoneLeadResType>({
        params: {
          search: phone,
          ...params,
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
  }, [phone, params, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CDPTable
      isFullRow
      columns={PHONE_COLUMNS}
      defaultColumnOrders={map(PHONE_COLUMNS, (column) => column.name)}
      defaultColumnWidths={PHONE_COLUMNS_WIDTH}
      data={data}
      label="Lịch sử tạo SĐT"
      params={params}
      setParams={setParams}
      heightTable={480}
    />
  );
};

export default LeadTable;
