import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "../..";

const NotBuyTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      tabName="no_order"
      params={context?.notOrderParams}
      isFullRow={context?.isFullNotOrder || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.notOrderColumnsWidth}
      setColumnWidths={context?.setNotOrderColumnsWidth}
      columnOrders={context?.notOrderCO}
      setColumnOrders={context?.setNotOrderCO}
      isSearchInput
      setParams={(list) =>
        context?.setNotOrderParams((params: any) => {
          return { ...params, ...list };
        })
      }
      hiddenColumnNames={context?.notOrderHC}
      setHiddenColumnNames={context?.setNotOrderHC}
      isFilterChannel
      isFilterAds
      isFilterFanpage
      isFilterHandler
      isFilterProcessTime
      isFilterCreator
      isFilterProduct
      isFilterCustomerType
      isFilterHandleStatus
      isFilterFailReason
      isFilterCallLaterAt
      // isFilterDataStatus
      isFilterCreatedDate
      isFilterAssignedDate
      isHandleByLabel
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullNotOrder}
    />
  );
};

export default NotBuyTab;
