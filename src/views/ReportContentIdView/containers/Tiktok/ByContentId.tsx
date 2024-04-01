// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import map from "lodash/map";
import find from "lodash/find";
import { useTheme } from "@mui/material/styles";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { ContentIdContext } from "views/ReportContentIdView/context";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

// Components
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LineChart from "components/Charts/LineChart";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import { TabWrap } from "components/Tabs";
import TableTotalDetail from "views/ReportContentIdView/components/TableDetailByOverview";
import { TableDetailByPhone } from "views/ReportContentIdView/components/TableDetailByPhone";
import { TableDetailByCampaign } from "views/ReportContentIdView/components/TableDetailByCampaign";
import TableDetailByDate from "views/ReportContentIdView/components/TableDetailByDate";

// Types
import { SortType } from "_types_/SortType";
import { ContentIdTiktokType, ContentIdType } from "_types_/ContentIdType";

// Constants
import { fNumber } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import {
  funcDataRenderHeaderDefault,
  paramsGetDefault,
  handleDataQualified,
  propsTableDefault,
  summaryColumnDefault,
  arrColumnShowInfo,
  dataRenderHeaderShareGoogle,
  arrAttachUnitVnd,
} from "views/ReportContentIdView/constants";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import {
  columnShowContentIdTiktokCampaignDetail,
  columnShowContentIdTiktokByDateDetail,
  columnShowContentIdTiktok,
} from "views/ReportContentIdView/constants/tiktok";

const TiktokByContentId = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const { [STATUS_ROLE_CONTENT_ID.TIKTOK_BY_CONTENT_ID]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentIdTiktokType[]>([]);
  const [dataChart, setDataChart] = useState<ContentIdTiktokType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [isLoadingChart, setLoadingChart] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-spend" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});
  const { dataFilterCustomer, dataAttributeRule } = filterContentId;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    loadDataChart();
  }, [paramsStore]);

  const loadDataTable = () => {
    const newParams = chooseParams(
      {
        ...params,
        ...paramsStore,
      },
      [...paramsGetDefault, "customer_id", "effective_status", "objective"]
    );

    getListTiktokContentId(newParams);
  };

  const loadDataChart = () => {
    const newParams = chooseParams(
      {
        ...paramsStore,
        limit: 1000,
      },
      [...paramsGetDefault, "customer_id", "effective_status", "objective"]
    );

    getDataChart(newParams);
  };

  const getListTiktokContentId = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "tiktok/content-id/"
      );
      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = results.map((item: any) => {
          const arrClassification = getObjectPropSafely(() => Object.keys(item.classification));

          return {
            ...item,
            thumb_img_content_id: getObjectPropSafely(() => item.thumbnails),
            engagements: fNumber(item.engagements),
            views: fNumber(item.views),
            clicks: fNumber(item.clicks),
            classification: {
              content: (
                <Stack spacing={1}>
                  {map(arrClassification, (current) => (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" component="span">
                        {current}
                      </Typography>
                      <Chip
                        size="small"
                        label={getObjectPropSafely(() => item.classification[current])}
                        sx={{
                          backgroundColor: find(
                            dataAttributeRule,
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
      }

      setLoadingTable(false);
    }
  };

  const getDataChart = async (params: any) => {
    setLoadingChart(true);

    const result = await reportMarketing.get<ContentIdType>(
      {
        ...params,
      },
      "tiktok/date/"
    );

    if (result.data) {
      const { results = [] } = result.data;

      setDataChart(results || []);
    }

    setLoadingChart(false);
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleFilter = (params: any) => {
    setParams({
      ...params,
      page: 1,
    });

    updateParams(params);
  };

  const handleRefresh = () => {
    loadDataTable();
    loadDataChart();
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      ...paramsGetDefault,
      "digital_gg",
      "customer_id",
      "effective_status",
      "objective",
      "dateValue",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      // ...dataRenderHeaderShareGoogle,
      // {
      //   style: {
      //     width: 200,
      //   },
      //   title: "Tài khoản khách hàng",
      //   options: dataFilterCustomer,
      //   label: "customer_id",
      //   defaultValue: getObjectPropSafely(() => dataFilterCustomer[0].value),
      // },
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
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        params={newParamsStore}
        dataExport={data}
        dataRenderHeader={dataRenderHeader}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={(columns) =>
          updateCell(STATUS_ROLE_CONTENT_ID.TIKTOK_BY_CONTENT_ID, columns)
        }
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const newParams = chooseParams(
      {
        ...paramsStore,
        ad_name: row.ad_name,
        product: row.product,
      },
      [...paramsGetDefault, "customer_id", "effective_status", "objective", "ad_name"]
    );

    return (
      <>
        {/* <TabWrap value={value} index={0}>
          <TableTotalDetail params={{ ...newParams }} arrShowCampaignObjective={["ggl"]} />
        </TabWrap> */}
        <TabWrap value={value} index={0}>
          <TableDetailByDate
            params={{ ...newParams, ordering: "-created_date" }}
            columns={columnShowContentIdTiktokByDateDetail}
            endpoint="tiktok/date/"
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <TableDetailByPhone params={{ ...newParams, type: "TTLADI" }} />
        </TabWrap>
        <TabWrap value={value} index={2}>
          <TableDetailByCampaign
            params={{ ...newParams, ordering: "-spend" }}
            endpoint="tiktok/campaign/"
            columns={columnShowContentIdTiktokCampaignDetail}
          />
        </TabWrap>
      </>
    );
  };

  const optionFilterChart = useMemo(() => {
    return map(columnShowContentIdTiktok.columnsShowHeader, (item) => ({
      value: item.name,
      label: item.title,
    }));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <LineChart
          title="Content ID Tiktok"
          data={dataChart}
          keyFilter="created_date"
          defaultFilter={{
            filterOne: "Lượt nhấp",
            filterTwo: "Chi phí",
          }}
          isLoading={isLoadingChart}
          optionsFilter={optionFilterChart}
          arrAttachUnitVnd={arrAttachUnitVnd}
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
          params={paramsStore}
          columns={columns.resultColumnsShow}
          totalSummaryRow={totalRow}
          columnWidths={columns.columnsWidthResize}
          summaryDataColumns={summaryColumnDefault}
          listTabDetail={["by_date", "by_phone", "campaign"]}
          isLoadingTable={isLoadingTable}
          contentColumnShowInfo={{
            arrColumnShowInfo: arrColumnShowInfo,
            infoCell: columns.columnsShow,
          }}
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
            resizeColumn(STATUS_ROLE_CONTENT_ID.TIKTOK_BY_CONTENT_ID, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_ID.TIKTOK_BY_CONTENT_ID, columns)
          }
        />
      </Grid>
    </Grid>
  );
};

export default TiktokByContentId;
