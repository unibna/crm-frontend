// Libraries
import { useContext, useEffect, useMemo, useReducer } from "react";

import { useTheme } from "@mui/material/styles";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { PopupContext } from "views/ZaloView/contextPopup";
import { ZaloContext } from "views/ZaloView/contextStore";

// Components
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MButton } from "components/Buttons";
import { Span } from "components/Labels";
import { TabWrap } from "components/Tabs";
import DDataGrid from "components/DDataGrid";
import TableDetail from "components/DDataGrid/components/TableDetail";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";

// Types
import { FacebookType, InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { SortType } from "_types_/SortType";

// Constants
import { TYPE_FORM_FIELD } from "constants/index";
import map from "lodash/map";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  TitlePopupHandle,
  TypeNotification,
  USER_GENDER,
  actionType,
  columnShowDetailNotificationOanError,
  columnShowDetailNotificationOanReceived,
  columnShowDetailNotificationOanSuccess,
  keyFilter,
} from "views/ZaloView/constants";
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

const ManualOanNotification = () => {
  const [state, dispatch] = useReducer(storeNotification, initState);
  const { state: store, dispatch: dispatchStore } = useContext(ZaloContext);
  const { newCancelToken } = useCancelToken();
  const { openPopup } = useContext(PopupContext);
  const {
    manualOanNotification,
    dataFilter: { dataAccountOaZalo = [] },
    params: paramsStore,
  } = store;
  const theme = useTheme();

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
      search: paramsStore.search_manual_oan_notification,
      type: TypeNotification.OAN,
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
        const newData = (results || []).map((item: any) => {
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
            thumb_img: {
              url: getObjectPropSafely(() => item.thumbnail),
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
      type: actionType.RESIZE_COLUMN_MANUAL_OAN_NOTIFICATION,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_MANUAL_OAN_NOTIFICATION,
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
      type: actionType.UPDATE_MANUAL_OAN_NOTIFICATION,
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
      "search_manual_oan_notification",
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

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_manual_oan_notification",
            label: "Nhập thông báo",
          },
        ]}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={{
          zalo_oa: getObjectPropSafely(() => dataAccountOaZalo[0].value),
        }}
        arrNoneRenderSliderFilter={["created_dateValue", "modified_dateValue"]}
        columnsCount={manualOanNotification.countShowColumn}
        originColumns={manualOanNotification.columnsShow}
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
      send_request__type: TypeNotification.OAN,
    };

    const handleDataApi = (item: any) => {
      return {
        account: {
          content: (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                alt={getObjectPropSafely(() => item.follower.display_name)}
                src={getObjectPropSafely(() => item.follower.avatar)}
              />
              <Typography variant="subtitle2">
                {getObjectPropSafely(() => item.follower.display_name)}
              </Typography>
            </Stack>
          ),
        },
        user_gender: {
          content: (
            <Span
              variant={theme.palette.mode === "light" ? "ghost" : "filled"}
              color={
                (getObjectPropSafely(() => item.follower.user_gender) === 1 && "success") || "error"
              }
            >
              {USER_GENDER[item?.follower?.user_gender as keyof typeof USER_GENDER]}
            </Span>
          ),
        },
        is_follow: {
          content: (
            <Span
              variant={theme.palette.mode === "light" ? "ghost" : "filled"}
              color={getObjectPropSafely(() => item.follower.is_follow) ? "success" : "error"}
            >
              {getObjectPropSafely(() => item.follower.is_follow) ? "Đang quan tâm" : "Bỏ quan tâm"}
            </Span>
          ),
        },
        action: {
          content: (
            <MButton onClick={() => openPopup(TitlePopupHandle.SEND_NOTIFICATION)}>Gửi lại</MButton>
          ),
        },
        operation: {
          isShowView: true,
        },
        image_url: getObjectPropSafely(() => item.receive_data.content.image_url),
        subtitle: getObjectPropSafely(() => item.receive_data.content.subtitle),
        title: getObjectPropSafely(() => item.receive_data.content.title),
        action_url: getObjectPropSafely(() => item.receive_data.content.action_url),
      };
    };

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetail
            host={zaloApi}
            params={{ ...paramsDetail, is_success: true }}
            contentOptional={{
              arrColumnOptional: ["action", "account", "is_follow", "user_gender"],
            }}
            arrColumnEditLabel={["is_received"]}
            columnShowDetail={columnShowDetailNotificationOanSuccess}
            endpoint="recipients/"
            contentColumnHandleOperation={{
              arrColumnHandleOperation: ["operation"],
              handleView: (row: FacebookType) =>
                openPopup(TitlePopupHandle.TEMPLATE_MANUAL_OAN_NOTIFICATION, row),
            }}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <TableDetail
            host={zaloApi}
            params={{ ...paramsDetail, is_success: false }}
            contentOptional={{
              arrColumnOptional: ["action", "account", "is_follow", "user_gender"],
            }}
            arrColumnEditLabel={["is_received"]}
            columnShowDetail={columnShowDetailNotificationOanError}
            endpoint="recipients/"
            contentColumnHandleOperation={{
              arrColumnHandleOperation: ["operation"],
              handleView: (row: FacebookType) =>
                openPopup(TitlePopupHandle.TEMPLATE_MANUAL_OAN_NOTIFICATION, row),
            }}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
        <TabWrap value={value} index={2}>
          <TableDetail
            host={zaloApi}
            params={{ ...paramsDetail, is_received: true }}
            contentOptional={{
              arrColumnOptional: ["action", "account", "is_follow", "user_gender"],
            }}
            arrColumnEditLabel={["is_received"]}
            columnShowDetail={columnShowDetailNotificationOanReceived}
            endpoint="recipients/"
            contentColumnHandleOperation={{
              arrColumnHandleOperation: ["operation"],
              handleView: (row: FacebookType) =>
                openPopup(TitlePopupHandle.TEMPLATE_MANUAL_OAN_NOTIFICATION, row),
            }}
            handleDataApi={handleDataApi}
          />
        </TabWrap>
      </>
    );
  };

  const columnOrders = useMemo(() => {
    return map(manualOanNotification.resultColumnsShow, (item) => item.name);
  }, [manualOanNotification.resultColumnsShow]);

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={manualOanNotification.resultColumnsShow}
      columnWidths={manualOanNotification.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isHeightCustom={data.length < 10}
      renderHeader={renderHeader}
      listTabDetail={["success", "error", "received"]}
      renderTableDetail={renderTableDetail}
      contentOptional={{
        arrColumnOptional: ["type"],
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleView: (row: FacebookType) =>
          openPopup(TitlePopupHandle.TEMPLATE_MANUAL_OAN_NOTIFICATION, row),
      }}
      arrColumnEditLabel={["is_sent"]}
      arrColumnThumbImg={["thumb_img"]}
      arrDateTime={["sent_time", "created", "scheduled_time"]}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default ManualOanNotification;
