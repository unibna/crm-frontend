import { DGridType } from "_types_/DGridType";
import AttributeColumn from "components/Tables/columns/AttributeColumn";
import DPhoneColumn from "components/Tables/columns/DPhoneColumn";
import DateColumn from "components/Tables/columns/DateColumn";
import DateTimeColumn from "components/Tables/columns/DateTimeColumn";
import HistoryTypeColumn from "components/Tables/columns/HistoryTypeColumn";
import NumberColumn from "components/Tables/columns/NumberColumn";
import WarningMinuteColumn from "components/Tables/columns/WarningMinuteColumn";
import TableWrapper from "components/Tables/TableWrapper";
import { memo } from "react";
import AdditionalDataColumn from "views/LeadCenterView/components/columns/AdditionalDataColumn";
import HandleStatusColumn from "views/LeadCenterView/components/columns/HandleStatusColumn";
import IsExistIsValidColumn from "views/LeadCenterView/components/columns/IsExistIsValidColumn";
import LandingPageColumn from "views/LeadCenterView/components/columns/LandingPageColumn";
import LeadReportColumn from "views/LeadCenterView/components/columns/ReportColumn";
import ReportLeadV2Column from "views/LeadCenterView/components/columns/ReportColumnV2";
import LeadStatusColumn from "../columns/LeadStatusColumn";
import BillSecColumn from "views/CDPView/components/columns/BillSecColumn";
import AssignLeadActionColumn from "../columns/AssignLeadActionColumn";

interface Props extends Partial<DGridType> {
  heightTable?: number;
  widthTable?: number;
  hiddenPagination?: boolean;
  totalRow?: any;
  reportFor?: "report_lead_v1" | "report_lead_v2";
  isSorting?: boolean;
  setParams?: (pr: any) => void;
}

const ReportSummaryTable = ({ reportFor, ...props }: Props) => {
  return (
    <TableWrapper cellStyle={{ height: 80 }} {...props}>
      {reportFor === "report_lead_v1" && <LeadReportColumn />}
      {reportFor === "report_lead_v2" && <ReportLeadV2Column />}
      {reportFor === "report_lead_v2" && <AssignLeadActionColumn />}
      <DateColumn
        for={[
          "lasted_created_date",
          "assigned_date",
          "processed_date",
          "created_date",
          "handler_assigned_date",
          "created",
        ]}
      />
      <DateColumn for={["calldate", "date"]} isFormatISO />
      <NumberColumn
        for={[
          "inbound",
          "missed_inbound",
          "missed_outbound",
          "outbound",
          "total",
          "answered_inbound",
          "answered_outbound",
          "busy_outbound",
          "failed_outbound",
        ]}
      />
      <BillSecColumn for={["total_billsec", "total_inbound_billsec", "total_outbound_billsec"]} />
      <DateTimeColumn />
      <LeadStatusColumn for={["lead_status"]} />
      <AdditionalDataColumn />
      <DPhoneColumn />
      <HistoryTypeColumn />
      <AttributeColumn isReport />
      <LandingPageColumn />
      <HandleStatusColumn />
      <WarningMinuteColumn period={10080} />
      <IsExistIsValidColumn />
    </TableWrapper>
  );
};

export default memo(ReportSummaryTable);
