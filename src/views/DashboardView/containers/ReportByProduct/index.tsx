// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Context
import { StoreDashboard } from "views/DashboardView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DDataGrid from "components/DDataGrid";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";

// Constants
import { actionType, summaryColumnReportByProduct } from "views/DashboardView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { PATH_DASHBOARD } from "routes/paths";
import { ROLE_TAB, STATUS_ROLE_REPORT_REVENUE } from "constants/rolesTab";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

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
    limit: 10,
    ordering: "-total",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeReportByProduct = (state: InitialStateReport, action: any) => {
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

const ReportByProduct = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const [state, dispatch] = useReducer(storeReportByProduct, initState);
  const { newCancelToken } = useCancelToken();
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboard);
  const { reportByProduct } = store;

  const { data, loading, params, dataTotal, totalRow } = state;

  useEffect(() => {
    if (isInView) {
      loadDataTable();
    }
  }, [params, paramsAll, isRefresh, isInView]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
      dimension: "product",
      completed_time_from: paramsAll.date_from,
      completed_time_to: paramsAll.date_to,
    };

    const newParams = chooseParams(objParams, [
      "completed_time_from",
      "completed_time_to",
      "dimension",
    ]);

    getListReportByProduct(newParams);
  };

  const getListReportByProduct = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result = await orderApi.get({
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: `report/revenue/`,
      });

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            thumb_img: {
              id: "",
              url: item?.variant_image,
              body: "",
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
      type: actionType.RESIZE_REVENUE_BY_PRODUCT,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_REVENUE_BY_PRODUCT,
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

  const handleWatchDetail = () => {
    window.open(
      `${window.location.origin}/${
        PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]
      }`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const columnOrders = useMemo(() => {
    return reportByProduct.resultColumnsShow.map((item) => item.name);
  }, [reportByProduct.resultColumnsShow]);

  return (
    <DDataGrid
      wrapContainerType="card"
      isFullTable
      data={data}
      dataTotal={dataTotal}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnReportByProduct}
      columns={reportByProduct.resultColumnsShow}
      columnWidths={reportByProduct.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={false}
      styleHeaderTable={{ justifyContent: "space-between" }}
      titleHeaderTable="Doanh thu theo sản phẩm"
      setColumnWidths={handleResizeColumns}
      arrColumnThumbImg={["thumb_img"]}
      arrAttachUnitVnd={["total", "variant_total"]}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      handleWatchDetail={handleWatchDetail}
    />
  );
};
export default ReportByProduct;
