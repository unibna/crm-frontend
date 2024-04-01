import { useContext } from "react";
import LeadContainer from "views/LeadCenterView/components/LeadContainer";
import { LEAD_CENTER_COLUMNS } from "views/LeadCenterView/constants/columns";
import { PhoneLeadContext } from "views/LeadCenterView/containers/Status";

const BadDataTab = () => {
  const context = useContext(PhoneLeadContext);

  return (
    <LeadContainer
      tabName="bad_data"
      params={context?.badDataParams}
      isFullRow={context?.isFullBadDataTable || false}
      columns={LEAD_CENTER_COLUMNS}
      columnWidths={context?.badDataColumnsWidth}
      setColumnWidths={context?.setBadDataColumnsWidth}
      columnOrders={context?.badDataHO}
      setColumnOrders={context?.setBadDataHO}
      isSearchInput
      setParams={(list) =>
        context?.setBadDataParams((params: any) => {
          return { ...params, ...list };
        })
      }
      isFilterChannel
      isFilterFanpage
      isFilterAds
      isFilterHandler
      isFilterProcessTime
      isFilterCreator
      isFilterCustomerType
      isFilterProduct
      isFilterFailReason
      isFilterCallLaterAt
      isFilterHandleStatus
      isFilterDataStatus
      isFilterBadDataReason
      isFilterCreatedDate
      isFilterAssignedDate
      isHandleByLabel
      hiddenColumnNames={context?.badDataHC}
      setHiddenColumnNames={context?.setBadDataHC}
      rowDetail
      columnShowSort={context?.columnShowSort}
      setColumnShowSort={context?.setColumnShowSort}
      setFullRow={context?.setFullBadDataTable}
    />
  );
};

export default BadDataTab;
