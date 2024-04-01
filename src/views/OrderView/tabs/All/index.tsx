// hooks
import { useContext } from "react";

//contexts
import { OrderContext } from "views/OrderView";

//utils
import { ORDER_COLUMNS } from "views/OrderView/constants/columns";

//components
import OrderContainer from "views/OrderView/components/OrderContainer";

const All = () => {
  const context = useContext(OrderContext);

  return (
    <div className="relative">
      <OrderContainer
        tabName="all"
        isFilterTag
        isFilterCrossSale
        isFilterCarrierStatus
        isFilterOrderStatus
        isFullRow={context?.tabAllIsFullRow}
        setFullRow={() => context?.setFullTabAll?.((prev) => !prev)}
        columns={[{ name: "status", title: "Trạng thái đơn hàng" }, ...ORDER_COLUMNS]}
        columnWidths={context?.tabAllCW}
        setColumnWidths={context?.setTabAllCW}
        isFilterCreator
        columnOrders={context?.tabAllCO}
        setColumnOrders={context?.setTabAllCO}
        hiddenColumnNames={context?.tabAllHC}
        setHiddenColumnNames={context?.setTabAllHC}
        isFilterTrackingCompany
        isFilterConfirmDate
        isFilterPaymentType
        isFilterDate
        isFilterSource
        isSearch
        params={context?.tabAllParams}
        setParams={context?.setTabAllParams}
        columnShowSort={context?.tabAllShowSort}
        setColumnShowSort={context?.setColumnAllShowSort}
      />
    </div>
  );
};

export default All;
