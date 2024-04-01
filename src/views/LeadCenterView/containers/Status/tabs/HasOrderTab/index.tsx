import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "../..";

const HaveBoughtTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      tabName="has_order"
      params={context?.hasOrderParams}
      isFullRow={context?.isFullHasOrderTable || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.hasOrderColumnsWidth}
      setColumnWidths={context?.setHasOrderColumnsWidth}
      columnOrders={context?.hasOrderCO}
      setColumnOrders={context?.setHasOrderCO}
      isSearchInput
      setParams={(list) =>
        context?.setHasOrderParams((params: any) => {
          return { ...params, ...list };
        })
      }
      isFilterChannel
      isFilterFanpage
      isFilterHandler
      isFilterAds
      isFilterCallLaterAt
      isFilterProcessTime
      isFilterCreator
      isFilterCustomerType
      isFilterHandleStatus
      isFilterProduct
      isFilterFailReason
      isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      isHandleByLabel
      hiddenColumnNames={context?.hasOrderHC}
      setHiddenColumnNames={context?.setHasOrderHC}
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullHasOrderTable}
    />
  );
};

export default HaveBoughtTab;
