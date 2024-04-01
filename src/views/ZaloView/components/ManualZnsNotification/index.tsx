// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import drop from "lodash/drop";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";
import { PopupContext } from "views/ZaloView/contextPopup";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import TableDetail from "components/DDataGrid/components/TableDetail";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Span } from "components/Labels";
import { TabWrap } from "components/Tabs";

// Types
import { SortType } from "_types_/SortType";
import { FacebookType, InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { ColorSchema } from "_types_/ThemeColorType";

// Constants
import {
  actionType,
  TypeNotification,
  keyFilter,
  columnShowDetailNotificationZnsSuccess,
  columnShowDetailNotificationZnsError,
  columnShowDetailNotificationZnsReceived,
  TitlePopupHandle,
} from "views/ZaloView/constants";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { TYPE_FORM_FIELD } from "constants/index";
import map from "lodash/map";

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

const storeNotification = (state: InitialStateReport, action: any) => {
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

const ManualZnsNotification = () => {
  const [state, dispatch] = useReducer(storeNotification, initState);
  const { state: store, dispatch: dispatchStore } = useContext(ZaloContext);
  const { newCancelToken } = useCancelToken();
  const {
    manualZnsNotification,
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
      search: paramsStore.search_manual_zns_notification,
      type: TypeNotification.ZNS,
    };

    const newParams = chooseParams(objParams, [
      "search",
      "zalo_oa",
      "type",
      "created__date__gte",
      "created__date__lte",
      "modified__date__gte",
      "modified__date__lte",
    ]);

    getListNotification(newParams);
  };

  const getListNotification = async (params: any) => {
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
        `send-requests/`
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = map(results, (item: any) => {
          return {
            ...item,
            type: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={(item.type === TypeNotification.OAN && "success") || "error"}
                >
                  {item.type}
                </Span>
              ),
            },
            created_by: getObjectPropSafely(() => item.created_by.name),
            total_error: item?.total_send - item?.total_success,
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
      type: actionType.RESIZE_COLUMN_MANUAL_ZNS_NOTIFICATION,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_MANUAL_ZNS_NOTIFICATION,
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
      type: actionType.UPDATE_MANUAL_ZNS_NOTIFICATION,
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
      "created_dateValue",
      "modified_dateValue",
      "search_manual_zns_notification",
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

    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <FileUploadIcon />
            Gửi nhiều SDT
          </>
        ),
        handleClick: () => openPopup(TitlePopupHandle.IMPORT_EXCEL_ZNS),
      },
      {
        content: <>Gửi một SDT</>,
        handleClick: () => openPopup(TitlePopupHandle.SEND_ZNS),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_manual_zns_notification",
            label: "Nhập thông báo",
          },
        ]}
        contentArrButtonOptional={contentArrButtonOptional}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={{
          zalo_oa: getObjectPropSafely(() => dataAccountOaZalo[0].value),
        }}
        arrNoneRenderSliderFilter={["created_dateValue", "modified_dateValue"]}
        columnsCount={manualZnsNotification.countShowColumn}
        originColumns={manualZnsNotification.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const paramsDetail = {
      send_request: row.id,
      send_request__type: TypeNotification.ZNS,
    };

    const handleDataApi = (item: any) => {
      return {
        name:
          getObjectPropSafely(() => item.name[0]) === "8"
            ? "0" + drop(item?.name, 2).join("")
            : item?.name,
        operation: {
          isShowView: true,
        },
      };
    };

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetail
            host={zaloApi}
            params={{ ...paramsDetail, is_success: true }}
            contentOptional={{
              arrColumnOptional: ["is_success"],
            }}
            arrColumnEditLabel={["is_received"]}
            columnShowDetail={columnShowDetailNotificationZnsSuccess}
            endpoint="recipients/"
            contentColumnHandleOperation={{
              arrColumnHandleOperation: ["operation"],
              handleView: (row: FacebookType) =>
                openPopup(TitlePopupHandle.TEMPLATE_MANUAL_ZNS_NOTIFICATION, row),
            }}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <TableDetail
            host={zaloApi}
            params={{ ...paramsDetail, is_success: false }}
            contentOptional={{
              arrColumnOptional: ["is_success"],
            }}
            arrColumnEditLabel={["is_received"]}
            columnShowDetail={columnShowDetailNotificationZnsError}
            endpoint="recipients/"
            contentColumnHandleOperation={{
              arrColumnHandleOperation: ["operation"],
              handleView: (row: FacebookType) =>
                openPopup(TitlePopupHandle.TEMPLATE_MANUAL_ZNS_NOTIFICATION, row),
            }}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
        <TabWrap value={value} index={2}>
          <TableDetail
            host={zaloApi}
            params={{ ...paramsDetail, is_received: true }}
            contentOptional={{
              arrColumnOptional: ["is_success"],
            }}
            arrColumnEditLabel={["is_received"]}
            columnShowDetail={columnShowDetailNotificationZnsReceived}
            endpoint="recipients/"
            contentColumnHandleOperation={{
              arrColumnHandleOperation: ["operation"],
              handleView: (row: FacebookType) =>
                openPopup(TitlePopupHandle.TEMPLATE_MANUAL_ZNS_NOTIFICATION, row),
            }}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
      </>
    );
  };

  const columnOrders = useMemo(() => {
    return map(manualZnsNotification.resultColumnsShow, (item) => item.name);
  }, [manualZnsNotification.resultColumnsShow]);

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={manualZnsNotification.resultColumnsShow}
      columnWidths={manualZnsNotification.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isHeightCustom={data.length < 10}
      renderHeader={renderHeader}
      listTabDetail={["success", "error", "received"]}
      renderTableDetail={renderTableDetail}
      contentOptional={{
        arrColumnOptional: ["type"],
      }}
      arrColumnEditLabel={["is_sent"]}
      arrDateTime={["sent_time", "created", "scheduled_time"]}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default ManualZnsNotification;
