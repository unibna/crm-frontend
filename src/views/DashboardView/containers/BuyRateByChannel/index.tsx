// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

import { useNavigate } from "react-router-dom";

// Services
import { phoneLeadApi } from "_apis_/lead.api";

// Context
import { StoreDashboard } from "views/DashboardView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DDataGrid from "components/DDataGrid";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";

// Constants
import { actionType, summaryColumnBuyRateByChannel } from "views/DashboardView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { PATH_DASHBOARD, PHONE_LEAD_PATH, ROOT } from "routes/paths";
import { ROLE_TAB } from "constants/rolesTab";
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
    limit: 500,
    ordering: "-total",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeBuyRateByChannel = (state: InitialStateReport, action: any) => {
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

const BuyRateByChannel = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const { newCancelToken } = useCancelToken();
  const [state, dispatch] = useReducer(storeBuyRateByChannel, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboard);
  const { buyRateByChannel } = store;
  const navigate = useNavigate();

  const { data, loading, params, dataTotal, totalRow } = state;

  useEffect(() => {
    if (isInView) {
      loadDataTable();
    }
  }, [params, paramsAll, isRefresh, isInView]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      handler_assigned_from: paramsAll.date_from,
      handler_assigned_to: paramsAll.date_to,
      dimension: "channel",
    };

    const newParams = chooseParams(objParams, [
      "handler_assigned_from",
      "handler_assigned_to",
      "dimension",
    ]);

    getListBuyRateByChannel(newParams);
  };

  const getListBuyRateByChannel = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result: any = await phoneLeadApi.getReport({
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
      });

      if (result && result.data) {
        const { data = [], count, total: totalAll = {} } = result;
        const newData = data.length
          ? data.map((item: any) => {
              const { post_qualified, buy } = item;

              return {
                ...item,
                buy_rate: buy / post_qualified,
              };
            })
          : [];

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

        if (totalAll) {
          dispatch({
            type: actionType.UPDATE_TOTAL_ROW,
            payload: {
              totalRow: {
                ...totalAll,
                buy_rate: totalAll.buy / totalAll.post_qualified,
              },
            },
          });
        }
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
      type: actionType.RESIZE_BUY_RATE_BY_CHANNEL,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_BUY_RATE_BY_CHANNEL,
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
    navigate(`/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][ROOT]}`);
  };

  const columnOrders = useMemo(() => {
    return buyRateByChannel.resultColumnsShow.map((item) => item.name);
  }, [buyRateByChannel.resultColumnsShow]);

  return (
    <DDataGrid
      wrapContainerType="card"
      data={data}
      dataTotal={dataTotal}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnBuyRateByChannel}
      columns={buyRateByChannel.resultColumnsShow}
      columnWidths={buyRateByChannel.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={false}
      styleHeaderTable={{ justifyContent: "space-between" }}
      isFullTable
      titleHeaderTable="Tỉ lệ chốt theo kênh bán hàng"
      arrValueNoneFormat={["post_qualified", "buy"]}
      arrAttachUnitPercent={["buy_rate"]}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      handleWatchDetail={handleWatchDetail}
    />
  );
};
export default BuyRateByChannel;
