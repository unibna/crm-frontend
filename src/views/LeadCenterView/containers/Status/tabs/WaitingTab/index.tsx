import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_STATUS } from "views/LeadCenterView/constants";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "../..";

const WaitingTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      tabName="waiting"
      params={context?.waitingParams}
      isFullRow={context?.isFullWaitingTable || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.waitingColumnsWidth}
      setColumnWidths={context?.setWaitingColumnsWidth}
      columnOrders={context?.waitingCO}
      setColumnOrders={context?.setWaitingCO}
      isSearchInput
      setParams={(list) =>
        context?.setWaitingParams((params: any) => {
          return { ...params, ...list };
        })
      }
      isFilterChannel
      isFilterFanpage
      isFilterHandler
      isFilterAds
      isFilterProcessTime
      isFilterCreator
      isFilterProduct
      isFilterCustomerType
      isFilterFailReason
      isFilterCallLaterAt
      isFilterHandleStatus
      // isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      // isFilterCallAttribute
      hiddenColumnNames={context?.waitingHC}
      setHiddenColumnNames={context?.setWaitingHC}
      rowDetail
      statusCheckNewItems={[LEAD_STATUS.WAITING]}
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullWaitingTable}
    />
  );
};

export default WaitingTab;
