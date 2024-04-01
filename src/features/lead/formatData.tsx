import { PhoneLeadResType } from "_types_/PhoneLeadType";
import omit from "lodash/omit";
import pick from "lodash/pick";
import { fNumber } from "utils/formatNumber";
import AssignCard from "./cards/AssignCard";
import CreateCard from "./cards/CreateCard";
import CustomerCard from "./cards/CustomerCard";
import HandleInfoCard from "./cards/HandleInfoCard";
import LeadStatusCard from "./cards/LeadStatusCard";
import ProductInfoCard from "./cards/ProductInfoCard";
import ValidateInfoCard from "./cards/ValidateInfoCard";
import AdsCard from "./cards/AdsCard";

export const formatLeadData = (item: PhoneLeadResType) => {
  const createdInfo = pick(item, ["created", "created_by"]);
  const customerInfo = pick(item, [
    "name",
    "phone",
    "is_new_customer",
    "created",
    "created_by",
    "handler_assigned_at",
    "channel",
    "lead_status",
    "call_later_at",
  ]);

  const handleInfo = {
    ...pick(item, [
      "modified_by",
      "recent_handling",
      "call_later_at",
      "handle_status",
      "order_information",
      "modified",
    ]),
  };
  const assignInfo = {
    ...pick(item, ["handle_by", "handler_assigned_at"]),
  };

  const adsInfo = {
    ...pick(item, ["ad_id", "ad_id_content", "ad_channel"]),
  };

  const leadInfo = pick(item, [
    "lead_status",
    "order_information",
    "handle_status",
    "bad_data_reason",
    "handle_reason",
    "fail_reason",
    "order_id",
    "data_status",
  ]);

  const validateInfo = pick(item, [
    "is_existed",
    "is_duplicated_ip",
    "is_valid",
    "ip_address",
    "os",
  ]);

  const productInfo = pick(item, [
    "product",
    "fanpage",
    "landing_page_url",
    "channel",
    "order_information",
    "fail_reason",
  ]);
  return {
    ...item,
    customer_info: {
      value: customerInfo,
      content: <CustomerCard {...customerInfo} />,
    },
    handle_info: {
      value: handleInfo,
      content: <HandleInfoCard {...handleInfo} />,
    },
    lead_info: {
      value: leadInfo,
      content: <LeadStatusCard {...leadInfo} />,
    },
    validate_info: {
      value: validateInfo,
      content: <ValidateInfoCard {...validateInfo} />,
    },
    product_info: {
      value: productInfo,
      content: <ProductInfoCard {...productInfo} />,
    },
    created_info: {
      value: createdInfo,
      content: <CreateCard {...createdInfo} />,
    },
    assign_info: {
      value: assignInfo,
      content: <AssignCard {...assignInfo} />,
    },
    ads_info: {
      value: adsInfo,
      content: <AdsCard {...adsInfo} />,
    },
  };
};

export const formatReportPhoneLeadValue = (
  columnName: string,
  row: any,
  value?: number | string
) => {
  row = omit(row, ["post_qualified_exclude_crm"]);

  const zero = "0 - 0%";
  let result = "";
  switch (columnName) {
    case "total":
    case "new_lead":
      result = fNumber(value);
      break;
    case "qualified":
      result = value
        ? fNumber(value) + " - " + Math.round((row.qualified * 100) / row.pre_qualified) + " %"
        : zero;
      break;
    case "post_not_qualified":
      result = value
        ? fNumber(value) +
          " - " +
          Math.round((row.post_not_qualified * 100) / row.pre_qualified) +
          " %"
        : zero;
      break;
    case "processing":
      result = value
        ? fNumber(value) + " - " + Math.round((row.processing * 100) / row.pre_qualified) + " %"
        : zero;
      break;
    case "processed":
      result = value
        ? fNumber(value) + " - " + Math.round((row.processed * 100) / row.pre_qualified) + " %"
        : zero;
      break;
    case "buy":
      result = value
        ? fNumber(value) + " - " + Math.round((row.buy * 100) / row.processed) + " %"
        : "0 - 0 %";
      break;
    case "not_buy":
      result = value
        ? fNumber(value) + " - " + Math.round((row.not_buy * 100) / row.processed) + " %"
        : zero;
      break;
    case "buy_rate":
      result = value ? Math.round((row.buy * 100) / row.post_qualified) + " %" : zero;
      break;
    default:
      result = value
        ? fNumber(value) +
          " - " +
          Math.round((parseInt(value?.toString()) * 100) / row.total) +
          " %"
        : zero;
      break;
  }

  return result;
};

export const formatReportGroupItem = ({
  columnName,
  value,
  row,
}: {
  columnName: string;
  value: string;
  row: any;
}) => {
  let result = "";
  const zero = "0 - 0%";

  switch (columnName) {
    case "total_lead":
    case "telesale":
      result = fNumber(value);
      break;

    case "purchase_rate":
      result = Math.round(((row?.buy_lead || 0) * 100) / (row?.assigned_lead || 1)) + "%";
      break;

    default:
      result =
        value && row?.total_lead
          ? `${fNumber(value)} - ${Math.round(
              (parseInt(value?.toString()) * 100) / (row?.total_lead || 1)
            )}%`
          : zero;
      break;
  }

  return fNumber(value);
};

export const formatReportPhoneLeadValueV2 = (
  columnName: string,
  row: any,
  value?: number | string
) => {
  let result = "";
  const zero = "0 - 0%";

  switch (columnName) {
    case "total_lead":
    case "telesale":
      result = fNumber(value);
      break;

    case "purchase_rate":
      result = Math.round(((row?.buy_lead || 0) * 100) / (row?.assigned_lead || 1)) + "%";
      break;

    default:
      result =
        value && row?.total_lead
          ? `${fNumber(value)} - ${Math.round(
              (parseInt(value?.toString()) * 100) / (row?.total_lead || 1)
            )}%`
          : zero;
      break;
  }

  return result;
};
