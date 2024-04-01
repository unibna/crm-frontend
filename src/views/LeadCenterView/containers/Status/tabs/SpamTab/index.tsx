import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";

const SpamTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      tabName="spam"
      params={context?.spamParams}
      isFullRow={context?.isFullSpamTable || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.spamColumnsWidth}
      setColumnWidths={context?.setSpamColumnsWidth}
      columnOrders={context?.spamCO}
      setColumnOrders={context?.setSpamCO}
      isSearchInput
      setParams={(list) =>
        context?.setSpamParams((params: any) => {
          return { ...params, ...list };
        })
      }
      isFilterChannel
      isFilterCustomerType
      isFilterFanpage
      isFilterCreator
      isFilterProduct
      isFilterAds
      isFilterCreatedDate
      hiddenColumnNames={context?.spamHC}
      setHiddenColumnNames={context?.setSpamHC}
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullSpamTable}
      isHandleByLabel
      isShowAddLeadColumn
    />
  );
};

export default SpamTab;
