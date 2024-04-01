// Libraries
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import isEqual from "lodash/isEqual";
import map from "lodash/map";
import { memo, useEffect, useState } from "react";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Components
import DDataGrid from "components/DDataGrid";

// Types
import { alpha, useTheme } from "@mui/material";
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
interface Props {
  columnShowDetail: any;
  params: any;
  host: any;
  endpoint: string;
  handleDataApi?: any;
  handleFilterDataApi?: any;
  [key: string]: any;
  hidePaging?: boolean;
  dataRow?: any;
}

const TableDetail = (props: Props) => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const {
    dataRow,
    params: paramsProps = {},
    host,
    endpoint = "",
    handleDataApi = () => {},
    handleFilterDataApi,
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
  const [columnOrders, setColumnOrders] = useState<string[]>([]);
  const [columnSelected, setColumnSelected] = useState<any>([]);
  const [columnsShowHeader, setColumnsShowHeader] = useState(
    columnShowDetail.columnsShowHeader.filter(
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    )
  );

  useEffect(() => {
    const newColumnOrder = map(columnsShowHeader, (item: any) => item.name);
    setColumnOrders(newColumnOrder);

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

      const newDataFilter = handleFilterDataApi ? handleFilterDataApi(results) : results;

      const newData = map(newDataFilter, (item: any) => {
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

  const handleCheckColumnDetail = (isCheck: boolean, row: any) => {
    let newColumnSelected: any = [...columnSelected];
    if (isCheck) {
      newColumnSelected.push(row?.id);
    } else {
      newColumnSelected = columnSelected.filter((item: string) => item !== row.id);
    }

    setColumnSelected(newColumnSelected);
  };

  const handleCheckedAllDetail = (isCheck: boolean) => {
    let newColumnSelected = [];
    if (isCheck) {
      newColumnSelected = map(data, (item: any) => item.id);
    }

    setColumnSelected(newColumnSelected);
  };

  return (
    <DDataGrid
      isShowListToolbar={false}
      isHeightCustom
      {...props}
      isTableDetail
      isCheckAll={data.length && data.length === columnSelected.length}
      data={data}
      dataTotal={dataTotal}
      page={hidePaging ? undefined : params.page}
      pageSize={params.limit}
      columns={columnsShowHeader}
      columnOrders={columnOrders}
      columnWidths={columnWidths}
      totalSummaryRow={totalRow}
      isLoadingTable={isLoading}
      contentSortOptional={{
        ...props.contentSortOptional,
        handleSort: (valueSort) => setParams({ ...params, ordering: valueSort }),
      }}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={setColumnOrders}
      handleCheckColumn={handleCheckColumnDetail}
      handleCheckedAll={handleCheckedAllDetail}
      headerStyle={{
        th: {
          backgroundColor: `${alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          )}!important`,
          zIndex: 0,
          whiteSpace: "normal",
          padding: "3px 10px",
          height: 60,
          color: "text.primary",
          verticalAlign: "middle",
        },
      }}
    />
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (!isEqual(prevProps.columnSelected, nextProps.columnSelected)) {
    return false;
  }

  return true;
};

export default memo(TableDetail, areEqual);
