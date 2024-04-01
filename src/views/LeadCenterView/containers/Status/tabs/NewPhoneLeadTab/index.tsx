import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_STATUS } from "views/LeadCenterView/constants";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "../..";

const NewPhoneLeadTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      params={context?.newPhoneParams}
      isFullRow={context?.isFullNewPhoneTable || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.newPhoneColumnsWidth}
      setColumnWidths={(column) => context?.setNewPhoneColumnsWidth(column)}
      tabName="new"
      columnOrders={context?.newPhoneCO}
      setColumnOrders={context?.setNewPhoneCO}
      isSearchInput
      setParams={(list) =>
        context?.setNewPhoneParams((params: any) => {
          return { ...params, ...list };
        })
      }
      statusCheckNewItems={[LEAD_STATUS.NEW]}
      isFilterChannel
      isFilterAds
      isImportFile
      isReportHandleByDaily
      isFilterCustomerType
      isAddLeadPhone
      isFilterFanpage
      isFilterCallLaterAt
      isFilterCreator
      isFilterProduct
      isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      hiddenColumnNames={context?.newPhoneHC}
      setHiddenColumnNames={context?.setNewPhoneHC}
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullNewPhoneTable}
    />
  );
};

export default NewPhoneLeadTab;
