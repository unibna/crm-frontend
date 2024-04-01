// Libraries
import { useEffect, useContext, useMemo, useState } from "react";

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

// Types
import { SortType } from "_types_/SortType";
import { ContentIdFacebookType } from "_types_/ContentIdType";

// Constants
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";
import {
  arrColumnShowInfo,
  funcDataRenderHeaderDefault,
  paramsGetDefault,
  propsTableDefault,
  summaryColumnDefault,
  handleDataQualified,
  dataRenderHeaderShareFacebook,
} from "views/ReportContentIdView/constants";
import { STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

const FacebookByCampaign = () => {
  const { newCancelToken } = useCancelToken();
  const {
    state: store,
    resizeColumn,
    orderColumn,
    updateParams,
    updateCell,
  } = useContext(ContentIdContext);
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));
  const { [STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CAMPAIGN]: columns, params: paramsStore } = store;

  // State
  const [data, setData] = useState<ContentIdFacebookType[]>([]);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-spend" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});

  const { dataFilterFanpage, dataFilterAdAccount } = filterContentId;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        dimension: "campaign",
      },
      [
        ...paramsGetDefault,
        "digital_fb",
        "page_id",
        "ad_account_id",
        "effective_status",
        "objective",
        "dimension",
      ]
    );

    getListFacebookContentId(objParams);
  };

  const getListFacebookContentId = async (params: any) => {
    if (params) {
      setLoadingTable(true);

      const result: any = await reportMarketing.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "facebook/campaign/"
      );

      if (result && result.data) {
        const { results = [], count, total } = result.data;
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
          updateCell(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CAMPAIGN, columns)
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
            resizeColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CAMPAIGN, columns)
          }
          handleChangeColumnOrder={(columns) =>
            orderColumn(STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CAMPAIGN, columns)
          }
        />
      </Grid>
    </Grid>
  );
};

export default FacebookByCampaign;
