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
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { FBReportType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  columnShowAdGroupActivitiesDetail,
  summaryColumnAdGroup,
  dataRenderHeaderShare,
  keyFilter,
  FILTER_CHART_OPTIONS,
  headerFilterObjecttiveAdGroup,
  handleResourceData,
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

const storeAdGroup = (state: InitialStateReport, action: any) => {
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

const AdGroup = () => {
  const [state, dispatch] = useReducer(storeAdGroup, initState);

  const {
    data: { dataTable, dataChart },
    loading: { isLoadingTable, isLoadingChart },
    params,
    dataTotalTable,
    totalRow,
  } = state;
  const { newCancelToken } = useCancelToken();
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportGoogle);
  const { customer, campaign, adGroup, params: paramsStore } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, adGroup.dataFilter]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: adGroup.columnSelected.length
          ? adGroup.columnSelected.includes(item.ad_group_id)
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
  }, [adGroup.columnSelected]);

  useEffect(() => {
    const objParams = chooseParams(
      {
        ...paramsStore,
        ...adGroup.dataFilter,
        customer_id: customer.columnSelected,
        campaign_id: campaign.columnSelected,
        limit: 1000,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "ad_group_name",
        "customer_id",
        "campaign_id",
      ]
    );

    getDataChart(objParams);
  }, [paramsStore]);

  const loadDataTable = () => {
    const objParams = chooseParams(
      {
        ...params,
        ...paramsStore,
        ...adGroup.dataFilter,
        customer_id: customer.columnSelected,
        campaign_id: campaign.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "ad_group_name",
        "customer_id",
        "campaign_id",
      ]
    );

    getListGoogleAdGroup(objParams);
  };

  const convertCost = (cost: number) => {
    if (cost) {
      const newCost = Math.round(cost);
      return newCost;
    }

    return 0;
  };

  const getListGoogleAdGroup = async (params: any) => {
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
        "report/ad_group/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { ad_group_id, cost } = item;

          return {
            ...item,
            cost: convertCost(cost),
            isCheck: adGroup.columnSelected.length
              ? adGroup.columnSelected.includes(ad_group_id)
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
      type: actionType.RESIZE_COLUMN_AD_GROUP,
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
      type: actionType.UPDATE_AD_GROUP,
      payload: column,
    });
  };

  const handleFilter = (params: any) => {
    if (Object.keys(params).toString() === "objective") {
      dispatchStore({
        type: actionType.UPDATE_DATA_FILTER_AD_GROUP,
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

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...adGroup.columnSelected];
    if (isCheck) {
      columnSelected.push(row.ad_group_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.ad_group_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD_GROUP,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.ad_group_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_AD_GROUP,
      payload: {
        columnSelected,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_AD_GROUP,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const columnShowExport = useMemo(() => {
    return adGroup.resultColumnsShow.length
      ? adGroup.resultColumnsShow.reduce((prevArr: any, current: any) => {
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
  }, [adGroup.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "date_from",
      "date_to",
      "effective_status",
      "objective",
      "ad_group_name",
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
        options: headerFilterObjecttiveAdGroup,
        label: "objective",
        defaultValue: adGroup.dataFilter.objective || "all",
      },
      ...arrRenderFilterDateDefault,
    ];

    return (
      <HeaderFilter
        isShowPopupFilter={false}
        searchInput={[
          {
            keySearch: "ad_group_name",
            label: "Nhập tên nhóm quảng cáo",
          },
        ]}
        columnsCount={adGroup.countShowColumn}
        originColumns={adGroup.columnsShow}
        params={newParamsStore}
        columnSelected={adGroup.columnSelected}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        dataRenderHeader={dataRenderHeader}
        handleFilter={handleFilter}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApiByDate = (item: any) => {
      const {
        client_type,
        change_resource_type,
        old_resource,
        new_resource,
        resource_change_operation,
        changed_fields,
      } = item;

      const newResourceData = handleResourceData(
        change_resource_type,
        old_resource,
        new_resource,
        changed_fields
      );

      return {
        client_type: client_type.split(".")[1],
        change_resource_type: change_resource_type.split(".")[1],
        resource_change_operation: resource_change_operation.split(".")[1],
        extra_data: newResourceData,
      };
    };

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          host={googleInfo}
          params={{}}
          arrColumnEditLabel={["extra_data"]}
          columnShowDetail={columnShowAdGroupActivitiesDetail}
          endpoint={`ad_group/${row.ad_group_id}/activities`}
          handleDataApi={handleDataApiByDate}
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return adGroup.resultColumnsShow.map((item) => item.name);
  }, [adGroup.resultColumnsShow]);

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
          columns={adGroup.resultColumnsShow}
          columnWidths={adGroup.columnsWidthResize}
          columnOrders={columnOrders}
          isCheckAll={dataTable.length && dataTable.length === adGroup.columnSelected.length}
          summaryDataColumns={summaryColumnAdGroup}
          isLoadingTable={isLoadingTable}
          renderHeader={renderHeader}
          arrAttachUnitVnd={["cost", "cost_per_conversion"]}
          setColumnWidths={handleResizeColumns}
          listTabDetail={["activities"]}
          renderTableDetail={renderTableDetail}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSorting={handleChangeSorting}
          handleCheckColumn={handleCheckColumn}
          handleCheckedAll={handleCheckedAll}
          handleChangeColumnOrder={handleChangeColumnOrder}
        />
      </Grid>
    </Grid>
  );
};
export default AdGroup;
