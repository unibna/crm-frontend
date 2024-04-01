// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import map from "lodash/map";
import xor from "lodash/xor";
import reduce from "lodash/reduce";
import { useTheme } from "@mui/material/styles";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { ContentDailyContext } from "views/ContentDailyView/context";

// Components
import { CardHeader, Stack, Grid, Checkbox, Card, FormControlLabel } from "@mui/material";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { SortType } from "_types_/SortType";
import { ContentDailyPivotType } from "_types_/ContentDailyType";

// Constants
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import {
  funcDataRenderHeaderContentDailyDefault,
  paramsGetDefault,
  propsTableDefault,
  summaryColumnDefault,
  handleDataQualified,
  arrColumnShowInfo,
} from "views/ContentDailyView/constants";
import { STATUS_ROLE_CONTENT_DAILY } from "constants/rolesTab";
import { columnShowPivot, FILTER_PIVOT, PIVOT } from "views/ContentDailyView/constants/pivot";
import { getColumnsShow } from "utils/tableUtil";
import { columnShowContentDailyDefault } from "views/ContentDailyView/constants/pivot";

const PivotTable = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
    updateColumn,
  } = useContext(ContentDailyContext);
  const { [STATUS_ROLE_CONTENT_DAILY.PIVOT]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentDailyPivotType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-spend" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});
  const [filterPivot, setFilterPivot] = useState([PIVOT.AD_NAME]);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, filterPivot]);

  useEffect(() => {
    if (filterPivot) {
      changeColumnByFilter();
    }
  }, [filterPivot]);

  const changeColumnByFilter = () => {
    let columnsShowHeader: any[] = [];
    const columnShowTable = reduce(
      filterPivot,
      (prevArr, current: PIVOT) => {
        columnsShowHeader = [...columnShowPivot[current].columnsShowHeader, ...columnsShowHeader];
        return [...columnShowPivot[current].columnShowTable, ...prevArr];
      },
      []
    );

    updateColumn(STATUS_ROLE_CONTENT_DAILY.PIVOT, {
      columnsShow: getColumnsShow([
        ...columnShowTable,
        ...columnShowContentDailyDefault.columnShowTable,
      ]),
      resultColumnsShow: [...columnsShowHeader, ...columnShowContentDailyDefault.columnsShowHeader],
      countShowColumn: getColumnsShow([
        ...columnShowTable,
        ...columnShowContentDailyDefault.columnShowTable,
      ]).length,
      columnsWidthResize: columnShowContentDailyDefault.columnWidths,
    });
  };

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        dimension: filterPivot,
      },
      [...paramsGetDefault]
    );

    getListOverviewByContentDaily(objParams);
  };

  const getListOverviewByContentDaily = async (params: any) => {
    if (params) {
      setLoadingTable(true);
      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "content-daily/pivot/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            thumb_img_content_id: getObjectPropSafely(() => item.thumbnail_url),
            body: {
              value: getObjectPropSafely(() => item.body),
              props: {
                href: `http://facebook.com/${item.post_id}`,
                variant: "body2",
                title: "Nội dung",
              },
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

  const handleFilter = (params: any) => {
    setParams({
      ...params,
      page: 1,
    });

    updateParams(params);
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
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_CONTENT_DAILY.PIVOT, columns)}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <Grid container spacing={3} mb={3}>
      <Grid item xs={12} md={10} lg={10} sx={{ div: { marginBottom: 0 } }}>
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
          setColumnWidths={(columns) => resizeColumn(STATUS_ROLE_CONTENT_DAILY.PIVOT, columns)}
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_DAILY.PIVOT, columns)
          }
        />
      </Grid>
      <Grid item xs={12} md={2} lg={2}>
        <Card sx={{ height: "100%" }}>
          <CardHeader title="Filter theo" />
          <Stack sx={{ px: 3 }}>
            {map(FILTER_PIVOT, (item) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterPivot.includes(item.value)}
                    onChange={(e) => setFilterPivot(xor([...filterPivot], [item.value]))}
                  />
                }
                label={item.label}
                sx={{ width: 150 }}
              />
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PivotTable;
