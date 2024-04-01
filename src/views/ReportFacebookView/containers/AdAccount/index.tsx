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
import LineChart from "components/Charts/LineChart";
import Grid from "@mui/material/Grid";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { FBReportType } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";

// Constants
import {
  actionType,
  dataRenderHeaderShare,
  FILTER_CHART_OPTIONS,
  summaryColumnAdAccount,
  arrTakeValueParamsHeader,
} from "views/ReportFacebookView/constants";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";

const initState: InitialStateReport = {
  data: {
    dataTable: [],
    dataChart: [],
  },
  loading: {
    isLoadingTable: false,
    isLoadingChart: false,
  },
  params: {
    page: 1,
    limit: 200,
    ordering: "-spend",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeAdAccount = (state: InitialStateReport, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          data: {
            ...state.data,
            ...payload,
          },
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
          loading: {
            ...state.loading,
            ...payload,
          },
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

const AdAccount = () => {
  const [state, dispatch] = useReducer(storeAdAccount, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { adAccount, params: paramsStore } = store;
  const {
    data: { dataTable, dataChart },
    loading: { isLoadingTable, isLoadingChart },
    params,
    dataTotal,
    totalRow,
  } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const objParams = handleParamsApi(paramsStore, [
      "date_from",
      "date_to",
      "effective_status",
      "objective",
    ]);

    getDataChart(objParams);
  }, [paramsStore]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: adAccount.columnSelected.length
          ? adAccount.columnSelected.includes(item.ad_account_id)
            ? true
            : false
          : false,
      };
    });

    dispatch({
      type: actionType.UPDATE_DATA,
      payload: {
        dataTable: newData,
      },
    });
  }, [adAccount.columnSelected]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
      },
      ["date_from", "date_to", "effective_status", "objective"]
    );

    getListFacebookAdAccount(objParams);
  };

  const getListFacebookAdAccount = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          isLoadingTable: true,
        },
      });

      const result: any = await facebookApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/marketing/ad-account/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            id: item.ad_account_id,
            searchName: item.ad_account_name,
            isCheck: adAccount.columnSelected.length
              ? adAccount.columnSelected.includes(item.ad_account_id)
                ? true
                : false
              : false,
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            dataTable: newData,
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
          isLoadingTable: false,
        },
      });
    }
  };

  const getDataChart = async (params: any) => {
    dispatch({
      type: actionType.UPDATE_LOADING,
      payload: {
        isLoadingChart: true,
      },
    });

    const result = await facebookApi.get<FBReportType>(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "report/marketing/chart-by-date/"
    );

    if (result.data) {
      const { results = [] } = result.data;

      dispatch({
        type: actionType.UPDATE_DATA,
        payload: {
          dataChart: results,
        },
      });
    }

    dispatch({
      type: actionType.UPDATE_LOADING,
      payload: {
        isLoadingChart: false,
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

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_AD_ACCOUNT,
      payload: column,
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

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...adAccount.columnSelected];
    if (isCheck) {
      columnSelected.push(row.ad_account_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.ad_account_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD_ACCOUNT,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.ad_account_id);
    }
    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD_ACCOUNT,
      payload: {
        columnSelected,
      },
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_AD_ACCOUNT,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_AD_ACCOUNT,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const columnOrders = useMemo(() => {
    return adAccount.resultColumnsShow.map((item) => item.name);
  }, [adAccount.resultColumnsShow]);

  const columnShowExport = useMemo(() => {
    return adAccount.resultColumnsShow.length
      ? adAccount.resultColumnsShow.reduce((prevArr: any, current: any) => {
          return !["isCheck"].includes(current.name)
            ? [
                ...prevArr,
                {
                  name: current.name,
                  title: current.title,
                },
              ]
            : prevArr;
        }, [])
      : [];
  }, [adAccount.resultColumnsShow]);

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
        columnsCount={adAccount.countShowColumn}
        originColumns={adAccount.columnsShow}
        onChangeColumn={handleChangeColumn}
        params={newParamsStore}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        dataRenderHeader={dataRenderHeaderShare}
        handleFilter={handleFilter}
        handleRefresh={loadDataTable}
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <LineChart
          title="Báo cáo theo ngày"
          data={dataChart}
          isLoading={isLoadingChart}
          optionsFilter={FILTER_CHART_OPTIONS}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <DDataGrid
          data={dataTable}
          dataTotal={dataTotal}
          page={params.page}
          pageSize={params.limit}
          columns={adAccount.resultColumnsShow}
          columnWidths={adAccount.columnsWidthResize}
          totalSummaryRow={totalRow}
          summaryDataColumns={summaryColumnAdAccount}
          columnOrders={columnOrders}
          isLoadingTable={isLoadingTable}
          isCheckAll={dataTable.length && dataTable.length === adAccount.columnSelected.length}
          renderHeader={renderHeader}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          handleCheckColumn={handleCheckColumn}
          handleCheckedAll={handleCheckedAll}
          handleSorting={handleChangeSorting}
          setColumnWidths={handleResizeColumns}
          handleChangeColumnOrder={handleChangeColumnOrder}
        />
      </Grid>
    </Grid>
  );
};
export default AdAccount;
