// hooks
import { useContext } from "react";

//contexts
import { OrderContext } from "views/OrderView";

//utils
import { ORDER_COLUMNS } from "views/OrderView/constants/columns";

//components
import OrderContainer from "views/OrderView/components/OrderContainer";

const Success = () => {
  const context = useContext(OrderContext);

  return (
    <div className="relative">
      <OrderContainer
        tabName="completed"
        isFilterTag
        isFilterCrossSale
        columns={ORDER_COLUMNS}
        columnWidths={context?.tabAllCW}
        setColumnWidths={context?.setTabAllCW}
        isFullRow={context?.isFullCompleted}
        columnOrders={context?.completedCO}
        setColumnOrders={context?.setCompletedCO}
        hiddenColumnNames={[...(context?.completedHC || []), "cancel_reason"]}
        setHiddenColumnNames={context?.setCompletedHC}
        setFullRow={() => context?.setFullCompleted?.((prev) => !prev)}
        isFilterCreator
        isFilterCarrierStatus
        isFilterConfirmDate
        isFilterTrackingCompany
        isFilterPaymentType
        isFilterDate
        isSearch
        isFilterSource
        params={context?.completedParams}
        setParams={context?.setCompletedParams}
        columnShowSort={context?.completedShowSort}
        setColumnShowSort={context?.setColumnCompletedShowSort}
      />
    </div>
  );
};
export default Success;
