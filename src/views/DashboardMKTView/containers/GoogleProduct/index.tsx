// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

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
  summaryColumnGoogleProduct,
  columnShowGoogleProductDetailContentId,
  summaryColumnGoogleProductDetailContentId,
} from "views/DashboardMKTView/constants";
import { handleParamsApi } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fPercent } from "utils/formatNumber";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
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
    limit: 10,
    ordering: "-cost",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeGoogleProduct = (state: InitialStateReport, action: any) => {
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

const GoogleProduct = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const [state, dispatch] = useReducer(storeGoogleProduct, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboardMkt);
  const { googleProduct } = store;

  const { data, loading, params, dataTotal, totalRow } = state;

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

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
    };

    const newParams = handleParamsApi(objParams, ["date_from", "date_to"]);

    if (isInView) {
      getListGoogleProduct(newParams);
    }
  };

  const getListGoogleProduct = async (params: any) => {
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
        "google/product/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
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
      type: actionType.RESIZE_COLUMN_GOOGLE_PRODUCT,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_GOOGLE_PRODUCT,
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

  const handleFormatSummary = (columnName: string | number, totalRow: Partial<any>) => {
    const { ladi_qualified, ladi_phone, ladi_processing } = totalRow;

    return `${ladi_qualified} (${ladi_processing || 0}) - ${fPercent(
      ladi_qualified / ladi_phone
    )} `;
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApi = (item: any) => {
      const { ladi_qualified, ladi_phone, ladi_processing } = item;

      return {
        thumb_img: {
          id: "",
          url: getObjectPropSafely(() => item.thumbnails),
          body: "",
        },
        ladi_qualified: `${ladi_qualified} (${ladi_processing}) - ${fPercent(
          ladi_qualified / ladi_phone
        )} `,
      };
    };

    const newParams = handleParamsApi(
      {
        ...params,
        ...paramsAll,
        product_name: row.product_name,
      },
      ["date_from", "date_to", "product_name"]
    );

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          isFullRow
          host={reportMarketing}
          params={{ ...newParams }}
          columnShowDetail={columnShowGoogleProductDetailContentId}
          summaryDataColumns={summaryColumnGoogleProductDetailContentId}
          arrAttachUnitVnd={["cost", "cost_per_total_qualified"]}
          contentSummary={{
            arrFormatSummaryOptional: ["ladi_qualified"],
            handleFormatSummary,
          }}
          arrColumnThumbImg={["thumb_img"]}
          endpoint="google/content-id/"
          handleDataApi={handleDataApi}
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return googleProduct.resultColumnsShow.map((item) => item.name);
  }, [googleProduct.resultColumnsShow]);

  return (
    <DDataGrid
      wrapContainerType="card"
      data={data}
      dataTotal={dataTotal}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnGoogleProduct}
      columns={googleProduct.resultColumnsShow}
      columnWidths={googleProduct.columnsWidthResize}
      columnOrders={columnOrders}
      isLoadingTable={loading}
      isShowListToolbar={false}
      styleHeaderTable={{ justifyContent: "space-between" }}
      arrAttachUnitVnd={[
        "cost",
        "ladi_revenue",
        "cost_per_conversion",
        "cost_per_phone_qualified",
        "cost_per_total_phone",
        "cost_per_total_qualified",
      ]}
      renderTableDetail={renderTableDetail}
      isFullTable
      titleHeaderTable="Mã sản phẩm Google"
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default GoogleProduct;
