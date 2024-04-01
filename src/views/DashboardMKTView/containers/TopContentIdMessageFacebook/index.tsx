// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import { useNavigate } from "react-router-dom";
import axios, { CancelTokenSource } from "axios";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { StoreDashboardMkt } from "views/DashboardMKTView/contextStore";

// Components
import DDataGrid from "components/DDataGrid";
import { TabWrap } from "components/Tabs";
import TableDetail from "components/DDataGrid/components/TableDetail";

// Types
import { SortType } from "_types_/SortType";
import { InitialStateReport } from "_types_/FacebookType";

// Constants
import {
  actionType,
  summaryColumnFacebookContentIdMessage,
  columnShowFacebookContentIdFilterMessageDetailTargeting,
  summaryColumnFacebookContentIdMessageDetailTargeting,
} from "views/DashboardMKTView/constants";
import { handleParamsApi } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { PATH_DASHBOARD } from "routes/paths";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { objectiveFacebook } from "constants/index";
import { fPercent } from "utils/formatNumber";
import { ROLE_TAB, STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { valueFilterObjective } from "views/ReportContentIdView/constants";
interface Props {
  params?: {
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 500,
    ordering: "-spend",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeTopContentIdMessageFacebook = (state: InitialStateReport, action: any) => {
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

let cancelRequest: CancelTokenSource;

const TopContentIdMessageFacebook = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const [state, dispatch] = useReducer(storeTopContentIdMessageFacebook, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboardMkt);
  const { topContentIdFacebookMessage } = store;
  const navigate = useNavigate();

  const { data, loading, params, dataTotal, totalRow } = state;

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      loadDataTable();
    }
  }, [params, paramsAll, isRefresh, isInView]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
      objective: objectiveFacebook.MESSAGES,
    };

    const newParams = handleParamsApi(objParams, ["date_from", "date_to", "objective"]);

    getListFacebookContentId(newParams);
  };

  const getListFacebookContentId = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      if (cancelRequest) {
        cancelRequest.cancel();
      }

      cancelRequest = axios.CancelToken.source();

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: cancelRequest.token,
        },
        "facebook/content-id/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { total_qualified, total_phone, total_processing } = item;

          return {
            ...item,
            thumb_img: {
              id: getObjectPropSafely(() => item.post_id),
              url: getObjectPropSafely(() => item.thumbnail_url),
              body: getObjectPropSafely(() => item.body),
            },
            total_qualified: `${total_qualified} (${total_processing}) - ${fPercent(
              total_qualified / total_phone
            )} `,
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

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_MESSAGE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_MESSAGE,
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

  const handleWatchDetail = () => {
    navigate(`/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID][STATUS_ROLE_CONTENT_ID.FACEBOOK]}`, {
      state: valueFilterObjective.MESSAGES,
    });
  };

  const handleFormatSummary = (columnName: string | number, totalRow: Partial<any>) => {
    const { total_phone, total_qualified, total_processing } = totalRow;

    return `${total_qualified} (${total_processing || 0}) - ${fPercent(
      total_qualified / total_phone
    )} `;
  };

  const renderTableDetail = (row: any, value: number) => {
    const newParams = handleParamsApi(
      {
        ...params,
        ...paramsAll,
        ad_name: row.ad_name,
        objective: ["MESSAGES"],
      },
      ["date_from", "date_to", "objective", "ad_name"]
    );

    const handleDataApi = (item: any) => {
      const { total_qualified, total_phone, total_processing } = item;

      return {
        total_qualified: `${total_qualified} (${total_processing}) - ${fPercent(
          total_qualified / total_phone
        )} `,
      };
    };

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          isFullRow
          host={reportMarketing}
          params={{ ...newParams }}
          columnShowDetail={columnShowFacebookContentIdFilterMessageDetailTargeting}
          summaryDataColumns={summaryColumnFacebookContentIdMessageDetailTargeting}
          arrAttachUnitVnd={["cost_per_total_qualified", "spend"]}
          contentSummary={{
            arrFormatSummaryOptional: ["total_qualified"],
            handleFormatSummary,
          }}
          endpoint="facebook/targeting/"
          handleDataApi={handleDataApi}
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return topContentIdFacebookMessage.resultColumnsShow.map((item) => item.name);
  }, [topContentIdFacebookMessage.resultColumnsShow]);

  return (
    <DDataGrid
      wrapContainerType="card"
      data={data}
      dataTotal={dataTotal}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnFacebookContentIdMessage}
      columns={topContentIdFacebookMessage.resultColumnsShow}
      columnWidths={topContentIdFacebookMessage.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={false}
      styleHeaderTable={{ justifyContent: "space-between" }}
      arrAttachUnitVnd={["spend", "cost_per_total_qualified"]}
      contentSummary={{
        arrFormatSummaryOptional: ["total_qualified"],
        handleFormatSummary,
      }}
      arrColumnThumbImg={["thumb_img"]}
      renderTableDetail={renderTableDetail}
      titleHeaderTable="Top tin nhắn Facebook"
      isFullTable
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      handleWatchDetail={handleWatchDetail}
    />
  );
};

export default TopContentIdMessageFacebook;
