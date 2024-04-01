// Libraries
import { useEffect, useReducer, useContext } from "react";
import axios, { CancelTokenSource } from "axios";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
// Components
import { ConfettiContext } from "contexts/ConfettiContext";
import RankingBoardV2 from "components/Ranking/RankingBoardV2";

// Types
import { InitialStateReport } from "_types_/FacebookType";

// Constants
import { actionType } from "views/DashboardSaleView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { orderApi } from "_apis_/order.api";

interface Props {
  params?: {
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
  tableName: string;
  tableIndex: number;
  titleHeaderTable: string;
  propertyOrdering: string;
}

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 100,
    ordering: "-revenue",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeTable = (state: InitialStateReport, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA:
      case actionType.UPDATE_DATA_TOTAL:
      case actionType.UPDATE_LOADING:
      case actionType.UPDATE_PARAMS:
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

const TableRanking = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
    tableName,
    tableIndex,
    titleHeaderTable,
    propertyOrdering,
  } = props;
  const [state, dispatch] = useReducer(storeTable, initState);
  const confettiContext = useContext(ConfettiContext);

  const { data, loading, params, totalRow } = state;

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsAll, isRefresh, isInView]);

  useEffect(() => {
    if (confettiContext) {
      const { isDisableFire, setIsDisableFire } = confettiContext;
      data.length > 0 && !isDisableFire && setIsDisableFire(!isDisableFire);
      data.length === 0 && isDisableFire && setIsDisableFire(!isDisableFire);
    }
  }, [data]);

  useEffect(() => {
    const time = 5 * 60 * 1000;
    const interval = setInterval(() => {
      loadDataTable();
    }, time);
    return () => clearInterval(interval);
  }, []);

  const loadDataTable = () => {
    let objParams = {
      ...params,
      ...paramsAll,
      ordering: `-${propertyOrdering}`,
      dimension: "created_by", // JP24
      // appointment: false, // Han
    };

    objParams.completed_time_from = objParams.date_from;
    objParams.completed_time_to = objParams.date_to;

    const newParams = chooseParams(objParams, [
      // "date_from",
      // "date_to",
      "completed_time_from",
      "completed_time_to",
      "effective_status",
      "objective",
      "appointment",
      "dimension",
    ]);

    if (isInView) {
      getList(newParams);
    }
  };

  const getList = async (params: any) => {
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

      const result: any = await orderApi.get({
        params: {
          ...params,
          cancelToken: cancelRequest.token,
        },
        endpoint: "report/revenue/",
      });

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: results,
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

  return (
    <RankingBoardV2
      titleBoard={titleHeaderTable}
      loading={loading}
      data={data}
      tableIndex={tableIndex}
      propertyOrdering={propertyOrdering}
      total={totalRow}
    />
  );
};
export default TableRanking;
