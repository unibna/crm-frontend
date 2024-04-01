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
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { FBReportType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  initialParams,
  dataRenderHeaderShare,
  columnShowAdSetByDateDetail,
  summaryColumnPostDetail,
  summaryColumnAdSet,
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

const storeAdSet = (state: InitialStateReport, action: any) => {
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

const AdSet = () => {
  const [state, dispatch] = useReducer(storeAdSet, initState);

  const {
    data: { dataTable, dataChart },
    loading: { isLoadingTable, isLoadingChart },
    params,
    dataTotalTable,
    totalRow,
  } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { adAccount, campaign, adset, params: paramsStore } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: adset.columnSelected.length
          ? adset.columnSelected.includes(item.adset_id)
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
  }, [adset.columnSelected]);

  useEffect(() => {
    const objParams = handleParamsApi(
      {
        ...paramsStore,
        ad_account_id: adAccount.columnSelected,
        campaign_id: campaign.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "adset_name",
        "ad_account_id",
        "campaign_id",
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
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "adset_name",
        "ad_account_id",
        "campaign_id",
      ]
    );

    getListFacebookAdSet(objParams);
  };

  const getListFacebookAdSet = async (params: any) => {
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
        "report/marketing/ad-set/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { adset_id, adset_name, attributes } = item;

          return {
            ...item,
            id: adset_id,
            searchName: adset_name,
            attributes: convertDataAttributes(attributes),
            isCheck: adset.columnSelected.length
              ? adset.columnSelected.includes(adset_id)
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

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_AD_SET,
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
      type: actionType.UPDATE_AD_SET,
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
    let columnSelected = [...adset.columnSelected];
    if (isCheck) {
      columnSelected.push(row.adset_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.adset_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD_SET,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.adset_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD_SET,
      payload: {
        columnSelected,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_AD_SET,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const columnShowExport = useMemo(() => {
    return adset.resultColumnsShow.length
      ? adset.resultColumnsShow.reduce((prevArr: any, current: any) => {
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
  }, [adset.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "effective_status",
      "objective",
      "adset_name",
      ...arrTakeValueParamsHeader,
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={adset.countShowColumn}
        originColumns={adset.columnsShow}
        searchInput={[
          {
            keySearch: "adset_name",
            label: "Nhập nhóm quảng cáo",
          },
        ]}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        params={newParamsStore}
        columnSelected={adset.columnSelected}
        dataRenderHeader={dataRenderHeaderShare}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const newParams = handleParamsApi(
      {
        ...paramsStore,
        adset_id: row.adset_id,
        ad_account_id: adAccount.columnSelected,
        campaign_id: campaign.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "adset_id",
        "effective_status",
        "objective",
        "adset_name",
        "ad_account_id",
        "campaign_id",
      ]
    );

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          host={facebookApi}
          params={{ ...newParams, dimension: "date", ordering: "" }}
          columnShowDetail={columnShowAdSetByDateDetail}
          summaryDataColumns={summaryColumnPostDetail}
          arrAttachUnitVnd={[
            "cost_per_messaging_conversation_started_7d",
            "cost_per_fb_pixel_complete_registration",
            "cost_per_comment",
            "cost_per_total_phone",
            "cost_per_total_phone_qualified",
            "spend",
          ]}
          endpoint="marketing/ad-set/"
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return adset.resultColumnsShow.map((item) => item.name);
  }, [adset.resultColumnsShow]);

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
          columns={adset.resultColumnsShow}
          columnWidths={adset.columnsWidthResize}
          columnOrders={columnOrders}
          totalSummaryRow={totalRow}
          arrAttachUnitVnd={[
            "cost_per_messaging_conversation_started_7d",
            "cost_per_fb_pixel_complete_registration",
            "cost_per_comment",
            "cost_per_total_phone",
            "cost_per_total_phone_qualified",
            "spend",
            "daily_budget",
          ]}
          arrAttachUnitPercent={["rate_post_comments_phone"]}
          isLoadingTable={isLoadingTable}
          listTabDetail={["by_date"]}
          isCheckAll={dataTable.length && dataTable.length === adset.columnSelected.length}
          summaryDataColumns={summaryColumnAdSet}
          renderHeader={renderHeader}
          renderTableDetail={renderTableDetail}
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
export default AdSet;
