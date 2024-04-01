// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import Grid from "@mui/material/Grid";
import LineChart from "components/Charts/LineChart";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { FBReportType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  dataRenderHeaderShare,
  arrAttachUnitVnd,
  arrAttachUnitPercent,
  summaryColumnAd,
  FILTER_CHART_OPTIONS,
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
  dataTotalTable: 0,
  totalRow: {},
};

const storeAd = (state: InitialStateReport, action: any) => {
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
      case actionType.UPDATE_DATA_TOTAL_TABLE: {
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

const Ad = () => {
  const [state, dispatch] = useReducer(storeAd, initState);

  const {
    data: { dataTable, dataChart },
    loading: { isLoadingTable, isLoadingChart },
    params,
    dataTotalTable,
    totalRow,
  } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { adAccount, campaign, adset, ad, params: paramsStore } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: ad.columnSelected.length
          ? ad.columnSelected.includes(item.ad_id)
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
  }, [ad.columnSelected]);

  useEffect(() => {
    const objParams = handleParamsApi(
      {
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
        "ad_name",
        "ad_account_id",
        "campaign_id",
        "adset_id",
      ]
    );

    getDataChart(objParams);
  }, [paramsStore]);

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
        "ad_name",
        "ad_account_id",
        "campaign_id",
        "adset_id",
      ]
    );

    getListFacebookAd(objParams);
  };

  const getListFacebookAd = async (params: any) => {
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
        "report/marketing/ad/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { ad_id, ad_name, attributes } = item;

          return {
            ...item,
            id: ad_id,
            searchName: ad_name,
            attributes: convertDataAttributes(attributes),
            isCheck: ad.columnSelected.length
              ? ad.columnSelected.includes(ad_id)
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
          type: actionType.UPDATE_DATA_TOTAL_TABLE,
          payload: {
            dataTotalTable: count,
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

  const convertDataAttributes = (attributes: any) => {
    if (attributes.length) {
      return attributes.map((item: any) => {
        return {
          attribute: +item.name_id,
          attributeValue: +item.value_id,
        };
      });
    }
    return [];
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

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_AD,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...ad.columnSelected];
    if (isCheck) {
      columnSelected.push(row.ad_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.ad_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD,
      payload: {
        columnSelected,
      },
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_AD,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.ad_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD,
      payload: {
        columnSelected,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_AD,
      payload: column,
    });
  };

  const columnShowExport = useMemo(() => {
    return ad.resultColumnsShow.length
      ? ad.resultColumnsShow.reduce((prevArr: any, current: any) => {
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
  }, [ad.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "effective_status",
      "objective",
      "ad_name",
      ...arrTakeValueParamsHeader,
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={ad.countShowColumn}
        originColumns={ad.columnsShow}
        searchInput={[
          {
            keySearch: "ad_name",
            label: "Nhập tên quảng cáo",
          },
        ]}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        params={newParamsStore}
        columnSelected={ad.columnSelected}
        dataRenderHeader={dataRenderHeaderShare}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return ad.resultColumnsShow.map((item) => item.name);
  }, [ad.resultColumnsShow]);

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
          dataTotal={dataTotalTable}
          page={params.page}
          pageSize={params.limit}
          columns={ad.resultColumnsShow}
          columnWidths={ad.columnsWidthResize}
          columnOrders={columnOrders}
          totalSummaryRow={totalRow}
          arrAttachUnitVnd={arrAttachUnitVnd}
          arrAttachUnitPercent={arrAttachUnitPercent}
          isLoadingTable={isLoadingTable}
          isCheckAll={dataTable.length && dataTable.length === ad.columnSelected.length}
          summaryDataColumns={summaryColumnAd}
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
export default Ad;
