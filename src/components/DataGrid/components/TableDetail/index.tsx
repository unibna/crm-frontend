// Libraries
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { alpha, useTheme } from "@mui/material";
import isEqual from "lodash/isEqual";
import map from "lodash/map";
import { memo, useEffect, useState } from "react";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Components
import DataGrid, { PropsDataGrid } from "components/DataGrid";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";

interface Props extends PropsDataGrid {
  columnShowDetail: ColumnShowDatagrid<any>;
  params: Partial<any>;
  host: any;
  endpoint: string;
  handleDataApi?: (item: Partial<any>, data?: any[]) => any;
  handleFilterDataApi?: (list: any[]) => any;
  handleAsyncFormatData?: (list: any[]) => Promise<any>;
  hidePaging?: boolean;
  dataRow?: any;
  handleCheckColumn?: any;
}

const TableDetail = (props: Props) => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const {
    dataRow,
    params: paramsProps = {},
    host,
    endpoint,
    handleDataApi = () => {},
    handleFilterDataApi,
    handleAsyncFormatData,
    columnShowDetail,
    handleCheckColumn,
    hidePaging,
  } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [params, setParams] = useState({ limit: 200, page: 1, ...paramsProps });
  const [dataTotal, setDataTotal] = useState(0);
  const [totalRow, setTotalRow] = useState<any>({});
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowDetail.columnWidths
  );
  const [columnSelected, setColumnSelected] = useState<any>([]);
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowDetail.columnsShowHeader)
  );

  useEffect(() => {
    return () => {
      handleCheckColumn && handleCheckColumn([], dataRow);
    };
  }, []);

  useEffect(() => {
    getListDataDetail(params);
  }, [params]);

  useDidUpdateEffect(() => {
    const newData = map(data, (item: any) => {
      return {
        ...item,
        isCheck: columnSelected.includes(item?.id),
      };
    });

    setData(newData);
    handleCheckColumn && handleCheckColumn(columnSelected, dataRow);
  }, [columnSelected]);

  const getListDataDetail = async (params: any) => {
    setLoading(true);
    const result = await host.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      endpoint
    );
    if (result && result.data) {
      const { results = [], count, total = {} } = result.data;
      let newData = handleFilterDataApi ? handleFilterDataApi(results) : results;
      let asyncData = handleAsyncFormatData ? await handleAsyncFormatData(results) : newData;
      newData = map(asyncData, (item: any) => {
        return {
          ...item,
          isCheck: columnSelected.includes(item?.id),
          ...handleDataApi(item),
        };
      });

      setData(newData);
      setDataTotal(count);
      setTotalRow(total);
    }
    setLoading(false);
  };

  const handleChangePage = (page: number) => {
    setParams((params: any) => {
      return { ...params, page };
    });
  };

  const handleChangeRowsPerPage = (rowInPage: number) => {
    setParams((params: any) => {
      return { ...params, page: 1, limit: rowInPage };
    });
  };

  const handleChangeSorting = (value: any) => {
    const ordering = value[0].sort === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams((params: any) => {
      return { ...params, ordering };
    });
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  return (
    <DataGrid
      isShowListToolbar={false}
      isHeightCustom
      {...props}
      isTableDetail
      data={data}
      dataTotal={dataTotal}
      page={hidePaging ? undefined : params.page}
      pageSize={params.limit}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      totalSummaryRow={totalRow}
      isLoadingTable={isLoading}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
      handleCheckColumn={setColumnSelected}
      headerCellStyle={{
        backgroundColor: `${alpha(
          theme.palette.primary.main,
          theme.palette.action.activatedOpacity
        )}!important`,
        zIndex: 0,
        whiteSpace: "normal",
        padding: "3px 10px",
        height: 60,
        color: theme.palette.text.primary,
      }}
      tableContainerProps={{
        sx: {
          padding: 0,
          border: "none",
        },
      }}
    />
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (!isEqual(prevProps.columnShowDetail, nextProps.columnShowDetail)) {
    return false;
  }

  return true;
};

export default memo(TableDetail, areEqual);
