import { DGridType } from "_types_/DGridType";
import TableWrapper from "components/Tables/TableWrapper";
import { memo } from "react";
import ActionColumn from "./TDetailColumns/TDetailAction";
import AppointmentDateColumn from "./TDetailColumns/TDetailAppointmentDate";
import HandleByColumn from "./TDetailColumns/TDetailHandleBy";
import HandleStatusColumn from "./TDetailColumns/TDetailHandleStatus";
import ModifiedByColumn from "./TDetailColumns/TDetailModifiedBy";
import ModifiedDateColumn from "./TDetailColumns/TDetailModifiedDate";
import ReasonColumn from "./TDetailColumns/TDetailReason";
import ReasonCreatedDateColumn from "./TDetailColumns/TDetailReasonCreatedDate";

interface Props extends Partial<DGridType> {
  formatDataFunc?: (data: any[]) => any[];
}
const TransportationDetailTable = (props: Props) => {
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
      <ReasonColumn />
      <ActionColumn />
      <HandleByColumn />
      <ModifiedByColumn />
      <HandleStatusColumn />
      <ModifiedDateColumn />
      <AppointmentDateColumn />
      <ReasonCreatedDateColumn />
    </TableWrapper>
  );
};

export default memo(TransportationDetailTable);
