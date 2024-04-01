import { ReportVoipType } from "_types_/PhoneLeadType";
import vi from "locales/vi.json";
import { fDateTime, formatISOToLocalDateString } from "utils/dateUtil";

export const formatExportReportVoip = (item: ReportVoipType) => {
  return {
    [vi.voip.date]: fDateTime(formatISOToLocalDateString(item.date)),
    [vi.voip.telephonist]: item.telephonist,
    [vi.voip.business_call_type__value]: item.business_call_type__value,
    [vi.voip.total]: item.total,
    [vi.voip.inbound]: item.inbound,
    [vi.voip.missed_inbound]: item.missed_inbound,
    [vi.voip.outbound]: item.outbound,
    [vi.voip.missed_outbound]: item.missed_outbound,
  };
};
