import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";

const AllPhoneLeadTab = () => {
  const context = useContext(PhoneLeadContext);
  return (
    <LeadContainer
      params={context?.allPhoneParams}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.allPhoneColumnsWidth}
      setColumnWidths={context?.setAllPhoneColumnsWidth}
      tabName="all"
      columnOrders={context?.allPhoneCO}
      setColumnOrders={context?.setAllPhoneCO}
      isFilterChannel
      isFilterFanpage
      isFilterHandler
      isImportFile
      isFilterCustomerType
      isAddLeadPhone
      isFilterProcessTime
      isFilterCreator
      isFilterLeadStatus
      isFilterProduct
      isFilterFailReason
      isFilterAds
      isFilterHandleStatus
      isFilterCallLaterAt
      isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      isFilterBadDataReason
      isHandleByLabel
      hiddenColumnNames={context?.allPhoneHC}
      setHiddenColumnNames={context?.setAllPhoneHC}
      isSearchInput
      setParams={(list) =>
        context?.setAllPhoneParams((params: any) => {
          return { ...params, ...list };
        })
      }
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullAllPhoneTable}
      isFullRow={context?.isFullAllPhoneTable}
    />
  );
};

export default AllPhoneLeadTab;
