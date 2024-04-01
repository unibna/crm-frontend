// Libraries
import { useState, useEffect } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";

// Types
import { ColumnShow } from "_types_/FacebookType";

// Components
import DDataGrid from "components/DDataGrid";
interface Props {
  data: any;
  columnShowDetail: ColumnShow;
  [key: string]: any;
}

const TableDetailNoneApi = (props: Props) => {
  const { columnShowDetail, data = [] } = props;
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowDetail.columnWidths
  );
  const [columnOrders, setColumnOrders] = useState<string[]>([]);

  useEffect(() => {
    const newColumnOrder = map(columnShowDetail.columnsShowHeader, (item: any) => item.name);
    setColumnOrders(newColumnOrder);
  }, []);

  return (
    <DDataGrid
      {...props}
      data={data}
      isShowListToolbar={false}
      columns={columnShowDetail.columnsShowHeader}
      columnOrders={columnOrders}
      columnWidths={columnWidths}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={setColumnOrders}
    />
  );
};

export default TableDetailNoneApi;
