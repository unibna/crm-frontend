// Libraries
import { useEffect, useContext, useMemo, useState } from "react";
import map from "lodash/map";
import find from "lodash/find";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Context
import { useCancelToken } from "hooks/useCancelToken";
import { ContentIdContext } from "views/ReportContentIdView/context";

// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import DataGrid from "components/DataGrid";

// Types
import { SortType } from "_types_/SortType";
import { ContentIdGoogleType, ContentIdType } from "_types_/ContentIdType";

// Constants
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import {
  arrColumnShowInfo,
  funcDataRenderHeaderDefault,
  paramsGetDefault,
  propsTableDefault,
  summaryColumnDefault,
  handleDataQualified,
  dataRenderHeaderShareGoogle,
  arrFormatSummaryOptionalDefault,
  handleFormatSummaryDefault,
} from "views/ReportContentIdView/constants";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

const GoogleByCampaign = () => {
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const { [STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CAMPAIGN]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentIdGoogleType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-cost" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});
  const { dataFilterCustomer, dataAttributeRule } = filterContentId;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const newParams = chooseParams(
      {
        ...params,
        ...paramsStore,
      },
      [...paramsGetDefault, "digital_gg", "customer_id", "effective_status", "objective"]
    );

    getListGoogleContentId(newParams);
  };

  const getListGoogleContentId = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "google/campaign/"
      );
      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = results.map((item: ContentIdType) => {
          const { classification = {} } = item;
          const arrClassification = getObjectPropSafely(() => Object.keys(classification));

          return {
            ...item,
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
                        label={getObjectPropSafely(() => classification[current])}
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
      ...dataRenderHeaderShareGoogle,
      {
        style: {
          width: 200,
        },
        title: "Tài khoản khách hàng",
        options: dataFilterCustomer,
        label: "customer_id",
        defaultValue: getObjectPropSafely(() => dataFilterCustomer[0].value),
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
        onChangeColumn={(columns) => updateCell(STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CAMPAIGN, columns)}
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
          contentColumnShowInfo={{
            arrColumnShowInfo: arrColumnShowInfo,
            infoCell: columns.columnsShow,
          }}
          contentSummary={{
            arrFormatSummaryOptional: arrFormatSummaryOptionalDefault,
            handleFormatSummary: (columnName: string | number, totalRow: Partial<any>) =>
              handleFormatSummaryDefault(columnName, totalRow, { dataAttributeRule }),
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
            resizeColumn(STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CAMPAIGN, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CAMPAIGN, columns)
          }
        />
      </Grid>
    </Grid>
  );
};

export default GoogleByCampaign;
