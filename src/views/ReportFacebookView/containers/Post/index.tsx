// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";

// Constants
import {
  actionType,
  dataRenderHeaderShare,
  arrAttachUnitVnd,
  arrAttachUnitPercent,
  columnShowPostDetail,
  summaryColumnPost,
  summaryColumnPostDetail,
  arrTakeValueParamsHeader,
} from "views/ReportFacebookView/constants";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-spend",
  },
  dataTotal: 0,
  totalRow: {},
};

const storePost = (state: InitialStateReport, action: any) => {
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
    }
  }
};

const Post = () => {
  const [state, dispatch] = useReducer(storePost, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { adAccount, campaign, adset, post, params: paramsStore } = store;

  const { data, loading, params, dataTotal, totalRow } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        ad_account_id: adAccount.columnSelected,
        campaign_id: campaign.columnSelected,
        adset_id: adset.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "effective_status",
        "objective",
        "ad_account_id",
        "campaign_id",
        "adset_id",
      ]
    );

    getListFacebookPost(objParams);
  };

  const getListFacebookPost = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result: any = await facebookApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/marketing/post/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { post_id, picture, message, page_name } = item;

          return {
            ...item,
            id: post_id,
            searchName: page_name,
            page_name,
            thumb_img: {
              url: picture,
              body: message,
              id: post_id,
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
          loading: false,
        },
      });
    }
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

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_POST,
      payload: column,
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_POST,
      payload: {
        columnsWidthResize: value,
      },
    });
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
      "effective_status",
      "objective",
      ...arrTakeValueParamsHeader,
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        columnsCount={post.countShowColumn}
        originColumns={post.columnsShow}
        params={newParamsStore}
        dataExport={data}
        columnShowExport={columnShowExport}
        dataRenderHeader={dataRenderHeaderShare}
        arrAttachUnitPercent={["rate_post_comments_phone"]}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const newParams = handleParamsApi(
      {
        ...paramsStore,
        post_id: row.post_id,
        ad_account_id: adAccount.columnSelected,
        campaign_id: campaign.columnSelected,
        adset_id: adset.columnSelected,
      },
      [
        "date_from",
        "date_to",
        "post_id",
        "effective_status",
        "objective",
        "ad_account_id",
        "campaign_id",
        "adset_id",
      ]
    );

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          host={facebookApi}
          params={{ ...newParams, dimension: "date", ordering: "" }}
          columnShowDetail={columnShowPostDetail}
          summaryDataColumns={summaryColumnPostDetail}
          arrAttachUnitVnd={arrAttachUnitVnd}
          arrAttachUnitPercent={arrAttachUnitPercent}
          endpoint="marketing/post/"
        />
      </TabWrap>
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
      totalSummaryRow={totalRow}
      listTabDetail={["by_date"]}
      summaryDataColumns={summaryColumnPost}
      arrAttachUnitVnd={arrAttachUnitVnd}
      arrAttachUnitPercent={arrAttachUnitPercent}
      arrColumnThumbImg={["thumb_img"]}
      isLoadingTable={loading}
      renderHeader={renderHeader}
      renderTableDetail={renderTableDetail}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Post;
