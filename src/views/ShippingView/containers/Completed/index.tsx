import { useEffect, useState } from "react";
import {
  ORDER_COLUMNS,
  ORDER_COLUMNS_SHOW_SORT,
  ORDER_COLUMN_WIDTHS,
} from "views/OrderView/constants/columns";
import map from "lodash/map";

import { orderApi } from "_apis_/order.api";
import OrderContainer from "views/OrderView/components/OrderContainer";

const initParams = {
  limit: 200,
  page: 1,
  // created_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  // created_to: format(new Date(), yyyy_MM_dd),
  status: ["completed"],
  ordering: "-created",
  // dateValue: -1,
  delivery_company: [-1],
};

const Completed = () => {
  const [params, setParams] = useState(initParams);
  const [isFullRow, setFullRow] = useState(false);
  const [hiddenColumnNames, setHiddenColumnNames] = useState([]);
  const [columnShowSort, setColumnShowSort] = useState(ORDER_COLUMNS_SHOW_SORT);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  const getTags = async () => {
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "tag/",
      params: { limit: 200, page: 1, is_show: true },
    });
    if (result.data) {
      setTags(result.data.results);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <OrderContainer
      isCreate={false}
      tagOptions={tags}
      showPrintOrder
      isFilterCarrierStatus
      isFilterCrossSale
      tabName="shipping"
      isFilterTag
      columns={ORDER_COLUMNS}
      defaultColumnWidths={ORDER_COLUMN_WIDTHS}
      isFullRow={isFullRow}
      setFullRow={setFullRow}
      hiddenColumnNames={hiddenColumnNames}
      setHiddenColumnNames={setHiddenColumnNames}
      defaultColumnOrders={map(ORDER_COLUMNS, (item) => item.name)}
      isFilterCreator
      isFilterTrackingCompany
      isFilterDate
      isFilterPrinted
      isSearch
      isFilterSource
      isShowPrintStatus
      params={params}
      setParams={setParams}
      columnShowSort={columnShowSort}
      setColumnShowSort={setColumnShowSort}
      directionAfterAlternatived={false}
    />
  );
};

export default Completed;
