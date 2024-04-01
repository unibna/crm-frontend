import Popover from "@mui/material/Popover";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";
import vi from "locales/vi.json";
import { MultiSelect } from "components/Selectors";
import { useContext, useState } from "react";
import map from "lodash/map";
import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";

interface Props {
  anchorEl: HTMLElement | null;
  setAnchorEl: any;
  handleSubmit: (cancelReasonId: number) => void;
  loading?: boolean;
  cancelReasons?: {
    id: number;
    name: string;
    is_shown?: boolean | undefined;
  }[];
}

function CancelReasonCofirmPopover(props: Props) {
  const { anchorEl, setAnchorEl, handleSubmit, loading, cancelReasons } = props;
  const open = Boolean(anchorEl);
  const id = open ? "attribute-action-popover" : undefined;
  const [cancelReasonId, setCancelReasonId] = useState<number>();

  const cancelReasonOptions = map(cancelReasons, (item) => ({
    label: item.name,
    value: item.id,
  }));

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelOrder = () => {
    if (cancelReasonId) {
      handleSubmit(cancelReasonId);
      handleClose();
    } else {
      dispatch(toastError({ message: "Vui lòng chọn lý do huỷ đơn" }));
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <div style={styles.wrapContent}>
        <h4 style={styles.title}>Vui lòng chọn lý do huỷ đơn</h4>
        <DialogContent id="alert-dialog-cancel-order">
          <MultiSelect
            simpleSelect
            options={cancelReasonOptions}
            onChange={(value: number) => setCancelReasonId(value)}
            selectorId="cancel-reason-selector"
            outlined
            placeholder="Lý do huỷ đơn"
            fullWidth
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {vi.button.not}
          </Button>
          <LoadingButton
            loading={loading}
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
          >
            {vi.button.confirm}
          </LoadingButton>
        </DialogActions>
      </div>
    </Popover>
  );
}

export default CancelReasonCofirmPopover;

const styles = {
  wrapContent: { padding: "20px 20px 10px 20px" },
  title: { maxWidth: 500 },
};
