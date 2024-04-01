import { DGridType } from "_types_/DGridType";
import { PhoneLeadTabNameType } from "_types_/PhoneLeadType";
import ColumnOptional from "components/DDataGrid/components/ColumnOptional";
import AttributeColumn from "components/Tables/columns/AttributeColumn";
import DPhoneColumn from "components/Tables/columns/DPhoneColumn";
import DateTimeColumn from "components/Tables/columns/DateTimeColumn";
import HistoryTypeColumn from "components/Tables/columns/HistoryTypeColumn";
import ListChipColumn from "components/Tables/columns/ListChipColumn";
import UserColumn from "components/Tables/columns/UserColumn";
import WarningMinuteColumn from "components/Tables/columns/WarningMinuteColumn";
import TableWrapper from "components/Tables/TableWrapper";
import { memo } from "react";
import AdditionalDataColumn from "views/LeadCenterView/components/columns/AdditionalDataColumn";
import DataStatusSelectColumn, {
  DataStatusProps,
} from "views/LeadCenterView/components/columns/DataStatusSelectColumn";
import HandleByActionColumn, {
  HandleByColumnProps,
} from "views/LeadCenterView/components/columns/HandleByActionColumn";
import HandleStatusColumn from "views/LeadCenterView/components/columns/HandleStatusColumn";
import IsExistIsValidColumn from "views/LeadCenterView/components/columns/IsExistIsValidColumn";
import LandingPageColumn from "views/LeadCenterView/components/columns/LandingPageColumn";
import AddLeadColumn, { AddLeadColumnProps } from "../columns/AddLeadColumn";
import AutoLeadColumn from "../columns/AutoLeadColumn";
import LeadStatusColumn from "../columns/LeadStatusColumn";
import UserOnlineStatusSwitchColumn from "../columns/UserOnlineStatusSwitchColumn";

export interface LeadTableProps
  extends Partial<DGridType>,
    DataStatusProps,
    HandleByColumnProps,
    AddLeadColumnProps {
  tabName?: PhoneLeadTabNameType;
  isReport?: boolean;
  contentOptional?: {
    arrColumnOptional: string[];
  };
}

const LeadTable = ({
  onRefresh,
  tabName,
  isReport,
  contentOptional,
  isDataStatusLabel,
  onSubmitChangeHandleByItem,
  onDataStatusCheckbox,
  onSubmitChangeDataStatusItem,
  onHandleByByCheckbox,
  isShowAddLeadColumn,
  ...props
}: LeadTableProps) => {
  return (
    <TableWrapper {...props}>
      <DateTimeColumn for={["call_later_at"]} />
      <AutoLeadColumn />
      <UserOnlineStatusSwitchColumn />
      <LeadStatusColumn for={["lead_status"]} />
      <AdditionalDataColumn />
      <DPhoneColumn />
      <HistoryTypeColumn />
      <AttributeColumn
        isReport={isReport}
        editColumnNames={[
          "channel",
          "handle_reason",
          "fanpage",
          "created_by",
          "product",
          "handle_by",
          "modified_by",
          "fail_reason",
          "bad_data_reason",
          "history_user",
        ]}
      />
      <UserColumn />
      <LandingPageColumn />
      <AddLeadColumn onRefresh={onRefresh} isShowAddLeadColumn={isShowAddLeadColumn} />
      <DataStatusSelectColumn
        onSubmitChangeDataStatusItem={onSubmitChangeDataStatusItem}
        onDataStatusCheckbox={onDataStatusCheckbox}
        isDataStatusLabel={isDataStatusLabel}
      />
      <HandleStatusColumn />
      <ListChipColumn for={["old_values", "new_values", "tags"]} />
      <HandleByActionColumn
        onRefresh={onRefresh}
        onHandleByByCheckbox={onHandleByByCheckbox}
        onSubmitChangeHandleByItem={onSubmitChangeHandleByItem}
      />
      <WarningMinuteColumn period={10080} />
      <IsExistIsValidColumn />
      <ColumnOptional for={contentOptional?.arrColumnOptional || []} />
    </TableWrapper>
  );
};

export default memo(LeadTable);
