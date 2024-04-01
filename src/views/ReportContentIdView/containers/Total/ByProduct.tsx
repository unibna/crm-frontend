// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import map from "lodash/map";
import filter from "lodash/filter";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { ContentIdContext } from "views/ReportContentIdView/context";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

// Components
import Grid from "@mui/material/Grid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import LineChart from "components/Charts/LineChart";
import TableDetail from "components/DataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";
import TableDetailByDate from "views/ReportContentIdView/components/TableDetailByDate";

// Types
import { SortType } from "_types_/SortType";
import { ContentIdTotalType } from "_types_/ContentIdType";

// Constants
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import {
  funcDataRenderHeaderDefault,
  OBJECTIVE,
  propsTableDefault,
  handleDataQualified,
  paramsGetDefault,
  summaryColumnDefault,
  arrColumnShowInfo,
  handleDataChart,
  campaignObjective,
} from "views/ReportContentIdView/constants";
import {
  columnShowContentIdTotalByContentIDDetailByDate,
  columnShowContentIdTotalByProductDetailObjective,
  columnShowContentIdTotalByProductDetailTeam,
  columnShowContentTotalDefault,
} from "views/ReportContentIdView/constants/total";

const TotalByProduct = () => {
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const { [STATUS_ROLE_CONTENT_ID.TOTAL_BY_PRODUCT]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentIdTotalType[]>([]);
  const [dataChart, setDataChart] = useState<ContentIdTotalType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [isLoadingChart, setLoadingChart] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-total_expense" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const params = handleParamsApi(
      {
        ...paramsStore,
        limit: 1000,
      },
      [...paramsGetDefault, "digital_fb", "digital_gg", "campaign_objective"]
    );

    getDataChart(params);
  }, [paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        dimension: "product",
      },
      [...paramsGetDefault, "digital_fb", "digital_gg", "campaign_objective", "dimension"]
    );

    getListContentIdTotalByProduct(objParams);
  };

  const getDataChart = async (params: any) => {
    setLoadingChart(true);

    const result = await reportMarketing.get<ContentIdTotalType>(
      {
        ...params,
      },
      "aggregated/date/"
    );

    if (result.data) {
      const { results = [] } = result.data;
      const newResults: any = map(results, (item: ContentIdTotalType) => {
        return {
          ...item,
          ...handleDataChart(item),
        };
      });

      setDataChart(newResults || []);
    }

    setLoadingChart(false);
  };

  const getListContentIdTotalByProduct = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "aggregated/pivot/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            ...handleDataQualified(item),
          };
        });

        setData(newData || []);
        setDataTotal(count);
        setTotalRow(total);
      }

      setLoadingTable(false);
    }
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleFilter = (paramsProps: any) => {
    setParams({
      ...params,
      page: 1,
    });

    updateParams(paramsProps);
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApi = (item: any) => {
      return {
        campaign_objective: OBJECTIVE[item.campaign_objective as keyof typeof OBJECTIVE],
        ...handleDataQualified(item),
      };
    };

    const newParams = handleParamsApi(
      {
        ...paramsStore,
        product: row.product,
        cancelToken: newCancelToken(),
      },
      filter(
        [...paramsGetDefault, "digital_fb", "digital_gg", "campaign_objective"],
        (item) => item !== "cpa_ranking"
      )
    );

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetailByDate
            params={{ ...newParams, ordering: "-created_date" }}
            columns={columnShowContentIdTotalByContentIDDetailByDate}
            endpoint="aggregated/date/"
            handleDataApi={handleDataQualified}
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <TableDetail
            {...propsTableDefault}
            isFullTable={isShowFullTable}
            host={reportMarketing}
            params={{
              ...newParams,
              dimension: "team",
            }}
            columnShowDetail={columnShowContentIdTotalByProductDetailTeam}
            contentColumnShowInfo={{
              arrColumnShowInfo: arrColumnShowInfo,
              infoCell: columnShowContentIdTotalByProductDetailTeam.columnShowTable,
            }}
            summaryDataColumns={summaryColumnDefault}
            endpoint="aggregated/pivot/"
            handleDataApi={handleDataApi}
          />
        </TabWrap>
        <TabWrap value={value} index={2}>
          <TableDetail
            {...propsTableDefault}
            isFullTable={isShowFullTable}
            host={reportMarketing}
            params={{
              ...newParams,
              dimension: "campaign_objective",
            }}
            columnShowDetail={columnShowContentIdTotalByProductDetailObjective}
            contentColumnShowInfo={{
              arrColumnShowInfo: arrColumnShowInfo,
              infoCell: columnShowContentIdTotalByProductDetailObjective.columnShowTable,
            }}
            summaryDataColumns={summaryColumnDefault}
            endpoint="aggregated/pivot/"
            handleDataApi={handleDataApi}
          />
        </TabWrap>
      </>
    );
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      ...paramsGetDefault,
      "digital_fb",
      "digital_gg",
      "campaign_objective",
      "dateValue",
    ]);
  }, [paramsStore]);

  const optionFilterChart = useMemo(() => {
    return map(columnShowContentTotalDefault.columnsShowHeader, (item) => ({
      value: item.name,
      label: item.title,
    }));
  }, []);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        title: "Mục tiêu Campaign",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          ...campaignObjective,
        ],
        label: "campaign_objective",
        defaultValue: "all",
      },
      ...funcDataRenderHeaderDefault(filterContentId),
    ];

    return (
      <HeaderFilter
        {...propsTableDefault}
        contentOptional={null}
        isShowPopupFilter={false}
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "ad_name",
            label: "Nhập content ID",
          },
        ]}
        params={newParamsStore}
        dataExport={data}
        dataRenderHeader={dataRenderHeader}
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_CONTENT_ID.TOTAL_BY_PRODUCT, columns)}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <LineChart
          title="Content ID Tổng"
          data={dataChart}
          keyFilter="created_date"
          defaultFilter={{
            filterOne: "Tổng chi phí",
            filterTwo: "Tổng doanh thu",
          }}
          isLoading={isLoadingChart}
          optionsFilter={optionFilterChart}
          arrAttachUnitPercent={[
            "total_buy_rate_processed",
            "buy_rate",
            "total_expense_per_total_revenue",
          ]}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <DataGrid
          {...propsTableDefault}
          isFullTable={isShowFullTable}
          data={data}
          dataTotal={dataTotal}
          page={params.page}
          pageSize={params.limit}
          columns={columns.resultColumnsShow}
          totalSummaryRow={totalRow}
          columnWidths={columns.columnsWidthResize}
          summaryDataColumns={summaryColumnDefault}
          isLoadingTable={isLoadingTable}
          listTabDetail={["by_date", "by_team", "by_objective"]}
          renderHeader={renderHeader}
          renderTableDetail={renderTableDetail}
          contentColumnShowInfo={{
            arrColumnShowInfo: arrColumnShowInfo,
            infoCell: columns.columnsShow,
          }}
          handleChangeRowsPerPage={(rowPage: number) =>
            setParams({
              ...params,
              limit: rowPage,
              page: 1,
            })
          }
          handleChangePage={(page: number) => setParams({ ...params, page })}
          setColumnWidths={(columns) =>
            resizeColumn(STATUS_ROLE_CONTENT_ID.TOTAL_BY_PRODUCT, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_ID.TOTAL_BY_PRODUCT, columns)
          }
          handleSorting={handleChangeSorting}
        />
      </Grid>
    </Grid>
  );
};

export default TotalByProduct;
