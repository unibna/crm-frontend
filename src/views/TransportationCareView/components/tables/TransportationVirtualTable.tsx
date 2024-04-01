import { DGridType } from "_types_/DGridType";
import DPhoneColumn from "components/Tables/columns/DPhoneColumn";
import UserColumn from "components/Tables/columns/UserColumn";
import TableWrapper from "components/Tables/TableWrapper";
import { ROLE_TAB, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { memo } from "react";
import CustomerColumn from "../columns/TransportationCustomerColumn";
import HandleByActionColumn from "../columns/TransportationHandleByActionColumn";
import HandleColumn from "../columns/TransportationHandleColumn";
import OrderInfoColumn from "../columns/TransportationOrderInfoColumn";
import OrderModifiedInfoColumn from "../columns/TransportationOrderModifiedInfoColumn";
import ReasonAndActionColumn from "../columns/TransportationReasonAndActionColumn";
import ShippingInfoColumn from "../columns/TransportationShippingInfoColumn";
import ShippingModifiedInfoColumn from "../columns/TransportationShippingModifiedInfoColumn";
import TaskColumn from "../columns/TransportationTaskColumn";

import useAuth from "hooks/useAuth";
interface Props extends Partial<DGridType> {
  isReport?: boolean;
  formatDataFunc?: (data: any[]) => any[];
  onSubmitChangeHandleByItem?: ({ rowId, userId }: { rowId: string; userId: string }) => void;
}
const TransportationVirtualTable = (props: Props) => {
  const { user } = useAuth();
  return (
    <TableWrapper
      {...props}
      data={{
        ...props.data,
        data: props.formatDataFunc
          ? props.formatDataFunc(props.data?.data || [])
          : props.data?.data || [],
        count: props.data?.count || 0,
      }}
    >
      <TaskColumn />
      <UserColumn />
      <HandleColumn />
      <DPhoneColumn />
      <CustomerColumn />
      <OrderInfoColumn />
      <OrderModifiedInfoColumn />
      <ShippingInfoColumn />
      <ShippingModifiedInfoColumn />
      <ReasonAndActionColumn />
      <HandleByActionColumn
        onSubmitChangeHandleByItem={props.onSubmitChangeHandleByItem}
        role={
          user?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION]?.[
            STATUS_ROLE_TRANSPORTATION.ADD_HANDLE_BY
          ]
        }
        user={user}
      />
    </TableWrapper>
  );
};

export default memo(TransportationVirtualTable);
