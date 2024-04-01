import { useCallback, useEffect, useState } from "react";
import { PRODUCT_COLUMNS, PRODUCT_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import CDPTable from "views/CDPView/components/CDPTable";
import { CDPProductType } from "_types_/CrmType";
import map from "lodash/map";
import { useCancelToken } from "hooks/useCancelToken";
import { customerApi } from "_apis_/customer.api";
import { ErrorName } from "_types_/ResponseApiType";

const ProductTable = ({ phone }: { phone?: string }) => {
  const [data, setData] = useState<{ data: CDPProductType[]; loading: boolean; count: number }>({
    data: [],
    count: 0,
    loading: false,
  });
  const [params, setParams] = useState({
    limit: 200,
    page: 1,
  });
  const { newCancelToken } = useCancelToken();

  const getData = useCallback(async () => {
    if (phone) {
      setData((prev) => ({ ...prev, loading: true }));

      const result = await customerApi.get<CDPProductType>({
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: `${phone}/products/`,
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
  }, [newCancelToken, params, phone]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <CDPTable
      isFullRow
      columns={PRODUCT_COLUMNS}
      defaultColumnOrders={map(PRODUCT_COLUMNS, (column) => column.name)}
      defaultColumnWidths={PRODUCT_COLUMNS_WIDTH}
      data={data}
      label="Sản phẩm"
      params={params}
      setParams={setParams}
      heightTable={480}
      containerStyle={{ height: "100%" }}
    />
  );
};

export default ProductTable;
