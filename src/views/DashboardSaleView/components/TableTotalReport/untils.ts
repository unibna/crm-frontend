import { totalReportColumns } from "./../../constants";
import { SaleReportTotal } from "_types_/SaleReportType";
import { COMMAS_REGEX } from "constants/index";
import { fDate } from "utils/dateUtil";
export const formatExportSaleTotal = (item: SaleReportTotal) => {
  const newItem = {
    ...item,
    created_date: fDate(item.created_date),
    assigned_date: fDate(item.assigned_date),
    processed_date: fDate(item.processed_date),
    buy_ratio: `${item.buy_ratio ? item.buy_ratio * 100 : 0} %`,
    aov: `${Math.floor(item.aov ? item.aov : 0)
      ?.toString()
      .replace(COMMAS_REGEX, ",")} đ`,
    total_revenue: `${Math.floor(item.total_revenue ? item.total_revenue : 0)
      ?.toString()
      .replace(COMMAS_REGEX, ",")} đ`,
  };

  return totalReportColumns.columnsShowHeader.reduce((objExport, column) => {
    const { name, title } = column;
    if (name) {
      objExport[title] = newItem[name];
    }
    return objExport;
  }, {});
};
