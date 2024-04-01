import { PhoneLeadReportType } from "_types_/PhoneLeadType";
import vi from "locales/vi.json";
import find from "lodash/find";
import omit from "lodash/omit";
import pick from "lodash/pick";
import { fDate, fDateTime } from "utils/dateUtil";
import { FULL_LEAD_STATUS_OPTIONS, REPORT_KEYS } from "views/LeadCenterView/constants";
import { formatReportPhoneLeadValue } from "./formatData";

const PHONE_LEAD_OBJECT_KEY = "phone_lead";

export const formatExportFunction = (item: any, keys: string[]) => {
  let itemClone: any = {};
  const zero = "0 - 0%";

  for (const key in pick(item, keys)) {
    const phoneReportKey = key as keyof typeof vi.phone_lead_report;
    if (vi.phone_lead_report[phoneReportKey]) {
      if (REPORT_KEYS.includes(key)) {
        itemClone[vi.phone_lead_report[phoneReportKey]] = item.total
          ? formatReportPhoneLeadValue(key, item, item[key as keyof PhoneLeadReportType])
          : zero;
      } else {
        itemClone[vi.phone_lead_report[phoneReportKey]] = item[key as keyof PhoneLeadReportType];
      }
    }
  }
  return itemClone;
};

export const exportExcelPhoneLeadUtil = (item: any) => {
  const itemClone = omit(item, [
    "id",
    "ad_id",
    "process_done_at",
    "tags",
    "customer_info",
    "handle_info",
    "lead_info",
    "product_info",
    "validate_info",
  ]);

  let newItem: any = {};

  for (let keyOj in itemClone) {
    const phoneLeadKey = keyOj as keyof typeof vi.phone_lead;
    const localKey = keyOj as keyof typeof vi;
    switch (keyOj) {
      case "channel":
      case "handle_reason":
      case "fanpage":
      case "created_by":
      case "product":
      case "handle_by":
      case "modified_by":
      case "bad_data_reason":
      case "fail_reason":
      case "data_status":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj] ? itemClone[keyOj].name : null;
        break;
      case "handle_status":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj]
          ? "handle_status_field.call" + " " + itemClone[keyOj]
          : null;
        break;
      case "call_later_at":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj]
          ? fDateTime(itemClone[keyOj])
          : null;
        break;
      case "lead_status":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj]
          ? find(FULL_LEAD_STATUS_OPTIONS, (lead) => lead.value === itemClone[keyOj])?.label
          : null;
        break;
      case "created":
      case "handler_assigned_at":
      case "modified":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj]
          ? fDate(itemClone[keyOj])
          : null;
        break;
      case "is_duplicated_ip":
      case "is_existed":
      case "is_new_customer":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj] ? "Phải" : "Không phải";
        break;
      case "is_valid":
        newItem[vi[PHONE_LEAD_OBJECT_KEY][keyOj]] = itemClone[keyOj] ? "Không phải" : "Phải";
        break;
      default:
        if (keyOj === "additional_data") {
          newItem = { ...newItem, ...exportExcelPhoneLeadUtil(itemClone[keyOj]) };
        }
        if (vi[PHONE_LEAD_OBJECT_KEY][phoneLeadKey]) {
          newItem[vi[PHONE_LEAD_OBJECT_KEY][phoneLeadKey]] = itemClone[keyOj];
        } else if (vi[localKey]) {
          newItem[vi[localKey] as keyof typeof newItem] = itemClone[keyOj];
        } else {
          newItem[keyOj] = itemClone[keyOj]?.toString();
        }
        break;
    }
  }
  return newItem;
};
