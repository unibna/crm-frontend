// Libraries
import { useState } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import reduce from "lodash/reduce";

// Types
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { ColumnTypeDefault } from "_types_/ColumnType";

// Components
import DataGrid from "components/DataGrid";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";
interface Props {
  data: any;
  columnShowDetail: ColumnShowDatagrid<any>;
  [key: string]: any;
}

const TableDetailNoneApi = (props: Props) => {
  const { columnShowDetail, data = [] } = props;
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowDetail.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowDetail.columnsShowHeader)
  );

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  return (
    <DataGrid
      isShowListToolbar={false}
      {...props}
      data={data}
      contentColumnShowInfo={{
        arrColumnShowInfo: reduce(
          columnShowDetail.columnsShowHeader,
          (prevArr, current: any) => [...prevArr, current.name],
          []
        ),
        infoCell: columnShowDetail.columnShowTable,
      }}
      columns={columnShowDetail.columnsShowHeader}
      columnWidths={columnWidths}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default TableDetailNoneApi;
