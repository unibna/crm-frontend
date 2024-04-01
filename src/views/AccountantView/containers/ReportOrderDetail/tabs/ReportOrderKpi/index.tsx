// Libraries
import find from "lodash/find";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Context & Hooks
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { leadStore } from "store/redux/leads/slice";
import { userStore } from "store/redux/users/slice";
import { ReportOrderContext } from "views/AccountantView/containers/ReportOrderDetail/context";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Types
import { ReportOrderType } from "_types_/ReportOrderType";
import { SortType } from "_types_/SortType";

// Constants & Utils
import { ROLE_TAB } from "constants/rolesTab";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  arrAttachUnitVnd,
  arrColumnEditLabel,
  arrColumnHandleLink,
  arrColumnPhone,
  arrDate,
  arrDateTime,
  arrValueTitle,
  paramsDefault,
} from "views/AccountantView/constants";
import {
  valueGetParamsDefault,
  columnShowReportOrderKpi,
} from "views/AccountantView/constants/columns";
import { filterData, handleDataItem } from "views/AccountantView/constants/utils";
import { TYPE_SHIPPING_COMPANIES } from "views/ShippingView/constants";
import { ACCOUNTANT_PATH } from "routes/paths";

// --------------------------------------------------------------------

const ReportOrderKpi = () => {
  const { newCancelToken } = useCancelToken();
  const leadSlice = useAppSelector(leadStore);
  const userSlice = useAppSelector(userStore);
  const { user } = useAuth();
  const {
    state: store,
    updateCell,
    resizeColumn,
    orderColumn,
    updateParams,
  } = useContext(ReportOrderContext);

  // State
  const [data, setData] = useState<ReportOrderType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  const { [ACCOUNTANT_PATH.REPORT_KPI]: columns, tags = [], params: paramsStore } = store;

  const getListReport = useCallback(
    async (params: Partial<any>) => {
      if (params) {
        setLoading(true);

        const result = await orderApi.get({
          endpoint: `report/detail/order-kpi/`,
          params: {
            ...params,
            cancelToken: newCancelToken(),
          },
        });

        if (result && result.data) {
          const { results = [], count = 0 } = result.data;
          const newData: any = map(results, (item: ReportOrderType) => {
            const deliveryCompany = find(
              TYPE_SHIPPING_COMPANIES,
              (current) => current.value === item.shipping__delivery_company_type
            );

            return {
              ...item,
              ...handleDataItem(item),
              order_key: {
                value: item.order_key,
                props: {
                  href: `/${ROLE_TAB.ORDERS}/${item?.id}`,
                  variant: "body2",
                  isCallApi: true,
                },
              },
              shipping__delivery_company_name: {
                value: deliveryCompany?.label,
                color: deliveryCompany?.color,
              },
            };
          });

          setData(newData || []);
          setDataTotal(count);
        }

        setLoading(false);
      }
    },
    [newCancelToken]
  );

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleFilter = (newParams: any) => {
    setParams({ ...params, page: 1 });

    updateParams(newParams);
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const loadDataTable = useCallback(() => {
    const objParams = {
      ...params,
      ...paramsStore,
    };

    const newParams = chooseParams(objParams, valueGetParamsDefault);

    getListReport(newParams);
  }, [getListReport, params, paramsStore]);

  useEffect(() => {
    loadDataTable();
  }, [loadDataTable]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter({ ...params, ...paramsStore }, [
      ...valueGetParamsDefault,
      "created_dateValue",
      "completed_time_dateValue",
      "shipping_finished_dateValue",
    ]);
  }, [params, paramsStore]);

  const optionChannel = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.channel.length)
      ? map(leadSlice.attributes.channel, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, [leadSlice.attributes.channel]);

  const optionCreatedBy = useMemo(() => {
    return map(userSlice.leaderAndTelesaleUsers, (item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [userSlice.leaderAndTelesaleUsers]);

  const paramsExportExcel = useMemo(() => {
    const keysMap = reduce(
      columnShowReportOrderKpi.columnShowTable,
      (prevObj, current: any) => {
        return {
          ...prevObj,
          [current.name]: current.title,
        };
      },
      {}
    );

    return user?.is_export_data
      ? {
          ...chooseParams({ ...params, ...paramsStore }, valueGetParamsDefault),
          keys_map: JSON.stringify(keysMap),
        }
      : {};
  }, [params, paramsStore, user?.is_export_data]);

  const renderHeader = () => {
    const dataRenderHeader = filterData({
      optionCreatedBy,
      optionChannel,
      optionTags: tags,
    });

    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập mã đơn hàng, sdt, tên khách hàng",
          },
        ]}
        isFullTable={isShowFullTable}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={paramsDefault}
        dataExport={data}
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        arrNoneRenderSliderFilter={[
          "created_dateValue",
          "completed_time_dateValue",
          "shipping_finished_dateValue",
        ]}
        dataExportExcel={{
          services: orderApi,
          endpoint: "report/detail/order-kpi/export",
          params: paramsExportExcel,
        }}
        arrDate={arrDate}
        arrDateTime={arrDateTime}
        arrAttachUnitVnd={arrAttachUnitVnd}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={(columns) => updateCell(ACCOUNTANT_PATH.REPORT_KPI, columns)}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <DataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columns.resultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      renderHeader={renderHeader}
      isLoadingTable={isLoading}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["info", "customer", "shipping", "order", "cost"],
        infoCell: columns.columnsShow,
      }}
      arrAttachUnitVnd={arrAttachUnitVnd}
      arrColumnHandleLink={arrColumnHandleLink}
      arrDate={arrDate}
      arrDateTime={arrDateTime}
      arrColumnPhone={arrColumnPhone}
      arrColumnEditLabel={arrColumnEditLabel}
      arrValueTitle={arrValueTitle}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      handleSorting={handleChangeSorting}
      setColumnWidths={(columns) => resizeColumn(ACCOUNTANT_PATH.REPORT_KPI, columns)}
      handleChangeColumnOrder={(columns) => orderColumn(ACCOUNTANT_PATH.REPORT_KPI, columns)}
    />
  );
};

export default ReportOrderKpi;
