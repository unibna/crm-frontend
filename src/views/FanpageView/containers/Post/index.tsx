// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Context
import { StoreFanpage } from "views/FanpageView/contextStore";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";

// Types
import { SortType } from "_types_/SortType";
import { InitialState } from "_types_/FacebookType";

// Constants
import { actionType, columnShowComment } from "views/FanpageView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

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

const storeMessage = (state: InitialState, action: any) => {
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

const Post = () => {
  const [state, dispatch] = useReducer(storeMessage, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreFanpage);
  const { post } = store;

  const { data, loading, params, dataTotal } = state;

  useEffect(() => {
    getLisPost({ ...params });
  }, [params]);

  // const loadDataTable = () => {
  //   const objParams = {
  //     ...params,
  //   };
  //   getLisPost(objParams);
  // };

  const getLisPost = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result = await facebookApi.get(params, "posts/");

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          const { post_id, created_time, message, picture, updated_time, icon, type, fb_page } =
            item;

          return {
            post_id,
            updated_time,
            thumb_img: {
              id: post_id,
              body: message,
              url: picture,
            },
            created_time,
            icon,
            type,
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
      type: actionType.RESIZE_COLUMN_POST,
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
      type: actionType.UPDATE_POST,
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
    getLisPost({ ...params });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_POST,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const renderTableDetail = (row: any, value: number) => {
    const paramsDetail = {
      post_id: row.post_id,
      ordering: "-created_time",
    };

    const handleDataApiComment = (item: any) => {
      return {
        thumb_img: {
          id: getObjectPropSafely(() => item.fb_post.post_id),
          url: getObjectPropSafely(() => item.fb_post.picture),
          body: getObjectPropSafely(() => item.fb_post.message),
        },
      };
    };

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetail
            host={facebookApi}
            params={paramsDetail}
            arrCreateAtColumn={["created_time"]}
            arrColumnThumbImg={["thumb_img"]}
            columnShowDetail={columnShowComment}
            endpoint="comments/"
            handleDataApi={handleDataApiComment}
          />
        </TabWrap>
      </>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={post.countShowColumn}
        handleFilter={handleFilter}
        originColumns={post.columnsShow}
        isShowFilter={false}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return post.resultColumnsShow.map((item) => item.name);
  }, [post.resultColumnsShow]);

  return (
    <DDataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={post.resultColumnsShow}
      columnWidths={post.columnsWidthResize}
      columnOrders={columnOrders}
      renderHeader={renderHeader}
      isLoadingTable={loading}
      listTabDetail={["comment"]}
      arrStatus={["type"]}
      arrColumnThumbImg={["thumb_img"]}
      renderTableDetail={renderTableDetail}
      setColumnWidths={handleResizeColumns}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSorting={handleChangeSorting}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Post;
