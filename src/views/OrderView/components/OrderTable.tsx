import { DGridType } from "_types_/DGridType";
import { OrderStatusValue } from "_types_/OrderType";
import TableWrapper from "components/Tables/TableWrapper";
import AttributeColumn from "components/Tables/columns/AttributeColumn";
import BooleanColumn from "components/Tables/columns/BooleanColumn";
import DateColumn from "components/Tables/columns/DateColumn";
import HistoryTypeColumn from "components/Tables/columns/HistoryTypeColumn";
import ListChipColumn from "components/Tables/columns/ListChipColumn";
import NumberColumn from "components/Tables/columns/NumberColumn";
import UserColumn from "components/Tables/columns/UserColumn";
import {
  CDPOrderColumn,
  CancelReasonColumn,
  CustomerColumn,
  HandleInfoColumn,
  OrderColumn,
  OrderGeneralColumn,
  OrderPaymentColumn,
  OrderPaymentStatusColumn,
  OrderProductColumn,
  OrderShippingColumn,
  OrderShippingDetailColumn,
  OrderStatusColumn,
  PrintInfoColumn,
} from "./columns";
import { OrderShippingDetailColumnProps } from "./columns/OrderShippingDetailColumn";

export interface OrderTableType extends Partial<DGridType>, OrderShippingDetailColumnProps {
  tabName?: OrderStatusValue | "shipping";
  onRefresh?: () => void;
}
const OrderTable = (props: OrderTableType) => {
  const {
    shipping_isShowCreateBy,
    shipping_isShowExpectedDate,
    shipping_isShowFromAddress,
    shipping_isShowToAddress,
    onRefresh,
    tabName,
    params,
  } = props;

  return (
    <TableWrapper cellStyle={{ height: 160 }} {...props}>
      <OrderProductColumn />
      <OrderStatusColumn />
      <HandleInfoColumn for={["modify_info"]} />
      <UserColumn for={["printed_by"]} />
      <CustomerColumn for={["customer_phone"]} />
      <DateColumn
        for={["printed", "completed_time"]}
        arrTimeColumn={["printed", "completed_time"]}
      />
      <OrderShippingColumn
        shipping_isShowCreateBy={shipping_isShowCreateBy}
        shipping_isShowExpectedDate={shipping_isShowExpectedDate}
        shipping_isShowFromAddress={shipping_isShowFromAddress}
        shipping_isShowToAddress={shipping_isShowToAddress}
      />
      <OrderShippingDetailColumn
        shipping_isShowCreateBy={shipping_isShowCreateBy}
        shipping_isShowExpectedDate={shipping_isShowExpectedDate}
        shipping_isShowFromAddress={shipping_isShowFromAddress}
        shipping_isShowToAddress={shipping_isShowToAddress}
      />
      <CDPOrderColumn />
      <OrderGeneralColumn for={["general"]} />
      <CancelReasonColumn />
      <OrderPaymentStatusColumn for={["payment_status"]} onRefresh={onRefresh} />
      <OrderColumn tabName={tabName} params={params} />
      <OrderPaymentColumn />
      <NumberColumn for={["total"]} />
      <ListChipColumn for={["tags"]} />
      <HistoryTypeColumn />
      <AttributeColumn for={["source"]} />
      <PrintInfoColumn for={["is_printed"]} />
      <BooleanColumn for={["is_cross_sale"]} />
    </TableWrapper>
  );
};

export default OrderTable;
