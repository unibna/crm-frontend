// Libraries
import { useEffect, useState } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import pick from "lodash/pick";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import DataGrid from "components/DataGrid";
import Collapse from "@mui/material/Collapse";
import { MExpandMoreIconButton } from "components/Buttons";

// Constants & Utils
import { groupBy } from "utils/helpers";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDateTime } from "utils/dateUtil";
import { fValueVnd } from "utils/formatNumber";
import {
  columnShowSpendSegmentByCampaignObject,
  columnShowTotalRevenueByCampaignObject,
  columnShowTotalRevenueByDate,
} from "views/ReportContentIdView/constants/total";
import {
  campaignObjective,
  propsTableDefault,
  handleDataQualified,
  summaryColumnDefault,
  arrColumnShowInfo,
} from "views/ReportContentIdView/constants";
interface Props {
  params: any;
  arrShowCampaignObjective: string[];
}

const TableDetailByOverview = ({ params: paramsProps, arrShowCampaignObjective = [] }: Props) => {
  const { newCancelToken } = useCancelToken();
  const theme = useTheme();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingSpendSegment, setLoadingSpendSegment] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    mes: [],
    con: [],
    ggl: [],
  });
  const [params, setParams] = useState({ limit: 200, page: 1 });
  const [dataTotal, setDataTotal] = useState({
    mes: 0,
    con: 0,
    ggl: 0,
    mesByDate: 0,
    conByDate: 0,
    gglByDate: 0,
  });
  const [dataSpend, setDataSpend] = useState<any>({
    mes: [],
    con: [],
    ggl: [],
  });
  const [totalRow, setTotalRow] = useState<any>({
    mes: [],
    con: [],
    ggl: [],
  });

  const [totalRowByDate, setTotalRowByDate] = useState<any>({
    mes: {},
    con: {},
    ggl: {},
  });

  const [columnWidths, setColumnWidths] = useState<{
    mes: TableColumnWidthInfo[];
    con: TableColumnWidthInfo[];
    ggl: TableColumnWidthInfo[];
    mesByDate: TableColumnWidthInfo[];
    conByDate: TableColumnWidthInfo[];
    gglByDate: TableColumnWidthInfo[];
    mesSpend: TableColumnWidthInfo[];
    conSpend: TableColumnWidthInfo[];
    gglSpend: TableColumnWidthInfo[];
  }>({
    mes: columnShowTotalRevenueByCampaignObject.columnWidths,
    con: columnShowTotalRevenueByCampaignObject.columnWidths,
    ggl: columnShowTotalRevenueByCampaignObject.columnWidths,
    mesByDate: columnShowTotalRevenueByDate.columnWidths,
    conByDate: columnShowTotalRevenueByDate.columnWidths,
    gglByDate: columnShowTotalRevenueByDate.columnWidths,
    mesSpend: columnShowSpendSegmentByCampaignObject.columnWidths,
    conSpend: columnShowSpendSegmentByCampaignObject.columnWidths,
    gglSpend: columnShowSpendSegmentByCampaignObject.columnWidths,
  });
  const [columnOrders, setColumnOrders] = useState<{
    mes: string[];
    con: string[];
    ggl: string[];
    mesByDate: string[];
    conByDate: string[];
    gglByDate: string[];
    mesSpend: string[];
    conSpend: string[];
    gglSpend: string[];
  }>({
    mes: [],
    con: [],
    ggl: [],
    mesByDate: [],
    conByDate: [],
    gglByDate: [],
    mesSpend: [],
    conSpend: [],
    gglSpend: [],
  });

  const [expanded, setExpanded] = useState({
    ggl: false,
    con: false,
    mes: false,
  });

  useEffect(() => {
    const newColumnCampaignObjectOrder =
      columnShowTotalRevenueByCampaignObject.columnsShowHeader.map((item: any) => item.name);
    const newColumnTotalRevenueByDateOrder = columnShowTotalRevenueByDate.columnsShowHeader.map(
      (item: any) => item.name
    );
    const newColumnSpendSegmentByCampaignObject =
      columnShowSpendSegmentByCampaignObject.columnsShowHeader.map((item: any) => item.name);
    setColumnOrders({
      mes: newColumnCampaignObjectOrder,
      con: newColumnCampaignObjectOrder,
      ggl: newColumnCampaignObjectOrder,
      mesByDate: newColumnTotalRevenueByDateOrder,
      conByDate: newColumnTotalRevenueByDateOrder,
      gglByDate: newColumnTotalRevenueByDateOrder,
      mesSpend: newColumnSpendSegmentByCampaignObject,
      conSpend: newColumnSpendSegmentByCampaignObject,
      gglSpend: newColumnSpendSegmentByCampaignObject,
    });
  }, []);

  useEffect(() => {
    getListDataDetail({ ...params, ...paramsProps });
    getListDataSpendSegment({ ...params, ...paramsProps });
  }, [params, paramsProps]);

  const translateDataSpend = (list: any) => {
    return list.map((item: any) => ({
      ...item,
      total_expense: {
        value: item.total_expense,
        content: (
          <Stack direction="column" spacing={1}>
            <Typography
              sx={{
                fontSize: "0.8125rem",
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              {fValueVnd(item.total_expense)}
            </Typography>
            <Typography sx={{ fontSize: "0.775rem", mr: 1 }}>
              {`Từ `}

              {fDateTime(item.from)}
            </Typography>
            <Typography sx={{ fontSize: "0.775rem", mr: 1 }}>
              {`Đến `}
              {fDateTime(item.to)}
            </Typography>
          </Stack>
        ),
      },
      ...handleDataQualified(item),
    }));
  };

  const getListDataSpendSegment = async (params: any) => {
    setLoadingSpendSegment(true);
    const resultSpendSegment: any = await reportMarketing.get(
      {
        ...pick(params, ["limit", "page", "ad_name", "product"]),
        cancelToken: newCancelToken(),
      },
      "aggregated/spend-segment/"
    );

    if (resultSpendSegment && resultSpendSegment.data) {
      setDataSpend({
        mes: translateDataSpend(getObjectPropSafely(() => resultSpendSegment?.data.Mes) || []),
        con: translateDataSpend(getObjectPropSafely(() => resultSpendSegment?.data.Con) || []),
        ggl: translateDataSpend(getObjectPropSafely(() => resultSpendSegment?.data.Ggl) || []),
      });
    }

    setLoadingSpendSegment(false);
  };

  const getListDataDetail = async (params: any) => {
    setLoading(true);

    const resultAdName = await reportMarketing.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "aggregated/brief/"
    );

    const resultAvg = await reportMarketing.get(
      {
        ...params,
        dimension: "campaign_objective",
        ad_name: undefined,
        cancelToken: newCancelToken(),
      },
      "aggregated/brief/"
    );

    Promise.all([resultAdName, resultAvg]).then((values) => {
      const resultAdName = values[0]?.data;
      const resultAvg = values[1]?.data;
      if (resultAdName && resultAvg) {
        const newResults = map(resultAdName.results, (item: any) => ({
          ...item,
          ...handleDataQualified(item),
          total_qualified_prev: item.total_qualified, // Lưu lại giá trị trước khi format để tính tổng
        }));

        const newData = groupBy(newResults, "campaign_objective");
        const newTotalData = groupBy(resultAdName.total, "campaign_objective");
        const newTotalDataAvg = groupBy(resultAvg.total, "campaign_objective");

        const initTotalRowByDate = {
          total_expense: 0,
          cost_per_total_qualified: 0,
          total_qualified: 0,
          total_processing: 0,
          total_phone: 0,
          total_expense_per_total_revenue: 0,
        };

        const calcTotalRowByDate = (data: any) => {
          return (
            data?.reduce(
              (prev: any, current: any) => {
                prev.total_expense += current.total_expense;
                prev.cost_per_total_qualified += getObjectPropSafely(
                  () => current.cost_per_total_qualified.value
                );
                prev.total_qualified += current.total_qualified_prev;
                prev.total_processing += current.total_processing;
                prev.total_phone += current.total_phone;
                prev.total_expense_per_total_revenue += current.total_expense_per_total_revenue;
                return prev;
              },
              { ...initTotalRowByDate }
            ) || { ...initTotalRowByDate }
          );
        };

        const newTotalRowByDate = {
          mes: calcTotalRowByDate(newData.Mes),
          con: calcTotalRowByDate(newData.Con),
          ggl: calcTotalRowByDate(newData.Ggl),
        };

        setTotalRowByDate(newTotalRowByDate);

        setData({
          mes: newData.Mes || [],
          con: newData.Con || [],
          ggl: newData.Ggl || [],
        });

        setDataTotal({
          mes: newTotalData?.Mes?.length || 0,
          con: newTotalData?.Con?.length || 0,
          ggl: newTotalData?.Ggl?.length || 0,
          mesByDate: newTotalData?.Mes?.length || 0,
          conByDate: newTotalData?.Con?.length || 0,
          gglByDate: newTotalData?.Ggl?.length || 0,
        });

        setTotalRow({
          mes:
            newTotalData?.Mes?.map((item: any) => ({
              ...item,
              cost_per_total_qualified_avg:
                newTotalDataAvg?.Mes?.find((itemAvg: any) => itemAvg.time === item.time)
                  ?.cost_per_total_qualified || 0,
              ...handleDataQualified(item),
            })) || [],
          con:
            newTotalData?.Con?.map((item: any) => ({
              ...item,
              cost_per_total_qualified_avg:
                newTotalDataAvg?.Con?.find((itemAvg: any) => itemAvg.time === item.time)
                  ?.cost_per_total_qualified || 0,
              ...handleDataQualified(item),
            })) || [],
          ggl:
            newTotalData?.Ggl?.map((item: any) => ({
              ...item,
              cost_per_total_qualified_avg:
                newTotalDataAvg?.Ggl?.find((itemAvg: any) => itemAvg.time === item.time)
                  ?.cost_per_total_qualified || 0,
              ...handleDataQualified(item),
            })) || [],
        });
      }
    });
    setLoading(false);
  };

  const handleChangeSorting = (value: any) => {
    const ordering = value[0].sort === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams((params: any) => {
      return { ...params, ordering };
    });
  };

  return (
    <Stack direction="column" spacing={2} sx={{ minWidth: "1500px", p: 1 }}>
      {map(campaignObjective, (obj) => {
        const objValue = obj.value.toLowerCase();

        return (
          arrShowCampaignObjective.includes(objValue) && (
            <Box>
              <Stack sx={{ px: 2 }} direction="row" alignItems="center" spacing={1}>
                <Typography>{obj.label}</Typography>
                <MExpandMoreIconButton
                  expand={expanded[objValue]}
                  color="inherit"
                  onClick={() => setExpanded({ ...expanded, [objValue]: !expanded[objValue] })}
                  aria-expanded={expanded[objValue]}
                  aria-label="show more"
                />
              </Stack>
              <Collapse in={expanded[objValue]} timeout="auto" unmountOnExit>
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <Stack direction="column" spacing={2}>
                      <DataGrid
                        {...propsTableDefault}
                        isHeightCustom
                        data={totalRow[objValue]}
                        dataTotal={dataTotal[objValue]}
                        pageSize={params.limit}
                        columns={columnShowTotalRevenueByCampaignObject.columnsShowHeader}
                        columnWidths={columnWidths[objValue]}
                        isLoadingTable={isLoading}
                        isShowListToolbar={false}
                        contentColumnShowInfo={{
                          arrColumnShowInfo: arrColumnShowInfo,
                          infoCell: columnShowTotalRevenueByCampaignObject.columnShowTable,
                        }}
                        handleChangeRowsPerPage={(rowPage: number) =>
                          setParams({
                            ...params,
                            limit: rowPage,
                            page: 1,
                          })
                        }
                        handleChangePage={(page: number) => setParams({ ...params, page })}
                        handleSorting={handleChangeSorting}
                        setColumnWidths={(nextColumnWidths) => {
                          setColumnWidths({
                            ...columnWidths,
                            [objValue]: nextColumnWidths,
                          });
                        }}
                        handleChangeColumnOrder={(nextColumnOrders) => {
                          setColumnOrders({
                            ...columnOrders,
                            [objValue]: nextColumnOrders,
                          });
                        }}
                      />
                      <DataGrid
                        {...propsTableDefault}
                        isHeightCustom={dataSpend[objValue].length < 5}
                        heightProps={400}
                        data={dataSpend[objValue]}
                        columns={columnShowSpendSegmentByCampaignObject.columnsShowHeader}
                        columnWidths={columnWidths[`${objValue}Spend`]}
                        isLoadingTable={isLoadingSpendSegment}
                        isShowListToolbar={false}
                        contentColumnShowInfo={{
                          arrColumnShowInfo: arrColumnShowInfo,
                          infoCell: columnShowSpendSegmentByCampaignObject.columnShowTable,
                        }}
                        contentOptional={{
                          arrColumnOptional: ["cost_per_total_qualified", "total_expense"],
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
                        setColumnWidths={(nextColumnWidths) => {
                          setColumnWidths({
                            ...columnWidths,
                            [`${objValue}Spend`]: nextColumnWidths,
                          });
                        }}
                        handleChangeColumnOrder={(nextColumnOrders) => {
                          setColumnOrders({
                            ...columnOrders,
                            [`${objValue}Spend`]: nextColumnOrders,
                          });
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={5}>
                    <DataGrid
                      {...propsTableDefault}
                      isHeightCustom
                      data={data[objValue]}
                      dataTotal={dataTotal[`${objValue}ByDate`]}
                      pageSize={params.limit}
                      columns={columnShowTotalRevenueByDate.columnsShowHeader}
                      columnWidths={columnWidths[`${objValue}ByDate`]}
                      totalSummaryRow={totalRowByDate[objValue]}
                      summaryDataColumns={summaryColumnDefault}
                      isLoadingTable={isLoading}
                      isShowListToolbar={false}
                      contentColumnShowInfo={{
                        arrColumnShowInfo: arrColumnShowInfo,
                        infoCell: columnShowTotalRevenueByDate.columnShowTable,
                      }}
                      handleChangeRowsPerPage={(rowPage: number) =>
                        setParams({
                          ...params,
                          limit: rowPage,
                          page: 1,
                        })
                      }
                      handleChangePage={(page: number) => setParams({ ...params, page })}
                      handleSorting={handleChangeSorting}
                      setColumnWidths={(nextColumnWidths) => {
                        setColumnWidths({
                          ...columnWidths,
                          [`${objValue}ByDate`]: nextColumnWidths,
                        });
                      }}
                      handleChangeColumnOrder={(nextColumnOrders) => {
                        setColumnOrders({
                          ...columnOrders,
                          [`${objValue}ByDate`]: nextColumnOrders,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Box>
          )
        );
      })}
    </Stack>
  );
};

export default TableDetailByOverview;
