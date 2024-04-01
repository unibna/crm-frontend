import { OrderShippingTransportationHistory } from "components/OrderShippingTransportationHistory";
import { memo } from "react";

const OrderRowDetail = memo(({ row, defaultTab }: { row: any; defaultTab?: string }) => {
  return (
    <OrderShippingTransportationHistory
      row={{ ...row, order: row }}
      pickCategoriesHistory={["ORDER_HISTORY", "SHIPPING_HISTORY", "TRANSPORTATION_HISTORY"]}
      defaultTab={defaultTab}
    />
  );
});

export default OrderRowDetail;
