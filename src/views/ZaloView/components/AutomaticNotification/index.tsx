// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";
import { useTheme } from "@mui/material/styles";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";
import { PopupContext } from "views/ZaloView/contextPopup";

// Components
import DDataGrid from "components/DDataGrid";
import { Span } from "components/Labels";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";

// Types
import { SortType } from "_types_/SortType";
import { FacebookType, InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";

// Constants
import {
  actionType,
  TypeNotification,
  TitlePopupHandle,
  keyFilter,
  dataFilterTypeAutomatic,
  dataFilterStatus,
} from "views/ZaloView/constants";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { TYPE_FORM_FIELD } from "constants/index";

import vi from "locales/vi.json";

// --------------------------------------------------------------------

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-created",
  },
  dataTotal: 0,
  totalRow: {},
  isShowFullTable: false,
};

const storeAutomaticNotification = (state: InitialStateReport, action: any) => {
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
      case actionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

const AutomaticNotification = () => {
  const [state, dispatch] = useReducer(storeAutomaticNotification, initState);
  const { state: store, dispatch: dispatchStore } = useContext(ZaloContext);
  const { newCancelToken } = useCancelToken();
  const {
    automaticNotification,
    dataFilter: { dataAccountOaZalo = [] },
    params: paramsStore,
  } = store;
  const theme = useTheme();
  const { openPopup } = useContext(PopupContext);

  const { data, loading, params, dataTotal, isShowFullTable } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsStore,
      created__date__gte: paramsStore.created_from,
      created__date__lte: paramsStore.created_to,
      modified__date__gte: paramsStore.modified_from,
      modified__date__lte: paramsStore.modified_to,
      search: paramsStore.search_automatic_notification,
    };

    const newParams = chooseParams(objParams, [
      "search",
      "zalo_oa",
      "type",
      "is_success",
      "created__date__gte",
      "created__date__lte",
      "modified__date__gte",
      "modified__date__lte",
    ]);

    getListAutomaticNotification(newParams);
  };

  const getListAutomaticNotification = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result = await zaloApi.get<MultiResponseType<any>>(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        `auto-notification-zns/`
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = (results || []).map((item: any) => {
          return {
            ...item,
            type: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={
                    (item.type === TypeNotification.ORN && "warning") ||
                    (item.type === TypeNotification.DEN && "info") ||
                    "secondary"
                  }
                >
                  {item.type === TypeNotification.ORN
                    ? "Thông báo đơn hàng"
                    : item.type === TypeNotification.DEN
                    ? "Thông báo vận chuyển"
                    : "Thông báo Ladipage"}
                </Span>
              ),
            },
            is_success: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={(item.is_success && "success") || "error"}
                >
                  {item.is_success ? "Thành công" : "Thất bại"}
                </Span>
              ),
            },
            order_number: {
              endpoint: item.order_number,
            },
            operation: {
              isShowView: true,
            },
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
      type: actionType.RESIZE_COLUMN_AUTOMATIC_NOTIFICATION,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_AUTOMATIC_NOTIFICATION,
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

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_AUTOMATIC_NOTIFICATION,
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

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleShowFullTable = () => {
    dispatch({
      type: actionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
      },
    });
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "created_from",
      "created_to",
      "modified_from",
      "modified_to",
      "zalo_oa",
      "type",
      "is_success",
      "created_dateValue",
      "modified_dateValue",
      "search_automatic_notification",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.ZALO_OA,
        title: vi.zalo_oa,
        options: dataAccountOaZalo,
        label: "zalo_oa",
        defaultValue: getObjectPropSafely(() => dataAccountOaZalo[0].value) || "",
        multiple: true,
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.TYPE,
        title: "Loại",
        options: dataFilterTypeAutomatic,
        label: "type",
        defaultValue: getObjectPropSafely(() => dataFilterTypeAutomatic[0].value) || "",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.STATUS,
        title: "Trạng thái",
        options: dataFilterStatus,
        label: "is_success",
        defaultValue: getObjectPropSafely(() => dataFilterStatus[0].value) || "",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian tạo",
        keyDateFrom: "created_from",
        keyDateTo: "created_to",
        keyDateValue: "created_dateValue",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian chỉnh sửa",
        keyDateFrom: "modified_from",
        keyDateTo: "modified_to",
        keyDateValue: "modified_dateValue",
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_automatic_notification",
            label: "Nhập thông báo",
          },
        ]}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={{
          zalo_oa: getObjectPropSafely(() => dataAccountOaZalo[0].value),
        }}
        arrNoneRenderSliderFilter={["created_dateValue", "modified_dateValue"]}
        columnsCount={automaticNotification.countShowColumn}
        originColumns={automaticNotification.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return automaticNotification.resultColumnsShow.map((item) => item.name);
  }, [automaticNotification.resultColumnsShow]);

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={automaticNotification.resultColumnsShow}
      columnWidths={automaticNotification.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isHeightCustom={data.length < 10}
      renderHeader={renderHeader}
      contentOptional={{
        arrColumnOptional: ["type", "is_success"],
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleView: (row: FacebookType) =>
          openPopup(TitlePopupHandle.TEMPLATE_MANUAL_AUTOMATIC_NOTIFICATION, row),
      }}
      isCallApiColumnHandleLink
      arrColumnHandleLink={["order_number"]}
      arrColumnEditLabel={["is_received"]}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default AutomaticNotification;
