import { LeadStatusType } from "_types_/PhoneLeadType";
import { LEAD_STATUS } from "views/LeadCenterView/constants";

export const leadStatusColor = (value?: LeadStatusType, data_status?: string) => {
  if (value === LEAD_STATUS.NEW) {
    return data_status ? "#ff5c1c" : "#aeb4b9";
  } else if (value === LEAD_STATUS.WAITING) {
    return "#63676b";
  } else if (value === LEAD_STATUS.SPAM) {
    return "#f1c40f";
  } else if (value === LEAD_STATUS.HANDLING) {
    return "#E9A84C";
  } else if (value === LEAD_STATUS.HAS_ORDER) {
    return "#389b33";
  } else if (value === LEAD_STATUS.NO_ORDER) {
    return "#DC3F34";
  } else if (value === LEAD_STATUS.NOT_QUALITY_DATA) {
    return "#d34500";
  }
  return;
};
