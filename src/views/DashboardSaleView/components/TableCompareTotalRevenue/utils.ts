import { SaleReportCompareTotalRevenue } from "_types_/SaleReportType";
import { COMMAS_REGEX } from "constants/index";
import { fPercent, fPercentOmitDecimal } from "utils/formatNumber";
import { ItemColumns } from "views/DashboardSaleView/context";

export const formatExportSaleCompareTotalRevenue = (
  item: SaleReportCompareTotalRevenue,
  totalRevenue: ItemColumns
): { [key: string]: unknown } => {
  console.log("item", item);

  const _resultColumns = totalRevenue.resultColumnsShow.map((column) => {
    const band = totalRevenue.columnsBand?.find((band) =>
      band.children?.map((bandChild) => bandChild.columnName).includes(column.name)
    );
    return {
      ...column,
      bandTitle: band?.title || "",
    };
  });
  return _resultColumns.reduce((objExport, column: any) => {
    const { name, title, bandTitle } = column;
    const titleWithBand = bandTitle ? `[${bandTitle}]${title}` : title;
    switch (name) {
      case "aov_1":
      case "aov_2":
      case "total_revenue_1":
      case "total_revenue_2":
        if (item[name]) {
          objExport[titleWithBand] = `${Math.floor(item[name] ? item[name] : 0)
            ?.toString()
            .replace(COMMAS_REGEX, ",")} đ`;
        }
        break;
      case "aov_change":
      case "total_revenue_change":
        if (item[name]) {
          objExport[titleWithBand] = `${Math.floor(item[name].value ? item[name].value : 0)
            ?.toString()
            .replace(COMMAS_REGEX, ",")} đ`;
        }
        break;
      case "aov_percent_change":
      case "buy_lead_percent_change":
        if (item[name]) {
          objExport[titleWithBand] = `${item[name].isIncrease ? "+" : "-"} ${Math.floor(
            item[name].value * 100
          )
            ?.toString()
            .replace(COMMAS_REGEX, ",")} %`;
        }
        break;
      case "buy_ratio_1":
      case "buy_ratio_2":
        objExport[titleWithBand] = `${Math.floor(item[name] * 100)} %`;
        break;
      case "buy_ratio_change":
        objExport[titleWithBand] = `${item[name].isIncrease ? "+" : "-"} ${Math.floor(
          item[name].value * 100
        )}`;
        break;
      case "assigned_lead_percent_change":
      case "new_lead_percent_change":
      case "not_buy_lead_percent_change":
      case "processed_lead_percent_change":
      case "qualified_lead_percent_change":
      case "total_customer_percent_change":
      case "total_lead_percent_change":
      case "total_order_percent_change":
      case "total_revenue_percent_change":
      case "unassigned_lead_percent_change":
      case "buy_ratio_percent_change":
      case "waiting_lead_percent_change":
        if (item[name]) {
          objExport[titleWithBand] = `${item[name].isIncrease ? "+" : "-"} ${fPercent(
            item[name].value
          )} `;
        }
        break;
      case "not_buy_lead_change":
      case "buy_lead_change":
      case "total_lead_change":
      case "processed_lead_change":
      case "qualified_lead_change":
      case "total_customer_change":
      case "total_order_change":
      case "unassigned_lead_change":
      case "waiting_lead_change":
      case "assigned_lead_change":
        if (item[name]) {
          objExport[titleWithBand] = `${item[name].isIncrease ? "+" : "-"} ${Math.abs(
            item[name].value
          )}`;
        }
        break;
      default:
        if (item[name]) {
          objExport[titleWithBand] = item[name];
        }
        break;
    }

    return objExport;
  }, {});
};
