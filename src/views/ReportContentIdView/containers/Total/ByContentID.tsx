// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import reduce from "lodash/reduce";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";

// Context
import { ContentIdContext } from "views/ReportContentIdView/context";
import { useCancelToken } from "hooks/useCancelToken";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import LineChart from "components/Charts/LineChart";
import { TabWrap } from "components/Tabs";
import TableDetailByOverview from "views/ReportContentIdView/components/TableDetailByOverview";
import TabDetailByPhone from "views/ReportContentIdView/components/TableDetailByPhone";
import TabDetailByCampaign from "views/ReportContentIdView/components/TableDetailByCampaign";
import ContentNote from "views/ReportContentIdView/components/ContentNote";
import ContentByDate from "views/ReportContentIdView/components/ContentByDate";
import { Span } from "components/Labels";
import Iconify from "components/Icons/Iconify";

// Types
import { FBReportType } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { ContentIdTotalType } from "_types_/ContentIdType";

// Constants
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import {
  arrColumnShowInfo,
  colorLabelStatus,
  summaryColumnDefault,
  paramsGetDefault,
  handleFormatSummaryDefault,
  arrFormatSummaryOptionalDefault,
  propsTableDefault,
  handleDataQualified,
  funcDataRenderHeaderDefault,
  TAB_HEADER_DETAIL_BY_PHONE_TOTAL,
  headerFilterStatusStage,
  handleDataChart,
  arrAttachUnitVnd,
  campaignObjective,
  ADS_TYPE_OPTIONS,
  CONTENT_TYPE_OPTIONS,
  ADS_TYPE,
  PERFORM_ADS_OPTIONS,
} from "views/ReportContentIdView/constants";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import {
  columnShowContentTotalDefault,
  columnShowContentIdTotalByCampainObjective,
  columnShowContentIdTotalByAdgroupObjective,
} from "views/ReportContentIdView/constants/total";
import PieChart from "components/Charts/PieChart";

export interface PerformAdsType {
  by: ADS_TYPE | "Chưa có";
  total_impressions: number;
  total_revenue: number;
  total_expense: number;
  total_phone: number;
  total_qualified: number;
}

