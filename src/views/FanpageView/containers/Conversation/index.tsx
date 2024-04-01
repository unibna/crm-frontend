// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Context
import { StoreFanpage } from "views/FanpageView/contextStore";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";

// Types
import { SortType } from "_types_/SortType";
import { InitialState } from "_types_/FacebookType";

// Constants
import { actionType } from "views/FanpageView/constants";

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "",
  },
  dataTotal: 0,
};

const storeConversation = (state: InitialState, action: any) => {
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
    }
  }
};

const Conversation = () => {
  const [state, dispatch] = useReducer(storeConversation, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreFanpage);
  const { conversation } = store;

  const { data, loading, params, dataTotal } = state;

  useEffect(() => {
    getListConversation({ ...params });
  }, [params]);

  const getListConversation = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result = await facebookApi.get(params, "conversations/");

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          const { conversation_id, updated_time, sender_name, sender_id, fb_page } = item;

          return {
            conversation_id,
            updated_time,
            sender_id,
            sender_name,
            fb_page,
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
      type: actionType.RESIZE_COLUMN_CONVERSAION,
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
      type: actionType.UPDATE_CONVERSATION,
      payload: column,
    });
  };

  const handleFilter = (params: any) => {
    // dispatch({
    //     type: actionType.UPDATE_PARAMS,
    //     payload: {
    //         ...params
    //     },
    // });
  };

  const handleRefresh = () => {
    getListConversation({ ...params });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_CONVERSATION,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        isShowFilter={false}
        columnsCount={conversation.countShowColumn}
        handleFilter={handleFilter}
        originColumns={conversation.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return conversation.resultColumnsShow.map((item) => item.name);
  }, [conversation.resultColumnsShow]);

  return (
    <DDataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={conversation.resultColumnsShow}
      columnWidths={conversation.columnsWidthResize}
      columnOrders={columnOrders}
      renderHeader={renderHeader}
      isLoadingTable={loading}
      setColumnWidths={handleResizeColumns}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSorting={handleChangeSorting}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Conversation;
