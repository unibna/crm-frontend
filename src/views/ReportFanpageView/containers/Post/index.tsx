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
import {
  actionType,
  summaryColumnPost,
  dataRenderHeaderShare,
  keyFilter,
} from "views/ReportFanpageView/constants";
import { yyyy_MM_dd } from "constants/time";
import { chooseParams } from "utils/formatParamsUtil";
import { handleParamsHeaderFilter } from "utils/formatParamsUtil";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

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

const storePost = (state: InitialStateReport, action: any) => {
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

const Post = () => {
  const [state, dispatch] = useReducer(storePost, initState);

  const {
    data: { dataTable },
    loading: { isLoadingTable },
    params,
    dataTotalTable,
    totalRow,
  } = state;
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFanpage);
  const { post, params: paramsStore } = store;
  const {
    dataFilter: { dataFilterFanpage },
  } = post;

  useEffect(() => {
    if (dataFilterFanpage.length < 2) {
      getListFacebookFanpage({
        page: 1,
        limit: 200,
        date_from: format(subDays(new Date(), 30), yyyy_MM_dd),
        date_to: format(subDays(new Date(), 1), yyyy_MM_dd),
      });
    }
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = dataTable.map((item: any) => {
      return {
        ...item,
        isCheck: post.columnSelected.length
          ? post.columnSelected.includes(item.campaign_id)
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
  }, [post.columnSelected]);

  const loadDataTable = () => {
    let objParams = {
      ...params,
      ...paramsStore,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to", "post_type", "page_id"]);

    getListFacebookPost({
      ...newParams,
    });
  };

  const getListFacebookPost = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          isLoadingTable: true,
        },
      });
      const result: any = await facebookApi.get(params, "report/fanpage/post/");

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { post_id, body, thumbnail_url } = item;

          return {
            ...item,
            thumb_img: {
              id: post_id,
              url: thumbnail_url,
              body: item.name,
            },
          };
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

  const getListFacebookFanpage = async (params: any) => {
    if (params) {
      const result = await facebookApi.get(params, "fanpages/");

      if (result && result.data) {
        const { results = [] } = result.data;
        const newData = results.map((item: any) => {
          const { page_id, name } = item;

          return {
            value: page_id,
            label: name,
          };
        });

        dispatchStore({
          type: actionType.UPDATE_DATA_FILTER_POST,
          payload: {
            dataFilterFanpage:
              [
                {
                  label: "Tất cả",
                  value: "all",
                },
                ...newData,
              ] || [],
          },
        });
      }
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
      type: actionType.UPDATE_COLUMN_ORDER_POST,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const columnShowExport = useMemo(() => {
    return post.resultColumnsShow.length
      ? post.resultColumnsShow.reduce((prevArr: any, current: any) => {
          return !["thumb_img"].includes(current.name)
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
  }, [post.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "date_from",
      "date_to",
      "post_type",
      "page_id",
      "dateValue",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      ...dataRenderHeaderShare,
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
    ];

    return (
      <HeaderFilter
        columnsCount={post.countShowColumn}
        originColumns={post.columnsShow}
        params={newParamsStore}
        dataExport={dataTable}
        columnShowExport={columnShowExport}
        dataRenderHeader={dataRenderHeader}
        handleFilter={handleFilter}
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
      data={dataTable}
      dataTotal={dataTotalTable}
      page={params.page}
      pageSize={params.limit}
      totalSummaryRow={totalRow}
      columns={post.resultColumnsShow}
      columnWidths={post.columnsWidthResize}
      summaryDataColumns={summaryColumnPost}
      columnOrders={columnOrders}
      isLoadingTable={isLoadingTable}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      arrColumnThumbImg={["thumb_img"]}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSorting={handleChangeSorting}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};

export default Post;
