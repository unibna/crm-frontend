// Libraries
import { useEffect, useContext, useState, useMemo } from "react";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import map from "lodash/map";

// Services
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";

// Context
import { StoreDashboardMkt } from "views/DashboardMKTView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";
import { AttributeContext } from "contexts/AttributeContext";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { SortType } from "_types_/SortType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { ReportByDateType } from "_types_/ReportRevenueType";

// Constants
import {
  actionType,
  arrAttachUnitVnd,
  summaryColumnReportByDate,
} from "views/DashboardView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { excludeContentAdsStartWith } from "views/DashboardMKTView/constants";
interface Props {
  params?: {
    date_from: string;
    date_to: string;
    exclude_content_ads_start_with: string[]
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

const TableReportByDate = (props: Props) => {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
      exclude_content_ads_start_with: excludeContentAdsStartWith
    },
    isInView = false,
  } = props;
  const { newCancelToken } = useCancelToken();
  const { state: store, dispatch: dispatchStore } = useContext(StoreDashboardMkt);
  const { convertDescription, convertTitle } = useContext(AttributeContext);
  const { reportByDate } = store;

  // State
  const [data, setData] = useState<ReportByDateType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [totalRow, setTotalRow] = useState({});

  useEffect(() => {
    if (isInView) {
      getListReportByDate({
        date_from: format(subDays(new Date(), 7), yyyy_MM_dd),
        date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
      });
    }
  }, [isInView]);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsAll, isRefresh]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to"]);

    if (isInView) {
      getListReportByDate(newParams);
    }
  };

  const getListReportByDate = async (params: any) => {
    if (params) {
      setLoading(true);

      const result = await dashboardMkt.get<MultiResponseType<any>>(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        `report/date/v2/`
      );

      if (result && result.data) {
        const { results = [], count = 0, total = {} } = result.data;
        const newData = (results || []).map((item: any) => {
          return {
            ...item,
          };
        });

        setData(newData);
        setDataTotal(count);
        setTotalRow(total);
      }

      setLoading(false);
    }
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_REPORT_BY_DATE,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_REPORT_BY_DATE,
      payload: column,
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_REPORT_BY_DATE,
      payload: columns,
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const renderHeader = () => {
    return <HeaderFilter columns={reportByDate} onChangeColumn={handleChangeColumn} />;
  };

  const newResultColumnsShow = useMemo(() => {
    return map(reportByDate.resultColumnsShow, (item) => ({
      ...item,
      description: convertDescription(item.name) || item.description,
      title: convertTitle(item.name) || item.title,
    }));
  }, [reportByDate.resultColumnsShow]);

  return (
    <DataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      totalSummaryRow={totalRow}
      summaryDataColumns={summaryColumnReportByDate}
      columns={newResultColumnsShow}
      columnWidths={reportByDate.columnsWidthResize}
      isLoadingTable={isLoading}
      isShowListToolbar={true}
      contentColumnShowInfo={{
        arrColumnShowInfo: [
          "date",
          "revenue",
          "order_count",
          "return_rate",
          "revenue_crm",
          "revenue_offline",
          "revenue_livestream",
          "revenue_ecom",
          "revenue_ads",
          "revenue_per_order",
          "total_spend",
          "fb_spend",
          "gg_spend",
          "tt_spend",
          "lead_assigned",
          "lead_done",
          "lead_qualified",
          "lead_buy",
          "lead_buy_rate",
          "lead_qualified_rate",
          "ads_phone",
          "ads_qualified_rate",
          "ads_buy_rate",
          "total_spend_per_revenue_ads",
          "total_spend_per_revenue",
          "total_spend_per_ads_qualified",
          "ads_qualified",
          "provisional_revenue"
        ],
        infoCell: reportByDate.columnsShow,
      }}
      arrAttachUnitVnd={arrAttachUnitVnd}
      arrDate={["date"]}
      arrAttachUnitPercent={[
        "lead_buy_rate",
        "lead_qualified_rate",
        "ads_qualified_rate",
        "ads_buy_rate",
        "total_spend_per_revenue_ads",
        "total_spend_per_revenue",
        "return_rate",
      ]}
      isHeightCustom={data.length < 10}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      handleSorting={handleChangeSorting}
    />
  );
};

export default TableReportByDate;
