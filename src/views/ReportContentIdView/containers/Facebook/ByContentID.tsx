// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";
import LineChart from "components/Charts/LineChart";
import TableDetail from "components/DataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";
import TableDetailByOverview from "views/ReportContentIdView/components/TableDetailByOverview";
import TabDetailByPhone from "views/ReportContentIdView/components/TableDetailByPhone";
import TabDetailByCampaign from "views/ReportContentIdView/components/TableDetailByCampaign";
import TableDetailByDate from "views/ReportContentIdView/components/TableDetailByDate";

// Types
import { SortType } from "_types_/SortType";
import { ContentIdFacebookType, ContentIdType } from "_types_/ContentIdType";

// Constants
import {
  columnShowContentIdFacebookByContentId,
  columnShowContentIdFacebookFilterMessage,
  columnShowContentIdFacebookFilterConversation,
  columnShowContentIdFacebookByDateDetail,
  columnShowContentIdFacebookPostDetail,
  columnShowContentIdFacebookCampaignDetail,
} from "views/ReportContentIdView/constants/facebook";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import {
  funcDataRenderHeaderDefault,
  paramsGetDefault,
  propsTableDefault,
  summaryColumnDefault,
  handleDataQualified,
  arrColumnShowInfo,
  TAB_HEADER_DETAIL_BY_PHONE_FACEBOOK,
  valueFilterObjective,
  dataRenderHeaderShareFacebook,
  arrAttachUnitVnd,
} from "views/ReportContentIdView/constants";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { getColumnsShow } from "utils/tableUtil";

