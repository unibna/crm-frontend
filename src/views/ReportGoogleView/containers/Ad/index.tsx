// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { googleInfo } from "_apis_/google.api";

// Context
import { StoreReportGoogle } from "views/ReportGoogleView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import Grid from "@mui/material/Grid";
import LineChart from "components/Charts/LineChart";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { FBReportType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  summaryColumnAd,
  dataRenderHeaderShare,
  keyFilter,
  FILTER_CHART_OPTIONS,
  headerFilterObjecttiveAd,
  arrRenderFilterDateDefault,
} from "views/ReportGoogleView/constants";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";

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
    ordering: "",
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
  const { newCancelToken } = useCancelToken();
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportGoogle);
  const { customer, campaign, adGroup, ad, params: paramsStore } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, ad.dataFilter]);

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
    const objParams = chooseParams(
      {
        ...paramsStore,
        ...ad.dataFilter,
        customer_id: customer.columnSelected,
        campaign_id: campaign.columnSelected,
        ad_group_id: adGroup.columnSelected,
        limit: 1000,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "ad_name",
        "customer_id",
        "campaign_id",
        "ad_group_id",
      ]
    );

    getDataChart(objParams);
  }, [paramsStore]);

  const loadDataTable = () => {
    const objParams = chooseParams(
      {
        ...params,
        ...paramsStore,
        ...ad.dataFilter,
        customer_id: customer.columnSelected,
        campaign_id: campaign.columnSelected,
        ad_group_id: adGroup.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "ad_name",
        "customer_id",
        "campaign_id",
        "ad_group_id",
      ]
    );

    getListGoogleAd(objParams);
  };

  const convertCost = (cost: number) => {
    if (cost) {
      const newCost = Math.round(cost);
      return newCost;
    }

    return 0;
  };

  const getListGoogleAd = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          isLoadingTable: true,
        },
      });

      const result: any = await googleInfo.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/ad/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { ad_id, cost } = item;

          return {
            ...item,
            cost: convertCost(cost),
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

    const result = await googleInfo.get<FBReportType>(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "report/customer/chart-by-date/"
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

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_AD,
      payload: {
        columnsWidthResize: value,
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
      type: actionType.UPDATE_AD,
      payload: column,
    });
  };

  const handleFilter = (params: any) => {
    if (Object.keys(params).toString() === "objective") {
      dispatchStore({
        type: actionType.UPDATE_DATA_FILTER_AD,
        payload: {
          ...params,
        },
      });
    } else {
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
    }
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

  const columnShowExport = useMemo(() => {
    return ad.resultColumnsShow.length
      ? ad.resultColumnsShow.reduce((prevArr: any, current: any) => {
          return [
            ...prevArr,
            {
              name: current.name,
              title: current.title,
            },
          ];
        }, [])
      : [];
  }, [ad.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "date_from",
      "date_to",
      "effective_status",
      "objective",
      "ad_name",
      "dateValue",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      ...dataRenderHeaderShare,
      {
        style: {
          width: 180,
        },
        status: keyFilter.OBJECTIVE,
        title: "Mục tiêu",
        options: headerFilterObjecttiveAd,
        label: "objective",
        defaultValue: ad.dataFilter.objective || "all",
      },
      ...arrRenderFilterDateDefault,
    ];

    return (
      <HeaderFilter
        isShowPopupFilter={false}
        searchInput={[
          {
            keySearch: "ad_name",
            label: "Nhập tên quảng cáo",
          },
        ]}
        columnsCount={ad.countShowColumn}
        originColumns={ad.columnsShow}
        params={newParamsStore}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        dataRenderHeader={dataRenderHeader}
        handleFilter={handleFilter}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
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
          defaultFilter={{
            filterOne: "Tổng chiến dịch",
            filterTwo: "Chi phí",
          }}
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
          totalSummaryRow={totalRow}
          columns={ad.resultColumnsShow}
          columnWidths={ad.columnsWidthResize}
          summaryDataColumns={summaryColumnAd}
          columnOrders={columnOrders}
          isLoadingTable={isLoadingTable}
          renderHeader={renderHeader}
          arrAttachUnitVnd={["cost", "cost_per_conversion"]}
          setColumnWidths={handleResizeColumns}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSorting={handleChangeSorting}
          handleChangeColumnOrder={handleChangeColumnOrder}
        />
      </Grid>
    </Grid>
  );
};
export default Ad;