const TotalByContentId = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const { [STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentIdTotalType[]>([]);
  const [dataChart, setDataChart] = useState<ContentIdTotalType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [isLoadingChart, setLoadingChart] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-total_expense" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");

  const [performAds, setPerformAds] = useState<{
    filter: string;
    data: PerformAdsType[];
    totalData: Partial<PerformAdsType>;
  }>({
    filter: "total_expense",
    data: [],
    totalData: {},
  });

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, filterContentId.dataAttributeRule]);

  useEffect(() => {
    const params = handleParamsApi(
      {
        ...paramsStore,
        limit: 1000,
      },
      [
        ...paramsGetDefault,
        "digital_fb",
        "digital_gg",
        "campaign_objective",
        "ads_type",
        "content_type",
        "status",
      ]
    );

    getDataChart(params);
  }, [paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
      },
      [
        ...paramsGetDefault,
        "digital_fb",
        "digital_gg",
        "campaign_objective",
        "ads_type",
        "content_type",
        "status",
      ]
    );
    getListContentIdTotalByContentId(objParams);
    getTrackingTime();
  };

  const getTrackingTime = async () => {
    const result: any = await dashboardMkt.get(
      {
        task: "content_id",
      },
      "tracking/time/"
    );

    if (result && result.data) {
      const { last_update_at } = result.data;
      setLastUpdatedAt(last_update_at);
    }
  };

  const getDataChart = async (params: any) => {
    setLoadingChart(true);

    const result = await reportMarketing.get<FBReportType>(
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

  const getListContentIdTotalByContentId = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "aggregated/content-id/"
      );

      if (result?.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: ContentIdTotalType) => {
          const arrClassification = getObjectPropSafely(() =>
            Object.keys(item?.classification || {})
          );

          const adsType = ADS_TYPE_OPTIONS.find((ads) => ads.value === item.ads_type);
          return {
            ...item,
            ads_type: adsType ? (
              <Span style={{ backgroundColor: adsType.color, color: "#000", fontWeight: "unset" }}>
                {adsType.value}
              </Span>
            ) : undefined,
            content_type: (
              <Stack spacing={1}>
                {Array.isArray(item?.content_type) &&
                  item?.content_type?.map((item, idx) => {
                    const contentType = CONTENT_TYPE_OPTIONS.find(
                      (content) => content.value === item
                    );
                    return contentType ? (
                      <Span
                        key={idx}
                        style={{
                          backgroundColor: contentType.color,
                          color: "#000",
                          fontWeight: "unset",
                        }}
                      >
                        {contentType.value}
                      </Span>
                    ) : undefined;
                  })}
              </Stack>
            ),
            thumb_img_content_id: getObjectPropSafely(() => item.thumbnails),
            ad_name_show: {
              value: item.ad_name,
              content: (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Link
                    href={getObjectPropSafely(() => item.drive_url)}
                    variant={"body2"}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    sx={{ cursor: "pointer" }}
                  >
                    {item.ad_name}
                  </Link>
                  <Tooltip
                    title={`Chiến dịch ${item.campaign_status ? "đang chạy" : "ngưng chạy"}`}
                  >
                    <Box>
                      <Iconify
                        icon={
                          item.campaign_status ? "eva:checkmark-circle-fill" : "eva:clock-outline"
                        }
                        sx={{
                          width: 20,
                          height: 20,
                          color: "success.main",
                          ...(!item.campaign_status && { color: "warning.main" }),
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Stack>
              ),
            },
            status: {
              value: item.status,
              color:
                colorLabelStatus[item?.status?.trim() as keyof typeof colorLabelStatus] ||
                "default",
            },
            classification: {
              value: map(arrClassification, (current) => current).join(","),
              content: (
                <Stack spacing={1}>
                  {map(arrClassification, (current) => (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" component="span">
                        {current}
                      </Typography>
                      <Chip
                        size="small"
                        label={getObjectPropSafely(() => item?.classification?.[current])}
                        sx={{
                          backgroundColor: find(
                            filterContentId.dataAttributeRule,
                            (option) => option.name === current
                          )?.colorcode,
                          color: "#fff",
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>
              ),
            },
            ...handleDataQualified(item),
          };
        });

        setData(newData || []);
        setDataTotal(count);
        setTotalRow(total);
        //chart
        handleChartData(results);
      }
      console.log("isloading => ");

      setLoadingTable(false);
    }
  };

  const handleChartData = (data: ContentIdTotalType[]) => {
    let dataChartObj: Partial<{ [key in ADS_TYPE]: PerformAdsType }> = {};
    let totalDataChart: Partial<PerformAdsType> = {};

    map(data, (item, idx) => {
      const type = item.ads_type || ADS_TYPE.NONE;
      //
      const prevExpense = dataChartObj[type]?.total_expense || 0;
      const curExpense = item.total_expense || 0;
      //
      const prevImpressions = dataChartObj[type]?.total_impressions || 0;
      const curImpressions = item.total_impressions || 0;
      //
      const prevPhone = dataChartObj[type]?.total_phone || 0;
      const curPhone = item.total_phone || 0;
      //
      const prevQualified = dataChartObj[type]?.total_qualified || 0;
      const curQualified = item.total_qualified || 0;
      //
      const prevRevenue = dataChartObj[type]?.total_revenue || 0;
      const curRevenue = item.total_revenue || 0;

      if (type !== ADS_TYPE.NONE) {
        dataChartObj = {
          ...dataChartObj,
          [type]: {
            by: type,
            total_expense: prevExpense + curExpense,
            total_impressions: prevImpressions + curImpressions,
            total_phone: prevPhone + curPhone,
            total_qualified: prevQualified + curQualified,
            total_revenue: prevRevenue + curRevenue,
          },
        };
      } else {
        dataChartObj = {
          ...dataChartObj,
          [ADS_TYPE.NONE]: {
            by: ADS_TYPE.NONE,
            total_expense: prevExpense + curExpense,
            total_impressions: prevImpressions + curImpressions,
            total_phone: prevPhone + curPhone,
            total_qualified: prevQualified + curQualified,
            total_revenue: prevRevenue + curRevenue,
          },
        };
      }

      //tính tổng
      const prevTotalExpense = totalDataChart.total_expense || 0;
      const prevTotalImpressions = totalDataChart.total_impressions || 0;
      const prevTotalPhone = totalDataChart.total_phone || 0;
      const prevTotalQualified = totalDataChart.total_qualified || 0;
      const prevTotalRevenue = totalDataChart.total_revenue || 0;

      totalDataChart = {
        total_expense: prevTotalExpense + curExpense,
        total_impressions: prevTotalImpressions + curImpressions,
        total_phone: prevTotalPhone + curPhone,
        total_qualified: prevTotalQualified + curQualified,
        total_revenue: prevTotalRevenue + curRevenue,
      };
    });

    const dataChart: PerformAdsType[] = reduce(
      Object.keys(dataChartObj),
      (prev, cur) => {
        return [...prev, { by: cur, ...dataChartObj[cur] }];
      },
      []
    );

    setPerformAds((prev) => ({ ...prev, data: dataChart, totalData: totalDataChart }));
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
    const newParams = handleParamsApi(
      {
        ...paramsStore,
        ad_name: getObjectPropSafely(() => row.ad_name_show.value),
        product: row.product,
        cancelToken: newCancelToken(),
      },
      filter(
        [
          ...paramsGetDefault,
          "digital_fb",
          "digital_gg",
          "campaign_objective",
          "ads_type",
          "content_type",
          "status",
          "ad_name",
        ],
        (item) => item !== "cpa_ranking"
      )
    );

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetailByOverview
            params={{ ...newParams }}
            arrShowCampaignObjective={["ggl", "con", "mes"]}
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <ContentByDate params={newParams} summaryData={summaryColumnDefault} />
        </TabWrap>
        <TabWrap value={value} index={2}>
          <TabDetailByPhone
            params={{ ...newParams }}
            tabHeaderDetail={TAB_HEADER_DETAIL_BY_PHONE_TOTAL}
          />
        </TabWrap>
        <TabWrap value={value} index={3}>
          <TabDetailByCampaign
            params={{ ...newParams }}
            endpoint="aggregated/pivot/"
            columns={columnShowContentIdTotalByCampainObjective}
          />
        </TabWrap>
        <TabWrap value={value} index={4}>
          <TabDetailByCampaign
            params={{ ...newParams }}
            endpoint="aggregated/pivot/"
            dimension={["adgroup_name"]}
            columns={columnShowContentIdTotalByAdgroupObjective}
          />
        </TabWrap>
        <TabWrap value={value} index={5}>
          <ContentNote contentId={getObjectPropSafely(() => row.ad_name_show.value)} />
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
      "ads_type",
      "content_type",
      "status",
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
      {
        style: {
          width: 200,
        },
        title: "Loại Ads",
        options: [{ label: "Tất cả", value: "all" }, ...ADS_TYPE_OPTIONS],
        label: "ads_type",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        title: "Loại Content",
        options: [{ label: "Tất cả", value: "all" }, ...CONTENT_TYPE_OPTIONS],
        label: "content_type",
        defaultValue: "all",
      },
      {
        style: {
          width: 200,
        },
        title: "Trạng thái",
        options: headerFilterStatusStage,
        label: "status",
        defaultValue: headerFilterStatusStage[0].value,
        renderOptionTitleFunc: ({ option }: any) => (
          <>
            {option.value !== "all" ? (
              <Span
                variant="ghost"
                color={
                  colorLabelStatus[option?.label?.trim() as keyof typeof colorLabelStatus] ||
                  "default"
                }
              >
                {option.label}
              </Span>
            ) : (
              <Typography variant="body2">{option.label}</Typography>
            )}
          </>
        ),
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
        onChangeColumn={(columns) =>
          updateCell(STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID, columns)
        }
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{
        "& > .MuiGrid-root > .MuiGrid-root , & .MuiPaper-root": {
          height: "100%",
        },
      }}
    >
      <Grid item xs={12} lg={8}>
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
          arrAttachUnitVnd={arrAttachUnitVnd}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <PieChart
          title="Nhóm mục tiêu quảng cáo"
          data={performAds.data}
          defaultFilter={{ filterOne: performAds.filter }}
          keyFilter="by"
          totalData={performAds.totalData}
          // optionsFilter={ADS_TYPE_OPTIONS}
          optionsFilterData={PERFORM_ADS_OPTIONS}
          isLoading={isLoadingTable}
          handleChangeFilterData={(value) => setPerformAds((prev) => ({ ...prev, filter: value }))}
          styleFilter={{ width: 170 }}
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
          lastUpdatedAt={lastUpdatedAt}
          leftColumns={["content_id"]}
          tableContainerProps={{
            sx: {
              px: 2,
              border: "none",
              "& .MuiTableCell-root.TableFixedCell-fixedCell": {
                left: 0,
                zIndex: 3,
              },
              "& .MuiTableCell-head.TableFixedCell-fixedCell": {
                background: theme.palette.mode === "light" ? "#F4F6F8" : "#919eab29",
              },
            },
          }}
          listTabDetail={["overview", "by_date", "by_phone", "campaign", "adgroup", "note"]}
          contentColumnShowInfo={{
            arrColumnShowInfo: arrColumnShowInfo,
            infoCell: columns.columnsShow,
          }}
          contentSummary={{
            arrFormatSummaryOptional: arrFormatSummaryOptionalDefault,
            handleFormatSummary: (columnName: string | number, totalRow: Partial<any>) =>
              handleFormatSummaryDefault(columnName, totalRow, {
                dataAttributeRule: filterContentId.dataAttributeRule,
              }),
          }}
          renderHeader={renderHeader}
          renderTableDetail={renderTableDetail}
          handleSorting={handleChangeSorting}
          handleChangeRowsPerPage={(rowPage: number) =>
            setParams({
              ...params,
              limit: rowPage,
              page: 1,
            })
          }
          handleChangePage={(page: number) => setParams({ ...params, page })}
          setColumnWidths={(columns) =>
            resizeColumn(STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID, columns)
          }
        />
      </Grid>
    </Grid>
  );
};

export default TotalByContentId;
