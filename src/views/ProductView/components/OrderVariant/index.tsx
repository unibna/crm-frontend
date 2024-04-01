// Libraries
import { useContext, useEffect, useState } from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";

// Services
import { orderApi } from "_apis_/order.api";

// Context & Hooks
import { useCancelToken } from "hooks/useCancelToken";
import { DetailVariantContext } from "views/ProductView/containers/DetailVariant/context";

// Components
import DataGrid from "components/DataGrid";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Types
import { SortType } from "_types_/SortType";
import { ColumnTypeDefault } from "_types_/ColumnType";
import { SHIPPING_COMPANIES } from "_types_/GHNType";
import { ReportOrderType } from "_types_/ReportOrderType";

// Constants & Utils
import {
  arrAttachUnitVnd,
  arrColumnEditLabel,
  arrColumnPhone,
  arrDate,
  arrDateTime,
  arrValueTitle,
} from "views/AccountantView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import {
  domainGhn,
  domainVnPost,
  optionStatusShipping,
  TYPE_SHIPPING_COMPANIES,
} from "views/ShippingView/constants";
import { columnShowReportOrderItem } from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { ORDER_STATUS } from "views/OrderView/constants/options";

// --------------------------------------------------------------------

const OrderVariant = () => {
  const { newCancelToken } = useCancelToken();
  const { params: paramsStore, isRefresh, variantId } = useContext(DetailVariantContext);

  // State
  const [data, setData] = useState<ReportOrderType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 200,
    ordering: "-created",
    status: map(ORDER_STATUS, (item) => item.value),
  });
  const [columns, setColumns] = useState({
    columnsShow: filter(
      columnShowReportOrderItem.columnShowTable,
      (item: ColumnTypeDefault<ReportOrderType>) => item.isShow
    ),
    columnWidths: columnShowReportOrderItem.columnWidths,
  });
  const [dataTotal, setDataTotal] = useState<number>(0);

  useEffect(() => {
    loadDataTable();
  }, [params, newCancelToken, paramsStore, isRefresh]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      variant: variantId,
      completed_time_from: paramsStore.date_from,
      completed_time_to: paramsStore.date_to,
    };

    const newParams = chooseParams(objParams, [
      "completed_time_from",
      "completed_time_to",
      "variant",
      "status",
    ]);

    getListReport(newParams);
  };

  const getListReport = async (params: any) => {
    if (params) {
      setLoading(true);

      const result = await orderApi.get({
        endpoint: "get/all/",
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
      });

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData: any = map(results, (item: ReportOrderType) => {
          const objStatus: any =
            find(ORDER_STATUS, (current) => current.value === item.status) || {};

          const objStatusShipping = find(
            optionStatusShipping,
            (current) => current.value === item.shipping?.carrier_status
          );

          const deliveryCompany = find(
            TYPE_SHIPPING_COMPANIES,
            (current) =>
              current.value === getObjectPropSafely(() => item?.shipping?.delivery_company_type)
          );

          return {
            ...item,
            status: {
              value: objStatus?.label,
              color: objStatus?.color,
            },
            order_key: {
              value: item.order_key,
              props: {
                isCallApi: true,
                value: item.order_key,
              },
            },
            shipping__carrier_status: {
              value: objStatusShipping?.label,
              color: objStatusShipping?.color,
            },
            shipping__tracking_number: {
              value: getObjectPropSafely(() => item.shipping?.tracking_number),
              props: {
                href:
                  getObjectPropSafely(() => item?.shipping?.delivery_company_type) ===
                  SHIPPING_COMPANIES.GHN
                    ? domainGhn + getObjectPropSafely(() => item.shipping?.tracking_number)
                    : getObjectPropSafely(() => item?.shipping?.delivery_company_type) ===
                      SHIPPING_COMPANIES.VNPOST
                    ? domainVnPost + getObjectPropSafely(() => item.shipping?.tracking_number)
                    : "",
                variant: "body2",
              },
            },
            shipping__created: getObjectPropSafely(() => item?.shipping?.created),
            shipping_address: getObjectPropSafely(() => item?.shipping?.to_full_address),
            shipping__delivery_company_name: {
              value: deliveryCompany?.label,
              color: deliveryCompany?.color,
            },
            created_by__name: getObjectPropSafely(() => item?.modified_by?.name),
            source__name: {
              value: getObjectPropSafely(() => item?.source?.name),
              color: "warning",
            },
            quantity_variant: getObjectPropSafely(() => item.shipping?.items?.length)
              ? find(
                  getObjectPropSafely(() => item.shipping?.items),
                  (current) => current.code === variantId
                )?.quantity
              : 0,
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

  const handleFilterOrderStatus = (value: string, isCheck: boolean) => {
    const newStatus = isCheck
      ? [...params.status, value]
      : filter(params.status, (item) => item !== value);

    setParams({
      ...params,
      status: newStatus,
    });
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        dataExport={data}
        columns={{
          columnsShow: columnShowReportOrderItem.columnsShowHeader,
          resultColumnsShow: columnShowReportOrderItem.columnsShowHeader,
          columnShowExport: columnShowReportOrderItem.columnShowTable,
        }}
        contentOptionalLeft={
          <Grid>
            {map(ORDER_STATUS, (item) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={params.status.includes(item.value)}
                    onChange={(e) => handleFilterOrderStatus(item.value, e.target.checked)}
                  />
                }
                label={item.label}
                sx={{ width: 150 }}
              />
            ))}
          </Grid>
        }
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <DataGrid
        heightProps={700}
        data={data}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        columns={columnShowReportOrderItem.columnsShowHeader}
        columnWidths={columns.columnWidths}
        isLoadingTable={isLoading}
        renderHeader={renderHeader}
        contentColumnShowInfo={{
          arrColumnShowInfo: ["info", "shipping", "order", "cost", "payment", "status"],
          infoCell: columns.columnsShow,
        }}
        arrAttachUnitVnd={arrAttachUnitVnd}
        arrColumnHandleLink={["order_key", "shipping__tracking_number"]}
        arrDate={arrDate}
        arrDateTime={arrDateTime}
        arrColumnPhone={arrColumnPhone}
        arrColumnEditLabel={[
          ...arrColumnEditLabel,
          "shipping__delivery_company_name",
          "source__name",
        ]}
        arrValueTitle={arrValueTitle}
        handleChangeRowsPerPage={(rowPage: number) =>
          setParams({ ...params, limit: rowPage, page: 1 })
        }
        handleChangePage={(page: number) => setParams({ ...params, page })}
        handleSorting={handleChangeSorting}
        setColumnWidths={(value) => setColumns({ ...columns, columnWidths: value })}
      />
    </Grid>
  );
};

export default OrderVariant;
