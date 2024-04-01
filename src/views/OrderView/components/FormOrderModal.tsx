//components
import Dialog from "@mui/material/Dialog";
import OrderDetail from "./OrderDetail";
import { SlideTransition } from "components/Transisitions";

//hooks
import { memo } from "react";

//types
import { OrderFormType, OrderType } from "_types_/OrderType";

interface Props {
  onClose: () => void;
  onApplyChanges: (value: Partial<OrderFormType>) => void;
  open: boolean;
  defaultValue?: Partial<OrderType>;
  submitText?: string;
  directionAfterAlternatived?: boolean;
  row?: Partial<OrderType>;
}

const FormOrderModal = ({
  open = false,
  onClose,
  onApplyChanges,
  row,
  defaultValue,
  directionAfterAlternatived,
}: Props) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      style={{ zIndex: 1200 }}
    >
      {open ? (
        <OrderDetail
          row={row}
          open={open}
          onApplyChanges={onApplyChanges}
          onClose={onClose}
          defaultValue={defaultValue}
          directionAfterAlternatived={directionAfterAlternatived}
        />
      ) : null}
    </Dialog>
  );
};

export default memo(FormOrderModal);
