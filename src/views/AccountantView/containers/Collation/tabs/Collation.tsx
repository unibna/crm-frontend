import { orderApi } from "_apis_/order.api";
import { CollationType } from "_types_/CollationType";
import { OrderPaymentTypeV2 } from "_types_/OrderType";
import WrapPage from "layouts/WrapPage";
import map from "lodash/map";
import filter from "lodash/filter";
import omit from "lodash/omit";
import { useCallback, useEffect, useState } from "react";
import { fDateTime } from "utils/dateUtil";
import {
  COLLATION_PAYMENT_COLUMNS,
  COLLATION_SORT_FIELDS,
} from "views/AccountantView/constants/columns";
import { formatExportCollationFunc } from "views/AccountantView/constants/utils";
import { PaymentDetailTable } from "views/OrderView/components/PaymentDetailPopup";
import CollationHeader from "../components/CollationHeader";
import { DGridDataType } from "_types_/DGridType";

const Collation = () => {
  const [params, setParams] = useState<any>({ limit: 30, page: 1, ordering: "-upload_at" });
  const [hiddenColumnNames, setHiddenColumnNames] = useState<string[]>([]);
  const [isFullRow, setFullRow] = useState(false);
  const [data, setData] = useState<DGridDataType<OrderPaymentTypeV2>>({
    data: [],
    count: 0,
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<CollationType>({ endpoint: "payment/files/", params });
    if (result?.data) {
      const { count = 0, results } = result.data;
      const formatData: OrderPaymentTypeV2[] = map(results, (item) => ({
        ...omit(item, "payment"),
        ...item.payment,
      }));
      setData((prev) => ({ loading: false, data: formatData, count }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params]);

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = filter(
    COLLATION_PAYMENT_COLUMNS.columnsShowHeader,
    (item) => !hiddenColumnNames.includes(item.name)
  );
  const columnWidths = filter(
    COLLATION_PAYMENT_COLUMNS.columnWidths,
    (item) => !hiddenColumnNames.includes(item.columnName)
  );

  return (
    <WrapPage>
      <CollationHeader
        isImportFile
        setParams={(payload) => setParams({ ...payload, page: 1 })}
        params={params}
        columns={COLLATION_PAYMENT_COLUMNS.columnsShowHeader}
        setHiddenColumnNames={setHiddenColumnNames}
        hiddenColumnNames={hiddenColumnNames}
        setFullRow={setFullRow}
        isFullRow={isFullRow}
        onRefresh={getData}
        exportData={data.data}
        exportFileName={`Doi_soat_ke_toan_${fDateTime(new Date())}`}
        formatExportFunc={formatExportCollationFunc}
        sortFields={COLLATION_SORT_FIELDS}
      />
      <PaymentDetailTable
        payments={data.data}
        columns={columns}
        columnWidths={columnWidths}
        isEdit={false}
        isLoadingTable={data.loading}
        page={params.page}
        params={params}
        pageSize={params.limit}
        dataTotal={data.count}
        handleChangePage={(page) => setParams((prev: any) => ({ ...prev, page }))}
        handleChangeRowsPerPage={(limit) => setParams((prev: any) => ({ ...prev, limit }))}
        isFullTable={isFullRow}
      />
    </WrapPage>
  );
};

export default Collation;
