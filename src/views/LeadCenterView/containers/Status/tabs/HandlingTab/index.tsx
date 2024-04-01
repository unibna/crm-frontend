import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_STATUS } from "views/LeadCenterView/constants";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "../..";

const HandlingTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      tabName="handling"
      params={context?.handlingParams}
      setParams={(list) =>
        context?.setHandlingParams((params: any) => {
          return { ...params, ...list };
        })
      }
      isFullRow={context?.isFullHandlingTable || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.handlingColumnsWidth}
      setColumnWidths={context?.setHandlingColumnsWidth}
      columnOrders={context?.handlingCO}
      setColumnOrders={context?.setHandlingCO}
      isSearchInput
      // statusCheck={[LEAD_STATUS.HANDLING]}
      isChangeHandleByItemInSelector
      isFilterChannel
      isFilterCustomerType
      isFilterFanpage
      isFilterAds
      isFilterCallLaterAt
      isFilterHandler
      isFilterHandleStatus
      isFilterProcessTime
      isFilterCreator
      isFilterHandleReason
      isFilterProduct
      isFilterFailReason
      isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      hiddenColumnNames={context?.handlingHC}
      setHiddenColumnNames={context?.setHandlingHC}
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullHandlingTable}
    />
  );
};

export default HandlingTab;
