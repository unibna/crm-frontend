import { CustomerType } from "_types_/CustomerType";
import vi from "locales/vi.json";
import { fDate, fDateTime } from "utils/dateUtil";
import { RANK_CHIP_OPTIONS } from "../components/CustomerDetail/Overview/RankField";

export const formatExportCustomer = (item: CustomerType) => {
  return {
    [vi.customer.created]: fDateTime(item.created),
    [vi.customer.name]: item.full_name,
    [vi.customer.phone]: item.phone,
    [vi.customer.birthday]: fDate(item.birthday),
    [vi.customer.gender]: item.gender?.toString() === "1" ? "Nam" : "Nữ",
    [vi.customer.tags]: item.tags?.join(",\n"),
    [vi.customer.address]: (
      item.shipping_addresses?.find((address) => address.is_default) || item.shipping_addresses?.[0]
    )?.address,
    [vi.customer.ranking]: RANK_CHIP_OPTIONS.find((rank) => rank.value.toString() === item.ranking)
      ?.label,
    [vi.customer.latest_up_rank_date]: fDate(item.latest_up_rank_date),
    [vi.customer.shipping_completed_order]: item.shipping_completed_order,
    [vi.customer.shipping_completed_spent]: item.shipping_completed_spent,
  };
};
