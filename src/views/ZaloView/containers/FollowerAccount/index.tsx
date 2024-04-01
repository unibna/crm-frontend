// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";
import { PopupContext } from "views/ZaloView/contextPopup";

// Components
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DDataGrid from "components/DDataGrid";
import { Span } from "components/Labels";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";

// Constants
import {
  actionType,
  keyFilter,
  USER_GENDER,
  dataFilterFollow,
  message,
  TitlePopupHandle,
} from "views/ZaloView/constants";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { statusNotification, TYPE_FORM_FIELD } from "constants/index";

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

const storeFollowerAccount = (state: InitialStateReport, action: any) => {
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

const FollowerAccount = () => {
  const [state, dispatch] = useReducer(storeFollowerAccount, initState);
  const { state: store, dispatch: dispatchStore } = useContext(ZaloContext);
  const { newCancelToken } = useCancelToken();
  const { openPopup } = useContext(PopupContext);
  const {
    listAccount,
    dataFilter: { dataAccountOaZalo = [] },
    params: paramsStore,
  } = store;
  const theme = useTheme();

  const { data, loading, params, dataTotal, isShowFullTable } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = map(data, (item: any) => {
      return {
        ...item,
        isCheck: listAccount.columnSelected.includes(item.user_id),
      };
    });

    dispatch({
      type: actionType.UPDATE_DATA,
      payload: {
        data: newData,
      },
    });
  }, [listAccount.columnSelected]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsStore,
      created__date__gte: paramsStore.created_from,
      created__date__lte: paramsStore.created_to,
      modified__date__gte: paramsStore.modified_from,
      modified__date__lte: paramsStore.modified_to,
      search: paramsStore.search_account,
    };

    const newParams = chooseParams(objParams, [
      "search",
      "is_follow",
      "zalo_oa",
      "created__date__gte",
      "created__date__lte",
      "modified__date__gte",
      "modified__date__lte",
    ]);

    getListAccount(newParams);
  };

  const getListAccount = async (params: any) => {
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
        `follower/`
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = map(results, (item: any) => {
          return {
            ...item,
            account: {
              content: (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar alt={item.display_name} src={item.avatar} />
                  <Typography variant="subtitle2">{item.display_name}</Typography>
                </Stack>
              ),
            },
            user_gender: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={
                    (item.user_gender === 1 && "success") ||
                    (item.user_gender === 0 && "info") ||
                    "error"
                  }
                >
                  {USER_GENDER[item.user_gender as keyof typeof USER_GENDER]}
                </Span>
              ),
            },
            is_follow: {
              content: (
                <Span
                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                  color={item.is_follow ? "success" : "error"}
                >
                  {item.is_follow ? "Đang quan tâm" : "Bỏ quan tâm"}
                </Span>
              ),
            },
            isCheck: listAccount.columnSelected.includes(item.user_id),
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
      type: actionType.RESIZE_COLUMN_LIST_ACCOUNT,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_LIST_ACCOUNT,
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
      type: actionType.UPDATE_LIST_ACCOUNT,
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

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...listAccount.columnSelected];
    if (isCheck) {
      columnSelected.push(row.user_id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.user_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_LIST_ACCOUNT,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = map(data, (item: any) => item.user_id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_LIST_ACCOUNT,
      payload: {
        columnSelected,
      },
    });
  };

  const handleSendNotification = () => {
    if (getObjectPropSafely(() => listAccount.columnSelected.length)) {
      openPopup(TitlePopupHandle.SEND_NOTIFICATION, {
        columnSelected: listAccount.columnSelected,
      });
    } else {
      dispatchStore({
        type: actionType.UPDATE_NOTIFICATIONS,
        payload: {
          message: message.CHOOSE_ACCOUNT,
          variant: statusNotification.WARNING,
        },
      });
    }
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "created_from",
      "created_to",
      "modified_from",
      "modified_to",
      "search_account",
      "zalo_oa",
      "is_follow",
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
        status: keyFilter.STATUS,
        title: "Trạng thái",
        options: dataFilterFollow,
        label: "is_follow",
        defaultValue: getObjectPropSafely(() => dataFilterFollow[0].value) || "",
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
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Gửi thông báo
          </>
        ),
        handleClick: handleSendNotification,
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_account",
            label: "Nhập người theo dõi",
          },
        ]}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={{
          zalo_oa: getObjectPropSafely(() => dataAccountOaZalo[0].value),
        }}
        columnsCount={listAccount.countShowColumn}
        originColumns={listAccount.columnsShow}
        contentArrButtonOptional={contentArrButtonOptional}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return map(listAccount.resultColumnsShow, (item) => item.name);
  }, [listAccount.resultColumnsShow]);

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={listAccount.resultColumnsShow}
      columnWidths={listAccount.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      renderHeader={renderHeader}
      contentOptional={{
        arrColumnOptional: ["account", "user_gender", "is_follow"],
      }}
      isCheckAll={data.length && data.length === listAccount.columnSelected.length}
      setColumnWidths={handleResizeColumns}
      handleCheckColumn={handleCheckColumn}
      handleCheckedAll={handleCheckedAll}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default FollowerAccount;
