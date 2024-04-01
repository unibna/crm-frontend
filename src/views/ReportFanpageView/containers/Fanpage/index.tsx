// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreReportFanpage } from "views/ReportFanpageView/contextStore";

// Components
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";

// Constants
import { actionType, summaryColumnFanpage, keyFilter } from "views/ReportFanpageView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import { handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { arrRenderFilterDateDefault } from "constants/index";

const initState: InitialStateReport = {
  data: {
    dataTable: [],
  },
  loading: {
    isLoadingTable: false,
  },
  params: {
    page: 1,
    limit: 200,
    ordering: "",
  },
  dataTotalTable: 0,
  totalRow: {},
};

const storeFanpage = (state: InitialStateReport, action: any) => {
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

const Fanpage = () => {
  const [state, dispatch] = useReducer(storeFanpage, initState);

  const {
    data: { dataTable },
    loading: { isLoadingTable },
    params,
    dataTotalTable,
    totalRow,
  } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFanpage);
  const { fanpage, params: paramsStore } = store;
  const {
    dataFilter: { dataFilterFanpage },
  } = fanpage;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: fanpage.columnSelected.length
          ? fanpage.columnSelected.includes(item.campaign_id)
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
  }, [fanpage.columnSelected]);

  const loadDataTable = () => {
    let objParams = {
      ...params,
      ...paramsStore,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to", "page_id"]);

    getListFanpage({
      ...newParams,
    });
  };

  const getListFanpage = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          isLoadingTable: true,
        },
      });
      const result: any = await facebookApi.get(params, "report/fanpage/page/");

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            page_name: item.name,
          };
        });

        const newDataFilter = results.map((item: any) => {
          const { page_id, name } = item;

          return {
            value: page_id,
            label: name,
          };
        });

        dispatchStore({
          type: actionType.UPDATE_DATA_FILTER_FANPAGE,
          payload: {
            dataFilterFanpage:
              [
                {
                  label: "Tất cả",
                  value: "all",
                },
                ...newDataFilter,
              ] || [],
          },
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

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_FANPAGE,
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
      type: actionType.UPDATE_FANPAGE,
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
      type: actionType.UPDATE_COLUMN_ORDER_FANPAGE,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...fanpage.columnSelected];
    if (isCheck) {
      columnSelected.push(row.campaign_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.campaign_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_FANPAGE,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = dataTable.map((item: any) => item.campaign_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_FANPAGE,
      payload: {
        columnSelected,
      },
    });
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
    return handleParamsHeaderFilter(paramsStore, ["date_from", "date_to", "page_id", "dateValue"]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.FANPAGE,
        title: "Trang",
        options: dataFilterFanpage,
        label: "page_id",
        defaultValue: dataFilterFanpage[0].value,
      },
      ...arrRenderFilterDateDefault,
    ];

    return (
      <HeaderFilter
        columnsCount={fanpage.countShowColumn}
        originColumns={fanpage.columnsShow}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return fanpage.resultColumnsShow.map((item) => item.name);
  }, [fanpage.resultColumnsShow]);

  return (
    <DDataGrid
      data={dataTable}
      dataTotal={dataTotalTable}
      page={params.page}
      pageSize={params.limit}
      totalSummaryRow={totalRow}
      columns={fanpage.resultColumnsShow}
      columnWidths={fanpage.columnsWidthResize}
      summaryDataColumns={summaryColumnFanpage}
      columnOrders={columnOrders}
      isLoadingTable={isLoadingTable}
      isCheckAll={dataTable.length && dataTable.length === fanpage.columnSelected.length}
      setColumnWidths={handleResizeColumns}
      renderHeader={renderHeader}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSorting={handleChangeSorting}
      handleCheckColumn={handleCheckColumn}
      handleCheckedAll={handleCheckedAll}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Fanpage;
