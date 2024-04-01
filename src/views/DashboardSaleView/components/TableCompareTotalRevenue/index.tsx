// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";
import axios, { CancelTokenSource } from "axios";

// Services
import { saleApi } from "_apis_/sale.api";

// Components
import DDataGrid from "components/DDataGrid";
import { CardHeader, Grid, Stack, useTheme } from "@mui/material";
import ChangeShowColumn from "components/DDataGrid/components/ChangeShowColumn";
import { RangeInput } from "@mui/lab/DateRangePicker/RangeTypes";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { SaleReportTelesaleUser } from "_types_/SaleReportType";

// Constants
import { chooseParams } from "utils/formatParamsUtil";
import { dd_MM_yyyy, yyyy_MM_dd } from "constants/time";

import { StoreDashboard } from "../../context";
import { actionType, revenueDimensions, totalRevenueColumns } from "../../constants";
import { fDate, fDateTime } from "utils/dateUtil";
import { Straight } from "@mui/icons-material";
import { fPercent } from "utils/formatNumber";
import { COMMAS_REGEX } from "constants/index";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { MExportFileButton } from "components/Buttons/MExportFileButton";
import { formatExportSaleCompareTotalRevenue } from "./utils";

interface Props {
  params?: {
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
  dimensions?: string[];
  rangeDates: {
    startDuration: RangeInput<Date>;
    endDuration: RangeInput<Date>;
  } | null;
  setRangeDates: React.Dispatch<
    React.SetStateAction<{
      startDuration: RangeInput<Date>;
      endDuration: RangeInput<Date>;
    } | null>
  >;
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

const storeTotalRevenue = (state: InitialStateReport, action: any) => {
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

const TableCompareTotalRevenue = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
    dimensions,
    rangeDates,
    setRangeDates,
  } = props;
  const [state, dispatch] = useReducer(storeTotalRevenue, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboard);
  const { totalRevenue } = store;

  const { loading, params, dataTotal, totalRow } = state;

  const theme = useTheme();

  useEffect(() => {
    setRangeDates({
      startDuration: [
        format(subDays(new Date(), 1), yyyy_MM_dd),
        format(subDays(new Date(), 1), yyyy_MM_dd),
      ],
      endDuration: [format(new Date(), yyyy_MM_dd), format(new Date(), yyyy_MM_dd)],
    });
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, [setRangeDates]);

  useEffect(() => {
    rangeDates && getDataCompare();
  }, [params, paramsAll, isRefresh, isInView, dimensions]);

  const getDataCompare = () => {
    const objParamsStart = {
      ...params,
      ...paramsAll,
      // dimension:
      //   dimensions === [] ? revenueDimensions.map((dimension) => dimension.value) : dimensions,
      dimension: "processed_date",
      assigned_from: fDate(rangeDates?.startDuration[0], yyyy_MM_dd),
      assigned_to: fDate(rangeDates?.startDuration[1], yyyy_MM_dd),
    };

    const objParamsEnd = {
      ...objParamsStart,
      assigned_from: fDate(rangeDates?.endDuration[0], yyyy_MM_dd),
      assigned_to: fDate(rangeDates?.endDuration[1], yyyy_MM_dd),
    };

    const newParamsStart = chooseParams(objParamsStart, [
      "assigned_from",
      "assigned_to",
      "dimension",
    ]);
    const newParamsEnd = chooseParams(objParamsEnd, ["assigned_from", "assigned_to", "dimension"]);

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

    const resultStart = saleApi.get<MultiResponseType<SaleReportTelesaleUser>>(
      {
        ...newParamsStart,
        cancelToken: cancelRequest.token,
      },
      `manager/pivot/`
    );

    const resultEnd = saleApi.get<MultiResponseType<SaleReportTelesaleUser>>(
      {
        ...newParamsEnd,
        cancelToken: cancelRequest.token,
      },
      `manager/pivot/`
    );

    Promise.all([resultStart, resultEnd]).then((values) => {
      const valuesStart = values[0].data?.total || {
        total_revenue: 0,
        buy_ratio: 0,
        aov: 0,
        qualified_lead: 0,
        processed_lead: 0,
        total_customer: 0,
        total_lead: 0,
        total_order: 0,
      };
      const valuesEnd = values[1].data?.total || {
        total_revenue: 0,
        buy_ratio: 0,
        aov: 0,
        qualified_lead: 0,
        processed_lead: 0,
        total_customer: 0,
        total_lead: 0,
        total_order: 0,
      };

      if (valuesStart && valuesEnd) {
        const tempTotalStart = Object.keys(valuesStart).reduce((prev, current) => {
          const changeNumber: number = valuesEnd[current] - valuesStart[current];
          const isIncrease = changeNumber >= 0;
          const posChangeNumber = changeNumber > 0 ? changeNumber : -changeNumber;
          const changePercent = changeNumber !== 0 ? posChangeNumber / valuesStart[current] : 0;
          return {
            ...prev,
            [`${current}_1`]: valuesStart[current],
            [`${current}_2`]: valuesEnd[current],
            [`${current}_change`]: {
              value: changeNumber,
              isIncrease: isIncrease,
              content: (
                <Stack
                  display="flex"
                  alignItems="center"
                  direction="row"
                  sx={{
                    color: isIncrease ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  <Straight
                    sx={{
                      ...(!isIncrease && {
                        transform: "rotate(180deg)",
                      }),
                    }}
                  />{" "}
                  <span>
                    {["aov", "total_revenue"].includes(current)
                      ? `${
                          Math.floor(posChangeNumber)?.toString().replace(COMMAS_REGEX, ",") || 0
                        }đ`
                      : current === "buy_ratio"
                      ? Math.floor(posChangeNumber * 100)
                      : Math.floor(posChangeNumber)}
                  </span>
                </Stack>
              ),
            },
            [`${current}_percent_change`]: {
              value: changePercent,
              isIncrease: isIncrease,
              content: (
                <Stack
                  display="flex"
                  alignItems="center"
                  direction="row"
                  sx={{
                    color: isIncrease ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  <Straight
                    sx={{
                      ...(!isIncrease && {
                        transform: "rotate(180deg)",
                      }),
                    }}
                  />{" "}
                  <span>{fPercent(changePercent)}</span>
                </Stack>
              ),
            },
          };
        }, {});

        dispatch({
          type: actionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: tempTotalStart,
          },
        });
      }
    });

    dispatch({
      type: actionType.UPDATE_LOADING,
      payload: {
        loading: false,
      },
    });
  };

  const handleResizeColumns = (columns: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_TABLE,
      payload: {
        tableName: "totalRevenue",
        columns,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_TABLE,
      payload: {
        tableName: "totalRevenue",
        column,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER,
      payload: {
        tableName: "totalRevenue",
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
    return totalRevenue.resultColumnsShow.map((item) => item.name);
  }, [totalRevenue.resultColumnsShow]);

  const renderHeader = () => {
    return (
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <CardHeader title={"Báo cáo kết quả doanh thu"} sx={{ p: 0 }} />
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <MExportFileButton
            exportData={[totalRow]}
            exportFileName={`Bao_cao_ket_qua_doanh_thu_${fDateTime(new Date())}`}
            formatExportFunc={(item) => formatExportSaleCompareTotalRevenue(item, totalRevenue)}
          />
          {handleChangeColumn && (
            <ChangeShowColumn
              columnsCount={totalRevenue.countShowColumn}
              columns={totalRevenue.columnsShow}
              onChangeColumn={handleChangeColumn}
            />
          )}
        </Stack>
      </Grid>
    );
  };

  useEffect(() => {
    if (rangeDates) {
      const columnsBand =
        (rangeDates &&
          totalRevenueColumns.columnsShowHeader.map((column) => ({
            title: column.title,
            children: [
              {
                columnName: `${column.name}_1`,
              },
              {
                columnName: `${column.name}_2`,
              },
              {
                columnName: `${column.name}_change`,
              },
              {
                columnName: `${column.name}_percent_change`,
              },
            ],
          }))) ||
        [];

      const columns =
        (rangeDates &&
          totalRevenueColumns.columnsShowHeader
            .map((column) => [
              {
                name: `${column.name}_1`,
                title: `${fDate(rangeDates.startDuration[0])} - ${fDate(
                  rangeDates.startDuration[1]
                )}`,
                isShow: true,
              },
              {
                name: `${column.name}_2`,
                title: `${fDate(rangeDates.endDuration[0])} - ${fDate(rangeDates.endDuration[1])}`,
                isShow: true,
              },
              {
                name: `${column.name}_change`,
                title: `Thay đổi`,
                isShow: true,
              },
              {
                name: `${column.name}_percent_change`,
                title: `% Thay đổi`,
                isShow: true,
              },
            ])
            .flatMap((arr) => arr)) ||
        [];
      const columnWidths =
        (rangeDates &&
          totalRevenueColumns.columnsShowHeader
            .map((column) => [
              {
                columnName: `${column.name}_1`,
                width: 140,
              },
              {
                columnName: `${column.name}_2`,
                width: 140,
              },
              {
                columnName: `${column.name}_change`,
                width: 140,
              },
              {
                columnName: `${column.name}_percent_change`,
                width: 140,
              },
            ])
            .flatMap((arr) => arr)) ||
        [];

      dispatchStore({
        type: actionType.CHANGE_COLUMN,
        payload: {
          tableName: "totalRevenue",
          columnsShow: columns,
          resultColumnsShow: columns,
          countShowColumn: columns.length,
          columnsWidthResize: columnWidths,
          columnsBand,
        },
      });
      getDataCompare();
    }
    // else {
    //   dispatchStore({
    //     type: actionType.CHANGE_COLUMN,
    //     payload: {
    //       tableName: "totalRevenue",
    //       columnsShow: totalRevenueColumns.columnsShowHeader,
    //       resultColumnsShow: totalRevenueColumns.columnsShowHeader,
    //       countShowColumn: totalRevenueColumns.columnsShowHeader.length,
    //       columnsWidthResize: totalRevenueColumns.columnWidths,
    //       columnsBand: [],
    //     },
    //   });
    // }
  }, [rangeDates]);

  return (
    <DDataGrid
      wrapContainerType="card"
      data={[totalRow]}
      dataTotal={dataTotal}
      page={0}
      pageSize={params.limit}
      // totalSummaryRow={totalRow}
      // summaryDataColumns={summaryColumnTotalRevenue}
      columns={totalRevenue.resultColumnsShow}
      columnWidths={totalRevenue.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={true}
      arrAttachUnitVnd={[
        "total_revenue",
        "total_revenue_1",
        "total_revenue_2",
        "aov",
        "aov_1",
        "aov_2",
      ]}
      arrAttachUnitPercent={["buy_ratio_change", "buy_ratio_1", "buy_ratio_2"]}
      contentOptional={{
        arrColumnOptional: totalRevenue.resultColumnsShow.reduce((prev: any, column) => {
          if (column.name.includes("_change") || column.name.includes("_percent_change")) {
            prev = [...prev, column.name];
          }
          return prev;
        }, []),
      }}
      arrDate={["date"]}
      arrColumnBand={totalRevenue.columnsBand}
      isHeightCustom={true}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      tableContainerProps={{
        sx: {
          px: 2,
          pb: 4,
          border: "none",
          "& .MuiTableCell-root.TableFixedCell-fixedCell": {
            left: 0,
            zIndex: 3,
          },
          "& .MuiTableCell-head.TableFixedCell-fixedCell": {
            background: "#F4F6F8",
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
export default TableCompareTotalRevenue;
