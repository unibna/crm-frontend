import { OrderPaymentTypeV2, OrderPaymentTypeValue } from "_types_/OrderType";
import vi from "locales/vi.json";
import { fDateTime } from "utils/dateUtil";
import { PAYMENT_TYPES } from "views/OrderView/constants";
import { ORDER_STATUS } from "views/OrderView/constants/options";

export const formatExportOrder = (item: any) => {
  const objStatusLabel = ORDER_STATUS.reduce(
    (prev, current) => ({
      ...prev,
      [current.value]: current.label,
    }),
    {}
  );

  const calcPaymentAmount = (type: OrderPaymentTypeValue) => {
    if (item.payments && item.payments.length > 0) {
      const temp = item.payments.find(
        (itemPayment: OrderPaymentTypeV2) => itemPayment.type === type
      );
      return temp ? temp.amount : 0;
    }
    return 0;
  };

  let newItem = {
    ecommerce_code: item.ecommerce_code,
    customer_offline_code: item.customer_offline_code,
    order_key: item.order_key,
    status: objStatusLabel[item.status as keyof typeof objStatusLabel],
    source_name: item?.source?.name || "",
    tags: item?.tags?.join(" "),
    created: fDateTime(item?.created),
    created_by: item?.created_by?.name || "",
    modified: fDateTime(item.modified),
    modified_by: item?.modified_by?.name || "",
    is_cross_sale: item?.is_cross_sale ? "Đơn CrossSale" : "",
    cross_sale_amount: item?.is_cross_sale ? item?.cross_sale_amount : "",
    ...(item?.variant_name && {
      variant_name: item?.variant_name,
      variant_SKU: item?.variant_SKU,
      variant_price: item?.variant_price,
      variant_quantity: item?.variant_quantity,
      variant_total: item?.variant_total,
    }),
    customer_name: item?.customer_name,
    customer_phone: item?.customer_phone,
    note: item?.note,
    cancel_reason: item?.cancel_reason,
    shipping_tracking_number: item?.shipping?.tracking_number || "",
    shipping_created: fDateTime(item?.shipping?.created) || "",
    shipping_expected_delivery_time: fDateTime(item?.shipping?.expected_delivery_time) || "",
    shipping_return_full_address: item?.shipping?.return_full_address || "",
    shipping_to_full_address: item?.shipping?.to_full_address || "",
    shipping_delivery_note: item?.shipping?.delivery_note || "",
    payment_total_variant_quantity: item?.total_variant_quantity || "",
    payment_total_variant_all: item?.total_variant_all || "",
    payment_total_variant_actual: item?.total_variant_actual || 0,
    payment_fee_delivery: item?.fee_delivery || 0,
    payment_fee_additional: item?.fee_additional || 0,
    payment_discount_input: item?.discount_input || 0,
    payment_discount_promotion: item?.discount_promotion || 0,
    payment_total_actual: item?.total_actual || 0,
    payment_direct_transfer: calcPaymentAmount(PAYMENT_TYPES.DIRECT_TRANSFER),
    payment_cod: calcPaymentAmount(PAYMENT_TYPES.COD),
    payment_cash: calcPaymentAmount(PAYMENT_TYPES.CASH),
    payment_note: item?.payment_note || "",
    is_printed: item?.is_printed ? "Đã in đơn" : "Chưa in đơn",
    printed_at: fDateTime(item?.printed_at),
    printed_by: item?.printed_by?.name || "",
  };

  const objExport = Object.keys(newItem).reduce((prev: any, current: keyof typeof vi.order) => {
    return {
      ...prev,
      [vi.order[current]]: newItem[current],
    };
  }, {});

  return objExport;
};
