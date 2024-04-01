import { reportMarketing } from "_apis_/marketing/report_marketing.api";
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import DDataGrid from "components/DDataGrid";
import { objectiveTiktok } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import { fPercent } from "utils/formatNumber";
import { chooseParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  actionType,
  summaryColumnTiktokContentIdConversation,
} from "views/DashboardView/constants";
import { StoreDashboard } from "views/DashboardView/contextStore";
import { valueFilterObjective } from "views/ReportContentIdView/constants";

interface Props {
  params?: { date_from: string; date_to: string };
  isRefresh?: boolean;
  isInView?: boolean;
}

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: { page: 1, limit: 10, ordering: "-spend" },
  dataTotal: 0,
  totalRow: {},
};

const storeTopContentIdTiktok = (state: InitialStateReport, action: any) => {
  if (action?.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return { ...state, ...payload };
      }
      case actionType.UPDATE_DATA_TOTAL: {
        return { ...state, ...payload };
      }
      case actionType.UPDATE_LOADING: {
        return { ...state, ...payload };
      }
      case actionType.UPDATE_PARAMS: {
        return { ...state, params: { ...state.params, ...payload } };
      }
      case actionType.UPDATE_TOTAL_ROW: {
        return { ...state, ...payload };
      }
    }
  }
};

const TopContentIdConversationTiktok = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const [state, dispatch] = useReducer(storeTopContentIdTiktok, initState);
  const { newCancelToken } = useCancelToken();
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboard);
  const { topContentIdTiktokConversation } = store;
  const navigate = useNavigate();

  const { data, loading, params, dataTotal, totalRow } = state;

  const getListTiktokContentId = useCallback(
    async (params: any) => {
      if (params) {
        dispatch({ type: actionType.UPDATE_LOADING, payload: { loading: true } });

        const result: any = await reportMarketing.get(
          { ...params, cancelToken: newCancelToken() },
          "tiktok/content-id/"
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
                title: item.ad_name,
              },
              total_qualified: `${total_qualified} (${total_processing}) - ${fPercent(
                total_qualified / total_phone
              )} `,
            };
          });

          dispatch({ type: actionType.UPDATE_DATA, payload: { data: newData } });

          dispatch({ type: actionType.UPDATE_DATA_TOTAL, payload: { dataTotal: count } });

          dispatch({ type: actionType.UPDATE_TOTAL_ROW, payload: { totalRow: total } });
        }

        dispatch({ type: actionType.UPDATE_LOADING, payload: { loading: false } });
      }
    },
    [newCancelToken]
  );

  const loadDataTable = useCallback(() => {
    const objParams = {
      ...params,
      ...paramsAll,
      objective: objectiveTiktok.CONVERSIONS,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to", "objective"]);

    if (isInView) {
      getListTiktokContentId(newParams);
    }
  }, [getListTiktokContentId, isInView, params, paramsAll]);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsAll, isRefresh, isInView, loadDataTable]);

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_TOP_CONTENT_ID_TIKTOK_CONVERSATION,
      payload: { columnsWidthResize: value },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_TIKTOK_CONVERSATION,
      payload: { columnsOrder: columns },
    });
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: { page },
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: { limit: rowPage, page: 1 },
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: { ordering },
    });
  };

  const handleWatchDetail = () => {
    navigate(`/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID][STATUS_ROLE_CONTENT_ID.TIKTOK]}`, {
      state: valueFilterObjective.CONVERSIONS,
    });
  };

  const handleFormatSummary = (columnName: string | number, totalRow: Partial<any>) => {
    const { total_phone, total_qualified, total_processing } = totalRow;

    return `${total_qualified} (${total_processing || 0}) - ${fPercent(
      total_qualified / total_phone
    )} `;
  };

  const columnOrders = useMemo(() => {
    return topContentIdTiktokConversation.resultColumnsShow.map((item) => item.name);
  }, [topContentIdTiktokConversation.resultColumnsShow]);

  return (
    <DDataGrid
      wrapContainerType="card"
      isFullTable
      data={data}
      dataTotal={dataTotal}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnTiktokContentIdConversation}
      columns={topContentIdTiktokConversation.resultColumnsShow}
      columnWidths={topContentIdTiktokConversation.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={false}
      styleHeaderTable={{ justifyContent: "space-between" }}
      arrAttachUnitVnd={["cost_per_phone_qualified", "spend"]}
      contentSummary={{
        // arrFormatSummaryOptional: ["phone_qualified"],
        handleFormatSummary,
      }}
      arrColumnThumbImg={["thumb_img"]}
      titleHeaderTable="Top chuyển đổi Tiktok"
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      handleWatchDetail={handleWatchDetail}
    />
  );
};

export default TopContentIdConversationTiktok;
