// Libraries
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useContext, useEffect, useMemo, useState } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Context
import { useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import { leadStore } from "store/redux/leads/slice";
import { userStore } from "store/redux/users/slice";
import { ReportRevenueContext } from "views/ReportRevenueView/context";

// Components
import Grid from "@mui/material/Grid";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Types
import { ReportRevenueType } from "_types_/ReportRevenueType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { SortType } from "_types_/SortType";

// Constants
import { ROLE_TAB, STATUS_ROLE_REPORT_REVENUE } from "constants/rolesTab";
import { fDate } from "utils/dateUtil";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { valueGetParamsDefault } from "views/AccountantView/constants/columns";
import { filterData } from "views/AccountantView/constants/utils";
import {
  DIMENSION_VALUE,
  FILTER_CHART_REPORT_BY_DATE,
  FILTER_CHART_REPORT_BY_PRODUCT,
  KEY_FILTER_CHART,
  arrAttachUnitVndDefault,
  arrColumnShowInfo,
  paramsDefault,
  summaryColumnReportRevenue,
} from "views/ReportRevenueView/constants";

// --------------------------------------------------------------------

const TabContainer = ({ status }: { status: STATUS_ROLE_REPORT_REVENUE }) => {
  // Other
  const { newCancelToken } = useCancelToken();
  const leadSlice = useAppSelector(leadStore);
  const userSlice = useAppSelector(userStore);
  const {
    state: store,
    updateCell,
    resizeColumn,
    orderColumn,
    updateParams,
  } = useContext(ReportRevenueContext);

  // State
  const [data, setData] = useState<ReportRevenueType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 50, ordering: "" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [totalRow, setTotalRow] = useState({});
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [tags, setTags] = useState<SelectOptionType[]>([]);

  const { params: paramsStore, [status]: columns } = store;

  useEffect(() => {
    getListTag();
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, newCancelToken, status]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsStore,
      dimension: DIMENSION_VALUE[status],
    };

    const newParams = chooseParams(objParams, ["dimension", ...valueGetParamsDefault]);

    getListReport(newParams);
  };

  const getListReport = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await orderApi.get({
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: `report/revenue/`,
      });

      if (result && result.data) {
        const { results = [], count = 0, total = {} } = result.data;
        const newData: any = (results || []).map((item: ReportRevenueType) => {
          return {
            ...item,
            created_date: fDate(item.created_date),
            eto_over: fDate(item.eto_over),
            thumb_img_variant: item.variant_image,
            variant_name: {
              value: item.variant_name,
              props: {
                href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => item.variant)}`,
              },
            },
            created_by_name: getObjectPropSafely(() => item.created_by),
            thumb_img_avatar_created_by: getObjectPropSafely(() => item.avatar),
            name: item.variant_name,
          };
        });

        setTotalRow(total);
        setData(newData);
        setDataTotal(count);
      }
      setLoading(false);
    }
  };

  const getListTag = async () => {
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "tag/",
      params: { limit: 200, page: 1, cancelToken: newCancelToken() },
    });

    if (result.data) {
      const newData = getObjectPropSafely(() => result.data.results.length)
        ? reduce(
            result.data.results,
            (prevArr, current: { is_shown: boolean; name: string; id: number }) => {
              return current.is_shown
                ? [
                    ...prevArr,
                    {
                      label: current.name,
                      value: current.id,
                    },
                  ]
                : prevArr;
            },
            []
          )
        : [];

      setTags(newData);
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
      ...paramsProps,
      ...params,
      page: 1,
    });

    updateParams(paramsProps);
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const renderHeader = () => {
    const dataRenderHeader = [
      ...filterData({
        optionChannel: headerFilterChannel,
        optionCreatedBy: headerFilterCreatedBy,
        optionTags: tags,
      }),
    ];

    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập SKU, tên sản phẩm",
          },
        ]}
        isFullTable={isShowFullTable}
        dataRenderHeader={dataRenderHeader}
        dataExport={data}
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        params={newParamsStore}
        paramsDefault={paramsDefault}
        arrNoneRenderSliderFilter={["completed_time_dateValue", "created_dateValue"]}
        arrAttachUnitVnd={arrAttachUnitVndDefault}
        arrDate={["completed_date"]}
        onChangeColumn={(columns) => updateCell(status, columns)}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  const headerFilterChannel = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.channel.length)
      ? map(leadSlice.attributes.channel, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterCreatedBy = useMemo(() => {
    return getObjectPropSafely(() => userSlice.leaderAndTelesaleUsers)
      ? map(userSlice.leaderAndTelesaleUsers, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      ...valueGetParamsDefault,
      "completed_time_dateValue",
      "shipping_finished_dateValue",
      "created_dateValue",
    ]);
  }, [paramsStore]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        {status === STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT ? (
          <BarChart
            title="Báo cáo theo sản phẩm"
            data={data}
            defaultFilter={{
              filterOne: "total",
              filterTwo: "variant_total",
            }}
            labelKey="name"
            isLoading={isLoading}
            optionsFilter={FILTER_CHART_REPORT_BY_PRODUCT}
          />
        ) : (
          <LineChart
            title="Báo cáo"
            data={data}
            keyFilter={KEY_FILTER_CHART[status]}
            isLoading={isLoading}
            optionsFilter={FILTER_CHART_REPORT_BY_DATE}
            defaultFilter={{ filterOne: "Tổng đơn hàng", filterTwo: "Doanh thu thực" }}
          />
        )}
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <DataGrid
          isFullTable={isShowFullTable}
          data={data}
          dataTotal={dataTotal}
          page={params.page}
          pageSize={params.limit}
          totalSummaryRow={totalRow}
          summaryDataColumns={summaryColumnReportRevenue}
          columns={columns.resultColumnsShow}
          columnWidths={columns.columnsWidthResize}
          isLoadingTable={isLoading}
          contentColumnShowInfo={{
            arrColumnShowInfo: arrColumnShowInfo,
            infoCell: columns.columnsShow,
          }}
          arrColumnThumbImg={["variant"]}
          arrColumnAvatar={["created_by"]}
          arrAttachUnitVnd={arrAttachUnitVndDefault}
          arrDate={["completed_date", "eto_over"]}
          arrColumnHandleLink={["variant_name"]}
          renderHeader={renderHeader}
          setColumnWidths={(columns) => resizeColumn(status, columns)}
          handleChangeColumnOrder={(columns) => orderColumn(status, columns)}
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
      </Grid>
    </Grid>
  );
};

export default TabContainer;
