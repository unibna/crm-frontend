// Libraries
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useContext, useEffect, useMemo, useState } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Hooks
import { Card } from "@mui/material";
import { useCancelToken } from "hooks/useCancelToken";
import { DetailVariantContext } from "views/ProductView/containers/DetailVariant/context";

// Components
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import PromotionTable from "views/PromotionView/components/PromotionTable";

// @Types
import { DISCOUNT_METHOD, PromotionRequireType, PromotionType } from "_types_/PromotionType";

// Constants & Utils
import { fDate, fDateTime } from "utils/dateUtil";
import { fCurrency2 } from "utils/formatNumber";
import { chooseParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  PROMOTION_COLUMNS,
  PROMOTION_COLUMN_WIDTHS,
  PROMOTION_HIDDEN_COLUMN_NAMES,
} from "views/PromotionView/constants";

const columnShowHeader = [
  {
    name: "name",
    column: "name",
    title: "Tên khuyến mãi",
    isShow: true,
  },
  {
    name: "date_start",
    column: "date_start",
    title: "Ngày bắt đầu",
    isShow: true,
  },
  {
    name: "date_end",
    column: "date_end",
    title: "Ngày kết thúc",
    isShow: true,
  },
  {
    name: "created",
    column: "created",
    title: "Ngày tạo",
    isShow: true,
  },
  {
    name: "created_by",
    column: "created_by",
    title: "Người tạo tạo",
    isShow: true,
  },
  {
    name: "applied_variant",
    column: "applied_variant",
    title: "Sản phẩm khuyến mãi",
    isShow: true,
  },
  {
    name: "value",
    column: "value",
    title: "Khuyến mãi",
    isShow: true,
  },
  {
    name: "requirements",
    column: "requirements",
    title: "Điều kiện áp dụng",
    isShow: true,
  },
  {
    name: "note",
    column: "note",
    title: "Nội dung",
    isShow: true,
  },
];

const PromotionVariant = () => {
  const [columns, _setColumns] = useState(PROMOTION_COLUMNS);
  const [data, setData] = useState<{
    data: PromotionType[];
    total: number;
    loading: boolean;
  }>({
    data: [],
    total: 0,
    loading: false,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 200,
  });
  const { params: paramsStore, isRefresh, variantId } = useContext(DetailVariantContext);

  const { newCancelToken } = useCancelToken();

  useEffect(() => {
    loadTable();
  }, [paramsStore, newCancelToken, isRefresh]);

  const loadTable = () => {
    getDataPromotion(
      chooseParams({ ...paramsStore, applied_variant: variantId }, [
        "completed_time_from",
        "completed_time_to",
        "applied_variant",
      ])
    );
  };

  const getDataPromotion = async (params: Partial<any>) => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<PromotionType>({
      endpoint: "promotion/",
      params: { ...params, cancelToken: newCancelToken() },
    });
    if (result.data) {
      setData({ data: result.data.results, loading: false, total: result.data.count || 0 });
    } else {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  const convertValueRequirement = (item: PromotionRequireType) => {
    switch (true) {
      case item.requirement_type === "QUANTITY_MIN" && !!item.requirement: {
        return `SL Sản phẩm ≥ ${item.requirement}`;
      }

      case item.requirement_type === "TOTAL_BILL" && !!item.requirement: {
        return `GT đơn hàng ≥ ${fCurrency2(item.requirement || 0)} vnđ`;
      }

      case item.limit_type === "QUANTITY_MAX" && !!item.limit: {
        return `SL sản phẩm ≤ ${item.limit}`;
      }

      case item.limit_type === "TOTAL_MAX" && !!item.limit: {
        return `GT đơn hàng ≤ ${fCurrency2(item.limit || 0)} vnđ`;
      }

      default:
        return;
    }
  };

  const convertPromotionValue = (row: PromotionType) => {
    const { AMOUNT, PERCENTAGE } = DISCOUNT_METHOD;

    return row?.discount_method === AMOUNT
      ? `${fCurrency2(row.discount_amount)} vnd`
      : row?.discount_method === PERCENTAGE
      ? `${row.discount_percent}%`
      : `${row?.available_variants?.[0].variant.name}`;
  };

  const newData = useMemo(() => {
    return map(data.data, (item) => ({
      ...item,
      requirements: reduce(
        item.requirements,
        (prevArr, current) => {
          const value = convertValueRequirement(current);
          return value ? [...prevArr, value] : prevArr;
        },
        []
      ).toString(),
      applied_variant: getObjectPropSafely(() => item.applied_variant.name),
      value: convertPromotionValue(item),
      note: item.note,
      created_by: item?.created_by?.name || "---",
    }));
  }, [data.data]);

  const renderHeader = () => {
    return (
      <HeaderFilter
        dataExport={newData}
        arrDate={["date_start", "date_end"]}
        columns={{
          columnsShow: columnShowHeader,
          resultColumnsShow: columnShowHeader,
          columnShowExport: columnShowHeader,
        }}
      />
    );
  };

  return (
    <Card sx={{ p: 2 }}>
      {renderHeader()}
      <PromotionTable
        heightTable={700}
        onRefresh={loadTable}
        columns={columns}
        defaultColumnWidths={PROMOTION_COLUMN_WIDTHS}
        hiddenColumnNames={PROMOTION_HIDDEN_COLUMN_NAMES}
        defaultColumnOrders={map(PROMOTION_COLUMN_WIDTHS, (item) => item.columnName)}
        data={{ data: data.data, loading: data.loading, count: data.total }}
        params={params}
        setParams={setParams}
      />
    </Card>
  );
};

export default PromotionVariant;
