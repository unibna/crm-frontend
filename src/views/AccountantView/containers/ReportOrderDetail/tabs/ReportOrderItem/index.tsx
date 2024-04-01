// Libraries
import { useTheme } from "@mui/material";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useContext, useEffect, useMemo, useState } from "react";

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
import {} from "constants/rolesTab";
import { ACCOUNTANT_PATH } from "routes/paths";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  columnShowReportOrderItem,
  valueGetParamsDefault,
} from "views/AccountantView/constants/columns";
import { filterData, handleDataItem } from "views/AccountantView/constants/utils";
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

// --------------------------------------------------------------------

const ReportOrderItem = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const leadSlice = useAppSelector(leadStore);
  const userSlice = useAppSelector(userStore);
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

  const { [ACCOUNTANT_PATH.REPORT_ORDER_ITEM]: columns, tags = [], params: paramsStore } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, newCancelToken]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsStore,
    };

    const newParams = chooseParams(objParams, valueGetParamsDefault);

    getListReport(newParams);
  };

  const getListReport = async (params: any) => {
    if (params) {
      setLoading(true);

      const result = await orderApi.get({
        endpoint: `report/detail/order-item/`,
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
      });

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData: any = map(results, (item: ReportOrderType) => {
          return {
            ...item,
            ...handleDataItem(item),
          };
        });

        setData(newData || []);
        setDataTotal(count);
      }

      setLoading(false);
    }
  };

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

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      ...valueGetParamsDefault,
      "created_dateValue",
      "completed_time_dateValue",
    ]);
  }, [paramsStore]);

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
      columnShowReportOrderItem.columnShowTable,
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
  }, [params, paramsStore]);

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
        arrNoneRenderSliderFilter={["created_dateValue", "completed_time_dateValue"]}
        dataExportExcel={{
          services: orderApi,
          endpoint: "report/detail/order-item/export",
          params: paramsExportExcel,
        }}
        arrDate={arrDate}
        arrDateTime={arrDateTime}
        arrAttachUnitVnd={arrAttachUnitVnd}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={(columns) => updateCell(ACCOUNTANT_PATH.REPORT_ORDER_ITEM, columns)}
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
      isLoadingTable={isLoading}
      leftColumns={["order_key"]}
      renderHeader={renderHeader}
      contentColumnShowInfo={{
        arrColumnShowInfo: [
          "order_key",
          "created",
          "created_by__name",

          "status",
          "completed_time",
          "modified_by__name",
          "is_printed",
          "printed_at",
          "printed_by__name",
          "source__name",
          "tags__name",
          "customer_name",
          "customer_phone",
          "exported",
          "imported",

          "fee_delivery",
          "fee_additional",
          "discount_promotion",
          "discount_input",
          "promotions__name",
          "payment_note",
          "note",

          "total_variant_all",
          "total_variant_actual",
          "total_actual",

          "payment_cod",
          "payment_cash",
          "payment_direct_transfer",

          "shipping__created",
          "shipping__tracking_number",
          "shipping__delivery_company_name",
          "shipping__note",
          "shipping_address",
          "shipping__return_full_address",
          "shipping__return_name",

          "line_items__variant__SKU_code",
          "line_items__variant__name",
          "line_items__quantity",
          "is_gift",
          "line_items__promotion__name",
          "line_items__total",
          "line_items__variant_total",
          "exported_date",
          "imported_date",
          "shipping__carrier_status",
          "shipping__modified",
          "ecommerce_code",
          "payment_cod_date",
          "payment_cod_confirm_date",
          "payment_cash_date",
          "payment_direct_transfer_date",
        ],
        infoCell: columns.columnsShow,
      }}
      arrAttachUnitVnd={arrAttachUnitVnd}
      arrColumnHandleLink={arrColumnHandleLink}
      arrDate={arrDate}
      arrDateTime={arrDateTime}
      arrColumnPhone={arrColumnPhone}
      arrColumnEditLabel={arrColumnEditLabel}
      arrValueTitle={arrValueTitle}
      arrColumnBool={["is_gift"]}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      handleSorting={handleChangeSorting}
      setColumnWidths={(columns) => resizeColumn(ACCOUNTANT_PATH.REPORT_ORDER_ITEM, columns)}
      handleChangeColumnOrder={(columns) => orderColumn(ACCOUNTANT_PATH.REPORT_ORDER_ITEM, columns)}
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
    />
  );
};

export default ReportOrderItem;
