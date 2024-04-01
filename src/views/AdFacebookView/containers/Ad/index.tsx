// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreFacebook } from "views/AdFacebookView/contextStore";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";

// Types
import { SortType } from "_types_/SortType";
import { InitialState } from "_types_/FacebookType";

// Constants
import { actionType } from "views/AdFacebookView/constants";

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

const storeAd = (state: InitialState, action: any) => {
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

const Ad = () => {
  const [state, dispatch] = useReducer(storeAd, initState);
  const { data, loading, params, dataTotal } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreFacebook);
  const { ad } = store;

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };
    getListFacebookAd(objParams);
  };

  const getListFacebookAd = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result = await facebookApi.get(params, "ads/");

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results?.map((item: any) => {
          const { thumbnail_url, body, effective_object_story_id } = item;
          return {
            ...item,
            thumb_img: {
              url: thumbnail_url,
              body,
              id: effective_object_story_id,
            },
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: newData,
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
      type: actionType.RESIZE_COLUMN_AD,
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
      type: actionType.UPDATE_AD,
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
    loadDataTable();
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_AD,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={ad.countShowColumn}
        originColumns={ad.columnsShow}
        dataExport={data}
        columnShowExport={ad.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        handleFilter={handleFilter}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return ad.resultColumnsShow.map((item) => item.name);
  }, [ad.resultColumnsShow]);

  return (
    <DDataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={ad.resultColumnsShow}
      columnWidths={ad.columnsWidthResize}
      columnOrders={columnOrders}
      renderHeader={renderHeader}
      isLoadingTable={loading}
      setColumnWidths={handleResizeColumns}
      arrColumnThumbImg={["thumb_img"]}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSorting={handleChangeSorting}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Ad;
