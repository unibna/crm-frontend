import { SkycallType } from "_types_/SkycallType";
import vi from "locales/vi.json";
import { fDateTime, formatISOToLocalDateString } from "utils/dateUtil";

export const formatExportVoip = (item: SkycallType) => {
  return {
    [vi.voip.calldate]: fDateTime(formatISOToLocalDateString(item.date_from)),
    [vi.voip.telephonist]: item.telephonist_name,
    [vi.voip.customer_number]: item.customer_number,
    [vi.voip.hotline_number]: item.hotline_number,
    [vi.voip.download]: item.record_url,
    [vi.voip.type]:
      item.call_type === "callin"
        ? "Cuộc gọi vào"
        : item.call_type === "callout"
        ? "Cuộc gọi ra"
        : "Cuộc gọi nội bộ",
    [vi.voip.billsec]: item.duration,
    [vi.voip.note]: item.sky_call_note,
    [vi.voip.status]: item.call_status ? vi.skycall_status[item.call_status] : "",
  };
};