const FacebookByContentId = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const location = useLocation();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
    updateColumn,
  } = useContext(ContentIdContext);
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const { [STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentIdFacebookType[]>([]);
  const [dataChart, setDataChart] = useState<ContentIdFacebookType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [isLoadingChart, setLoadingChart] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-spend" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});
  const { dataFilterAdAccount, dataFilterFanpage, dataAttributeRule } = filterContentId;

  useEffect(() => {
    if (location.state) {
      updateParams({
        objective: [location.state],
      });
    }
  }, []);

  useEffect(() => {
    if (paramsStore.objective) {
      changeColumnByFilterObjective();
    }
  }, [paramsStore.objective]);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    loadDataChart();
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
        "page_id",
        "ad_account_id",
        "effective_status",
        "objective",
      ]
    );

    getListFacebookContentId(objParams);
  };

  const loadDataChart = () => {
    const params = handleParamsApi(
      {
        ...paramsStore,
        limit: 1000,
      },
      [
        ...paramsGetDefault,
        "digital_fb",
        "page_id",
        "ad_account_id",
        "effective_status",
        "objective",
      ]
    );

    getDataChart(params);
  };

  const changeColumnByFilterObjective = () => {
    switch (getObjectPropSafely(() => paramsStore.objective.toString())) {
      case valueFilterObjective.MESSAGES: {
        updateColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID, {
          columnsShow: getColumnsShow(columnShowContentIdFacebookFilterMessage.columnShowTable),
          resultColumnsShow: columnShowContentIdFacebookFilterMessage.columnsShowHeader,
          countShowColumn: getColumnsShow(columnShowContentIdFacebookFilterMessage.columnShowTable)
            .length,
          columnsWidthResize: columnShowContentIdFacebookFilterMessage.columnWidths,
        });
        break;
      }
      case valueFilterObjective.CONVERSIONS: {
        updateColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID, {
          columnsShow: getColumnsShow(
            columnShowContentIdFacebookFilterConversation.columnShowTable
          ),
          resultColumnsShow: columnShowContentIdFacebookFilterConversation.columnsShowHeader,
          countShowColumn: getColumnsShow(
            columnShowContentIdFacebookFilterConversation.columnShowTable
          ).length,
          columnsWidthResize: columnShowContentIdFacebookFilterConversation.columnWidths,
        });
        break;
      }
      default: {
        updateColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID, {
          columnsShow: getColumnsShow(columnShowContentIdFacebookByContentId.columnShowTable),
          resultColumnsShow: columnShowContentIdFacebookByContentId.columnsShowHeader,
          countShowColumn: getColumnsShow(columnShowContentIdFacebookByContentId.columnShowTable)
            .length,
          columnsWidthResize: columnShowContentIdFacebookByContentId.columnWidths,
        });
      }
    }
  };

  const getDataChart = async (params: any) => {
    setLoadingChart(true);

    const result = await reportMarketing.get<ContentIdType>(
      {
        ...params,
      },
      "facebook/date/"
    );

    if (result.data) {
      const { results = [] } = result.data;

      setDataChart(results || []);
    }

    setLoadingChart(false);
  };

  const getListFacebookContentId = async (params: any) => {
    if (params) {
      setLoadingTable(true);
      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "facebook/content-id/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const arrClassification = getObjectPropSafely(() => Object.keys(item.classification));

          return {
            ...item,
            thumb_img_content_id: getObjectPropSafely(() => item.thumbnails),
            body: {
              value: getObjectPropSafely(() => item.body),
              props: {
                href: `http://facebook.com/${item.post_id}`,
                variant: "body2",
              },
            },
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
    loadDataChart();
  };

  const renderTableDetail = (row: any, value: number) => {
    const handleDataApiPost = (item: any) => {
      return {
        thumb_img_content_id: getObjectPropSafely(() => item.picture),
        body: {
          value: getObjectPropSafely(() => item.body),
          props: {
            href: `http://facebook.com/${item.effective_object_story_id}`,
          },
        },
        ...handleDataQualified(item),
      };
    };

    const newParams = handleParamsApi(
      {
        ...paramsStore,
        ad_name: row.ad_name,
        product: row.product,
        cancelToken: newCancelToken(),
      },
      [
        ...paramsGetDefault,
        "digital_fb",
        "page_id",
        "ad_account_id",
        "effective_status",
        "objective",
        "ad_name",
      ]
    );

    return (
      <>
        <TabWrap value={value} index={0}>
          <TableDetailByOverview
            params={{ ...newParams }}
            arrShowCampaignObjective={["con", "mes"]}
          />
        </TabWrap>
        <TabWrap value={value} index={1}>
          <TableDetailByDate
            params={{ ...newParams, ordering: "-created_date" }}
            columns={columnShowContentIdFacebookByDateDetail}
            endpoint="facebook/date/"
          />
        </TabWrap>
        <TabWrap value={value} index={2}>
          <TableDetail
            {...propsTableDefault}
            arrColumnThumbImg={[]}
            heightProps={700}
            isHeightCustom={false}
            isFullTable={isShowFullTable}
            host={reportMarketing}
            params={{ ...newParams, ordering: "-spend" }}
            columnShowDetail={columnShowContentIdFacebookPostDetail}
            contentColumnShowInfo={{
              arrColumnShowInfo: arrColumnShowInfo,
              infoCell: columnShowContentIdFacebookPostDetail.columnShowTable,
            }}
            summaryDataColumns={summaryColumnDefault}
            endpoint="facebook/post/"
            handleDataApi={handleDataApiPost}
          />
        </TabWrap>
        <TabWrap value={value} index={3}>
          <TabDetailByPhone
            params={{ ...newParams }}
            tabHeaderDetail={TAB_HEADER_DETAIL_BY_PHONE_FACEBOOK}
          />
        </TabWrap>
        <TabWrap value={value} index={4}>
          <TabDetailByCampaign
            params={{ ...newParams, dimension: "campaign", ordering: "-spend" }}
            endpoint="facebook/campaign/"
            columns={columnShowContentIdFacebookCampaignDetail}
          />
        </TabWrap>
      </>
    );
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      ...paramsGetDefault,
      "digital_fb",
      "page_id",
      "ad_account_id",
      "effective_status",
      "objective",
      "dateValue",
    ]);
  }, [paramsStore]);

  const optionFilterChart = useMemo(() => {
    return map(columnShowContentIdFacebookByContentId.columnsShowHeader, (item) => ({
      value: item.name,
      label: item.title,
    }));
  }, []);

  const renderHeader = () => {
    const dataRenderHeader = [
      ...dataRenderHeaderShareFacebook,
      {
        style: {
          width: 200,
        },
        title: "Trang",
        options: dataFilterFanpage,
        label: "page_id",
        defaultValue: getObjectPropSafely(() => dataFilterFanpage[0].value),
      },
      {
        style: {
          width: 200,
        },
        title: "Tài khoản quảng cáo",
        options: dataFilterAdAccount,
        label: "ad_account_id",
        defaultValue: getObjectPropSafely(() => dataFilterAdAccount[0].value),
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
          updateCell(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID, columns)
        }
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <LineChart
          title="Content ID Facebook"
          data={dataChart}
          keyFilter="created_date"
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
          columns={columns.resultColumnsShow}
          totalSummaryRow={totalRow}
          columnWidths={columns.columnsWidthResize}
          summaryDataColumns={summaryColumnDefault}
          isLoadingTable={isLoadingTable}
          listTabDetail={["overview", "by_date", "post", "by_phone", "campaign"]}
          renderHeader={renderHeader}
          renderTableDetail={renderTableDetail}
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
          contentColumnShowInfo={{
            arrColumnShowInfo: arrColumnShowInfo,
            infoCell: columns.columnsShow,
          }}
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
            resizeColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID, columns)
          }
        />
      </Grid>
    </Grid>
  );
};

export default FacebookByContentId;
