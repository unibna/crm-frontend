import { useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { saleApi } from "_apis_/sale.api";
import { InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { SaleReportTelesaleUser } from "_types_/SaleReportType";
import { SortType } from "_types_/SortType";
import axios, { CancelTokenSource } from "axios";
import DDataGrid from "components/DDataGrid";
import ChangeShowColumn from "components/DDataGrid/components/ChangeShowColumn";
import UserAvatar from "components/Images/UserAvatar";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { useContext, useEffect, useMemo, useReducer } from "react";
import { chooseParams } from "utils/formatParamsUtil";
import {
  actionType,
  reportSellerByDateColumnExtensions,
  summaryColumnReportSellerByDate,
} from "views/SaleOnlineReportView/constants";
import { StoreSaleOnlineReport } from "views/SaleOnlineReportView/context";

interface Props {
  params?: {
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-total_lead_assigned",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeReportSellerByDate = (state: InitialStateReport, action: any) => {
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
const TableReportSellerByDate = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const [state, dispatch] = useReducer(storeReportSellerByDate, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreSaleOnlineReport);
  const { reportSellerByDate } = store;

  const { data, loading, params, dataTotal, totalRow } = state;

  const theme = useTheme();

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsAll, isRefresh, isInView]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to"]);

    if (isInView) {
      getListReportByDate(newParams);
    }
  };

  const getListReportByDate = async (params: any) => {
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
        `telesale-user/`
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = (results || []).map((item: any) => {
          return {
            ...item,
            telesale: {
              value: {
                handle_by: item.handle_by,
                image: item.image,
              },
              content: <UserAvatar avatar={item.image} name={item.handle_by} />,
            },
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: newData,
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
            totalRow: total,
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_REPORT_SELLER_BY_DATE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_REPORT_SELLER_BY_DATE,
      payload: column,
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_REPORT_SELLER_BY_DATE,
      payload: {
        columnsOrder: columns,
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
    return reportSellerByDate.resultColumnsShow.map((item) => item.name);
  }, [reportSellerByDate.resultColumnsShow]);

  const renderHeader = () => {
    return (
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <CardHeader title={"Báo cáo hoạt động của nhân viên"} sx={{ p: 0 }} />

        {handleChangeColumn && (
          <ChangeShowColumn
            columnsCount={reportSellerByDate.countShowColumn}
            columns={reportSellerByDate.columnsShow}
            onChangeColumn={handleChangeColumn}
          />
        )}
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
      summaryDataColumns={summaryColumnReportSellerByDate}
      columns={reportSellerByDate.resultColumnsShow}
      columnWidths={reportSellerByDate.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={true}
      arrAttachUnitVnd={[
        "total_revenue",
        "hot_revenue",
        "cold_revenue",
        "aov",
        "cold_data_aov",
        "hot_data_aov",
        "cold_data_revenue_per_lead",
        "hot_data_revenue_per_lead",
      ]}
      arrFormatSecondsToTimeString={["talktime", "talktime_per_tls"]}
      arrAttachUnitPercent={[
        "cold_lead_is_buy_ratio",
        "hot_lead_not_qualified_ratio",
        "hot_lead_is_buy_ratio",
        "cold_lead_not_qualified_ratio",
      ]}
      arrDate={["date"]}
      leftColumns={["telesale"]}
      isHeightCustom={data.length <= 10}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      contentOptional={{ arrColumnOptional: ["telesale"] }}
      columnExtensions={reportSellerByDateColumnExtensions}
      tableContainerProps={{
        sx: {
          px: 2,
          border: "none",
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
        verticalAlign: "top",
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
export default TableReportSellerByDate;
