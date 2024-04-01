// Libraries
import { useEffect, useReducer, useContext, useMemo, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { Grouping } from "@devexpress/dx-react-grid";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

// Services
import { saleApi } from "_apis_/sale.api";

// Components
import DDataGrid from "components/DDataGrid";
import { Autocomplete, CardHeader, Grid, Stack, TextField, useTheme } from "@mui/material";
import ChangeShowColumn from "components/DDataGrid/components/ChangeShowColumn";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { SaleReportTelesaleUser } from "_types_/SaleReportType";

// Constants
import { chooseParams } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { StoreDashboard } from "../../context";
import { actionType, revenueDimensions, summaryColumnTotalReport } from "../../constants";
import { MultiSelect } from "components/Selectors";
import { MExportFileButton } from "components/Buttons";
import { fDateTime } from "utils/dateUtil";
import { formatExportSaleTotal } from "./untils";

interface Props {
  params?: {
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
  dimensions?: string[];
}

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeTotalReport = (state: InitialStateReport, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_DATA_TOTAL: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_LOADING: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_PARAMS: {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }
      case actionType.UPDATE_TOTAL_ROW: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

let cancelRequest: CancelTokenSource;

const TableTotalReport = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
    // dimensions,
    // rangeDates,
  } = props;

  const theme = useTheme();
  const [state, dispatch] = useReducer(storeTotalReport, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboard);
  const { totalReport } = store;
  const { data, loading, params, dataTotal, totalRow } = state;

  const [groupingColumns, setGroupingColumns] = useState<Grouping[]>([]);
  const [dimensions, setDimensions] = useState<{ value: string; label: string }[]>([]);
  const [groupingStateColumnExtensions] = useState([
    ...totalReport.resultColumnsShow
      .filter((column) => !revenueDimensions.find((dimension) => dimension.value === column.name))
      .map((column) => ({ columnName: column.name, groupingEnabled: false })),
  ]);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsAll, isRefresh, isInView, dimensions]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
      dimension:
        dimensions.length === 0 || dimensions.some((item) => item.value === "all")
          ? revenueDimensions.slice(1).map((dimension) => dimension.value)
          : dimensions.map((dimension) => dimension.value),
      assigned_from: paramsAll.date_from,
      assigned_to: paramsAll.date_to,
    };

    const newParams = chooseParams(objParams, ["assigned_from", "assigned_to", "dimension"]);

    if (isInView) {
      getData(newParams);
    }
  };

  const getData = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      if (cancelRequest) {
        cancelRequest.cancel();
      }

      cancelRequest = axios.CancelToken.source();

      const result = await saleApi.get<MultiResponseType<SaleReportTelesaleUser>>(
        {
          ...params,
          cancelToken: cancelRequest.token,
        },
        `manager/pivot/`
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: results,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });

        dispatch({
          type: actionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: total
              ? total
              : {
                  total_revenue: 0,
                  buy_ratio: 0,
                  aov: 0,
                  qualified_lead: 0,
                  processed_lead: 0,
                  total_customer: 0,
                  total_lead: 0,
                  total_order: 0,
                },
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
      // setGroupingColumns(
      //   dimensions.map((dimension) => ({
      //     columnName: dimension.value,
      //   }))
      // );
    }
  };

  const handleResizeColumns = (columns: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_TABLE,
      payload: {
        tableName: "totalReport",
        columns,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_TABLE,
      payload: {
        tableName: "totalReport",
        column,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER,
      payload: {
        tableName: "totalReport",
        columns,
      },
    });
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        limit: rowPage,
        page: 1,
      },
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const columnOrders = useMemo(() => {
    return totalReport.resultColumnsShow.map((item) => item.name);
  }, [totalReport.resultColumnsShow]);

  const revenueDimensionsValues = useMemo(() => {
    return revenueDimensions.map((dimension) => dimension.value);
  }, [revenueDimensions]);

  const renderHeader = () => {
    return (
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <CardHeader title={"Báo cáo chung"} sx={{ p: 0, textOverflow: "" }} />
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <MultiSelect
            size="small"
            options={revenueDimensions}
            label={"dimension"}
            title={"Báo cáo theo"}
            style={{ maxWidth: 200 }}
            outlined
            defaultValue={
              dimensions.length === 0 || dimensions.length === revenueDimensions.slice(1).length
                ? "all"
                : dimensions.map((item) => item.value)
            }
            onChange={(values: any) => {
              // const newGroupingColumns = newValues.map((val) => ({ columnName: val.value }));
              // setGroupingColumns(newGroupingColumns);

              const newValues =
                values === "all"
                  ? revenueDimensions.slice(1)
                  : revenueDimensions.filter((item) => values.includes(item.value));
              setDimensions(newValues);
            }}
            selectorId="dimensionSelector"
          />
          <MExportFileButton
            exportData={data}
            exportFileName={`Bao_cao_tong_sale_${fDateTime(new Date())}`}
            formatExportFunc={formatExportSaleTotal}
          />
          {handleChangeColumn && (
            <ChangeShowColumn
              columnsCount={
                totalReport?.resultColumnsShow.filter(
                  (column) =>
                    !revenueDimensionsValues.includes(column.name) ||
                    (revenueDimensionsValues.includes(column.name) &&
                      (dimensions || []).find((dimension) => dimension.value === column.name))
                ).length
              }
              columns={totalReport?.resultColumnsShow.filter(
                (column) =>
                  !revenueDimensionsValues.includes(column.name) ||
                  (revenueDimensionsValues.includes(column.name) &&
                    (dimensions || []).find((dimension) => dimension.value === column.name))
              )}
              onChangeColumn={handleChangeColumn}
            />
          )}
        </Stack>
      </Grid>
    );
  };

  return (
    <DDataGrid
      wrapContainerType="card"
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnTotalReport}
      columns={
        dimensions.length === 0
          ? totalReport?.resultColumnsShow
          : totalReport?.resultColumnsShow.filter(
              (column) =>
                !revenueDimensionsValues.includes(column.name) ||
                (revenueDimensionsValues.includes(column.name) &&
                  (dimensions || []).find((dimension) => dimension.value === column.name))
            )
      }
      columnWidths={totalReport.columnsWidthResize}
      columnOrders={columnOrders}
      columnGroupingExtensions={groupingStateColumnExtensions}
      isLoadingTable={loading}
      isShowListToolbar={true}
      arrAttachUnitVnd={["total_revenue", "aov"]}
      arrAttachUnitPercent={["buy_ratio"]}
      arrDate={["assigned_date", "processed_date", "created_date"]}
      arrColumnBand={totalReport.columnsBand}
      // arrColumnGrouping={groupingColumns}
      leftColumns={dimensions.map((dimension) => dimension.value)}
      isHeightCustom={data.length < 10}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      handleChangeGrouping={setGroupingColumns}
      showGroupingControls
      tableContainerProps={{
        sx: {
          px: 2,
          pb: 4,
          border: "none",
          "& .MuiTableHead-root": {
            zIndex: "600!important",
          },
          "& .MuiTableCell-root.TableFixedCell-fixedCell": {
            left: 0,
            zIndex: 3,
          },
          "& .MuiTableCell-head.TableFixedCell-fixedCell": {
            background: theme.palette.mode === "light" ? "#F4F6F8" : "#919eab29",
          },
        },
      }}
      headerCellStyle={{
        padding: "14px 0 14px 14px",
        verticalAlign: "center",
        "& .Title-title": {
          display: "-webkit-box",
          maxWidth: "200px",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        },
      }}
    />
  );
};
export default TableTotalReport;
