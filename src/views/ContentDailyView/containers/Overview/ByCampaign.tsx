// Libraries
import { useEffect, useContext, useMemo, useState } from "react";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { ContentDailyContext } from "views/ContentDailyView/context";

// Components
import Grid from "@mui/material/Grid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { SortType } from "_types_/SortType";
import { ContentDailyOverviewType } from "_types_/ContentDailyType";

// Constants
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import {
  arrColumnShowInfo,
  funcDataRenderHeaderContentDailyDefault,
  paramsGetDefault,
  propsTableDefault,
  summaryColumnDefault,
  handleDataQualified,
} from "views/ContentDailyView/constants";
import { STATUS_ROLE_CONTENT_DAILY } from "constants/rolesTab";
import { fNumber } from "utils/formatNumber";

const OverviewByCampaign = () => {
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentDailyContext);
  const { [STATUS_ROLE_CONTENT_DAILY.OVERVIEW_BY_CAMPAIGN]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentDailyOverviewType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-cost" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        rows: "campaign_name",
      },
      [...paramsGetDefault]
    );

    getListCampaign(objParams);
  };

  const getListCampaign = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "content-daily/pivot/new/"
      );

      if (result && result.data) {
        const { data = [], count, total } = result.data;
        const newData = data.map((item: any) => {
          return {
            ...item,
            ...handleDataQualified(item),
          };
        });

        const newTotal = {
          ...total,
          CPV: fNumber(total.CPV),
          CPE: fNumber(total.CPE),
          CPM: fNumber(total.CPM),
          CPR: fNumber(total.CPR),
        };

        setData(newData || []);
        setDataTotal(count);
        setTotalRow(newTotal);
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

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [...paramsGetDefault, "dateValue"]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [...funcDataRenderHeaderContentDailyDefault(store.dataFilter)];

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
          updateCell(STATUS_ROLE_CONTENT_DAILY.OVERVIEW_BY_CAMPAIGN, columns)
        }
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <Grid container spacing={3}>
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
          renderHeader={renderHeader}
          handleSorting={handleChangeSorting}
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
            resizeColumn(STATUS_ROLE_CONTENT_DAILY.OVERVIEW_BY_CAMPAIGN, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_DAILY.OVERVIEW_BY_CAMPAIGN, columns)
          }
        />
      </Grid>
    </Grid>
  );
};

export default OverviewByCampaign;
