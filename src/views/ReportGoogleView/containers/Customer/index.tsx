// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { googleInfo } from "_apis_/google.api";

// Context
import { StoreReportGoogle } from "views/ReportGoogleView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";
import LineChart from "components/Charts/LineChart";
import Grid from "@mui/material/Grid";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { FBReportType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  summaryColumnCustomer,
  FILTER_CHART_OPTIONS,
} from "views/ReportGoogleView/constants";
import { chooseParams } from "utils/formatParamsUtil";

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
  dataTotal: 0,
  totalRow: {},
};

const storeCustomer = (state: InitialStateReport, action: any) => {
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

const Customer = () => {
  const [state, dispatch] = useReducer(storeCustomer, initState);
  const { newCancelToken } = useCancelToken();
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportGoogle);
  const { customer, params: paramsStore } = store;

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
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: customer.columnSelected.length
          ? customer.columnSelected.includes(item.customer_id)
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
  }, [customer.columnSelected]);

  useEffect(() => {
    getDataChart(
      chooseParams(
        {
          date_from: paramsStore.date_from || "",
          date_to: paramsStore.date_to || "",
          limit: 1000,
        },
        ["date_from", "date_to"]
      )
    );
  }, [paramsStore]);

  const loadDataTable = () => {
    const newParams = chooseParams(
      {
        ...params,
        ...paramsStore,
      },
      ["date_from", "date_to", "effective_status"]
    );

    getListGoogleCustomer(newParams);
  };

  const convertCost = (cost: number) => {
    if (cost) {
      const newCost = Math.round(cost);
      return newCost;
    }

    return 0;
  };

  const getListGoogleCustomer = async (params: any) => {
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
        "report/customer/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { customer_id, cost } = item;

          return {
            ...item,
            cost: convertCost(cost),
            isCheck: customer.columnSelected.length
              ? customer.columnSelected.includes(customer_id)
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
      type: actionType.RESIZE_COLUMN_CUSTOMER,
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
      type: actionType.UPDATE_CUSTOMER,
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

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_CUSTOMER,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...customer.columnSelected];
    if (isCheck) {
      columnSelected.push(row.customer_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.customer_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_CUSTOMER,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.customer_id);
    }
    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_CUSTOMER,
      payload: {
        columnSelected,
      },
    });
  };

  const columnShowExport = useMemo(() => {
    return customer.resultColumnsShow.length
      ? customer.resultColumnsShow.reduce((prevArr: any, current: any) => {
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
  }, [customer.resultColumnsShow]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        isShowPopupFilter={false}
        isShowFilterDate
        columnsCount={customer.countShowColumn}
        params={paramsStore}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        // dataRenderHeader={dataRenderHeaderShare}
        arrAttachUnitVnd={["cost", "cost_per_conversion"]}
        originColumns={customer.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={loadDataTable}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return customer.resultColumnsShow.map((item) => item.name);
  }, [customer.resultColumnsShow]);

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
          dataTotal={dataTotal}
          page={params.page}
          pageSize={params.limit}
          totalSummaryRow={totalRow}
          columns={customer.resultColumnsShow}
          columnWidths={customer.columnsWidthResize}
          summaryDataColumns={summaryColumnCustomer}
          isCheckAll={dataTable.length && dataTable.length === customer.columnSelected.length}
          columnOrders={columnOrders}
          isLoadingTable={isLoadingTable}
          renderHeader={renderHeader}
          arrAttachUnitVnd={["cost", "cost_per_conversion"]}
          setColumnWidths={handleResizeColumns}
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
export default Customer;
