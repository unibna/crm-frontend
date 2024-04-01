//hooks
import { useContext } from "react";

//contenxts
import { OrderContext } from "views/OrderView";

//utils
import { ORDER_COLUMNS } from "views/OrderView/constants/columns";

//components
import OrderContainer from "views/OrderView/components/OrderContainer";

const Draft = () => {
  const context = useContext(OrderContext);

  return (
    <div className="relative">
      <OrderContainer
        tabName="draft"
        isFilterTag
        isFilterCrossSale
        isFullRow={context?.isFullDraft}
        columns={ORDER_COLUMNS}
        columnWidths={context?.tabAllCW}
        setColumnWidths={context?.setTabAllCW}
        columnOrders={context?.draftCO}
        setColumnOrders={context?.setDraftCO}
        hiddenColumnNames={[
          ...(context?.draftHC || []),
          "shipping",
          "expected_delivery_time",
          "cancel_reason",
        ]}
        setHiddenColumnNames={context?.setDraftHC}
        setFullRow={() => context?.setFullDraft?.((prev) => !prev)}
        isFilterCreator
        isFilterSource
        isFilterDate
        isSearch
        params={context?.draftParams}
        setParams={context?.setDraftParams}
        columnShowSort={context?.columnDraftShowSort}
        setColumnShowSort={context?.setColumnDraftShowSort}
      />
    </div>
  );
};

export default Draft;
