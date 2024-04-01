// hooks
import { useContext } from "react";

//contexts
import { OrderContext } from "views/OrderView";

// utils
import { ORDER_COLUMNS } from "views/OrderView/constants/columns";

//components
import OrderContainer from "views/OrderView/components/OrderContainer";

const Canceled = () => {
  const context = useContext(OrderContext);

  return (
    <div className="relative">
      <OrderContainer
        tabName="cancel"
        isFilterTag
        isFilterCrossSale
        isFullRow={context?.isFullCanceled}
        columns={ORDER_COLUMNS}
        columnWidths={context?.tabAllCW}
        setColumnWidths={context?.setTabAllCW}
        columnOrders={context?.canceledCO}
        setColumnOrders={context?.setCanceledCO}
        hiddenColumnNames={context?.canceledHC}
        setHiddenColumnNames={context?.setCanceledHC}
        setFullRow={() => context?.setFullCanceled?.((prev) => !prev)}
        isFilterCreator
        isFilterDate
        isFilterTrackingCompany
        isFilterCarrierStatus
        isFilterSource
        isSearch
        params={context?.canceledParams}
        setParams={context?.setCanceledParams}
        columnShowSort={context?.columnCanceledShowSort}
        setColumnShowSort={context?.setColumnCanceledShowSort}
      />
    </div>
  );
};

export default Canceled;
