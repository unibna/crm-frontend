// Libraries
import { useContext, useEffect, useMemo, useReducer, useRef } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { StoreWarehouse } from "views/WarehouseView/contextStore";

// Components
import DDataGrid from "components/DDataGrid";
import TableDetail from "components/DDataGrid/components/TableDetail";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import { TabWrap } from "components/Tabs";

// @Types
import { InitialState } from "_types_/FacebookType";

// Constants & Utils
import Link from "@mui/material/Link";
import { SortType } from "_types_/SortType";
import { TypeWarehouseSheet } from "_types_/WarehouseType";
import { fDateTime } from "utils/dateUtil";
import { handleParamsApi, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import {
  actionType,
  columnShowScanDetailLogs,
  contentGetValueExport,
} from "views/WarehouseView/constants";

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-turn_number",
  },
  dataTotal: 0,
  isShowFullTable: false,
};

const storeScanLogs = (state: InitialState, action: any) => {
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
      case actionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

const ScanLogs = () => {
  const { newCancelToken } = useCancelToken();
  const [state, dispatch] = useReducer(storeScanLogs, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreWarehouse);

  const countRender: any = useRef(null);

  const { scanLogs, params: paramsStore } = store;
  const { data, params, dataTotal, loading, isShowFullTable } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = data?.map((item: any) => {
      return {
        ...item,
        isCheck: scanLogs.columnSelected.includes(item.id),
      };
    });

    dispatch({
      type: actionType.UPDATE_DATA,
      payload: {
        data: newData,
      },
    });
  }, [scanLogs.columnSelected]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        search: paramsStore.search_transfer,
      },
      ["search", "created_from", "created_to"]
    );
    getListScanLogs(objParams);
  };

  const getListScanLogs = async (params: any) => {
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
        endpoint: "confirm/logs/turn/all",
      });

      if (result && result.data) {
        const { results = [], count } = result.data;

        const newData = results.map((item: any) => {
          return {
            ...item,
            scan_by: item?.scan_by?.name || item?.scan_by?.email || "",
            scan_at: item?.scan_at ? fDateTime(item?.scan_at) : "",
            // isCheck: scanLogs.columnSelected.includes(item.id),
          };
        });

        countRender.current = true;

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
      type: actionType.RESIZE_COLUMN_SCAN_LOGS,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_SCAN_LOGS,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_SCAN_LOGS,
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

  const handleRefresh = () => {
    loadDataTable();
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

  const handleShowFullTable = () => {
    dispatch({
      type: actionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
      },
    });
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...scanLogs.columnSelected];
    if (isCheck) {
      columnSelected.push(row.id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_SCAN_LOGS,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = data?.map((item: any) => item.id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_SCAN_LOGS,
      payload: {
        columnSelected,
      },
    });
  };

  const renderHeader = () => {
    const dataRenderHeader: any = [];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_transfer",
            label: "Nhập lần quét",
          },
        ]}
        arrNoneRenderSliderFilter={["confirmed_date_dateValue", "created_dateValue"]}
        contentGetValue={contentGetValueExport}
        dataRenderHeader={dataRenderHeader}
        dataExport={data}
        params={newParamsStore}
        columnShowExport={scanLogs.columnsShow}
        columnsCount={scanLogs.countShowColumn}
        originColumns={scanLogs.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        handleFilter={handleFilter}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const renderTableDetail = (row: any, value: number, columnSelected: string[]) => {
    const handleDataApi = (item: any) => {
      const newItem = {
        ...item,
        scan_by: item?.scan_by?.name || item?.scan_by?.email || "",
        scan_at: item?.scan_at ? fDateTime(item?.scan_at) : "",
        isCheck: scanLogs.columnSelected.includes(item.id),
        type: item?.type
          ? item?.type === TypeWarehouseSheet.IMPORTS
            ? "Nhập hàng"
            : "Xuất hàng"
          : "",
      };

      return {
        ...newItem,
        order_key: {
          value: item.order_key,
          content: (
            <Link
              href={`/orders/list/all?search=${item.order_key}`}
              target="_blank"
              rel="noreferrer"
            >
              {item.order_key}
            </Link>
          ),
        },
      };
    };

    const newParams = handleParamsApi(
      {
        ...paramsStore,
        cancelToken: newCancelToken(),
        turn_number: row?.turn_number,
      },
      ["turn_number", "cancelToken"]
    );

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetail
            dataRow={row}
            isHeightCustom={false}
            heightProps={"300px"}
            isFullTable={isShowFullTable}
            host={{
              get: (params?: any, endpoint?: string) =>
                orderApi.get({
                  params,
                  endpoint,
                }),
            }}
            params={{ ...newParams, ordering: "-order_number" }}
            // columnSelected={columnSelected}
            columnShowDetail={columnShowScanDetailLogs}
            endpoint="confirm/logs/all"
            contentOptional={{
              arrColumnOptional: ["order_key"],
            }}
            arrColumnEditLabel={["is_success"]}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
      </>
    );
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "search_transfer",
      "is_confirm_transfer",
      "reason_transfer",
      "created_from",
      "created_to",
      "created_dateValue",
      "confirmed_date_from",
      "confirmed_date_to",
      "confirmed_date_dateValue",
      "turn_number",
      "order_key",
      "order_number",
    ]);
  }, [paramsStore]);

  const columnOrders = useMemo(() => {
    return scanLogs.resultColumnsShow?.map((item) => item.name);
  }, [scanLogs.resultColumnsShow]);

  return (
    <>
      <DDataGrid
        isFullTable={isShowFullTable}
        data={data}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        isLoadingTable={loading}
        columns={scanLogs.resultColumnsShow}
        columnWidths={scanLogs.columnsWidthResize}
        columnOrders={columnOrders}
        renderHeader={renderHeader}
        renderTableDetail={renderTableDetail}
        isCheckAll={data.length && data.length === scanLogs.columnSelected.length}
        setColumnWidths={handleResizeColumns}
        handleChangeColumnOrder={handleChangeColumnOrder}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        handleCheckColumn={handleCheckColumn}
        handleCheckedAll={handleCheckedAll}
        handleSorting={handleChangeSorting}
      />
    </>
  );
};

export default ScanLogs;
