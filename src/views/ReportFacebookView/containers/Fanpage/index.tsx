// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";

// Constants
import {
  actionType,
  dataRenderHeaderShare,
  arrAttachUnitVnd,
  arrAttachUnitPercent,
  summaryColumnFanpage,
  arrTakeValueParamsHeader,
} from "views/ReportFacebookView/constants";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-spend",
  },
  dataTotal: 0,
  totalRow: 0,
};

const storeFanpage = (state: InitialStateReport, action: any) => {
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

const Fanpage = () => {
  const [state, dispatch] = useReducer(storeFanpage, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { adAccount, fanpage, campaign, adset, params: paramsStore } = store;

  const { data, loading, params, dataTotal, totalRow } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        ad_account_id: adAccount.columnSelected,
        campaign_id: campaign.columnSelected,
        adset_id: adset.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "ad_account_id",
        "campaign_id",
        "adset_id",
      ]
    );

    getListFacebookFanpage(objParams);
  };

  const getListFacebookFanpage = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result: any = await facebookApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/marketing/page/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { page_id, page_name } = item;

          return {
            ...item,
            id: page_id,
            searchName: page_name,
            // isCheck: fanpage.columnSelected.length ? fanpage.columnSelected.includes(page_id) ? true : false : false
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

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_FANPAGE,
      payload: column,
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_FANPAGE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page: 1,
      },
    });

    dispatchStore({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ...params,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_FANPAGE,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const columnShowExport = useMemo(() => {
    return fanpage.resultColumnsShow.length
      ? fanpage.resultColumnsShow.reduce((prevArr: any, current: any) => {
          return [
            ...prevArr,
            {
              name: current.name,
              title: current.title,
            },
          ];
        }, [])
      : [];
  }, [fanpage.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "effective_status",
      "objective",
      ...arrTakeValueParamsHeader,
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={fanpage.countShowColumn}
        originColumns={fanpage.columnsShow}
        params={newParamsStore}
        dataExport={data}
        columnShowExport={columnShowExport}
        dataRenderHeader={dataRenderHeaderShare}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return fanpage.resultColumnsShow.map((item) => item.name);
  }, [fanpage.resultColumnsShow]);

  return (
    <DDataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={fanpage.resultColumnsShow}
      columnWidths={fanpage.columnsWidthResize}
      columnOrders={columnOrders}
      totalSummaryRow={totalRow}
      arrAttachUnitVnd={arrAttachUnitVnd}
      arrAttachUnitPercent={arrAttachUnitPercent}
      summaryDataColumns={summaryColumnFanpage}
      isLoadingTable={loading}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};
export default Fanpage;
