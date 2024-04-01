import Popover from "@mui/material/Popover";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";
import vi from "locales/vi.json";

interface Props {
  anchorEl: HTMLElement | null;
  setAnchorEl: any;
  handleDelete: () => void;
  attributeLabel?: string;
  labelDialog?: string;
  status: { loading: boolean; error: boolean };
  type?: "label" | "icon";
  cancelLabel?: string;
  submitLabel?: string;
}

function DeletePopover(props: Props) {
  const {
    anchorEl,
    setAnchorEl,
    handleDelete,
    attributeLabel = "",
    labelDialog = "Bạn chắc chắn muốn xóa?",
    status,
  } = props;
  const open = Boolean(anchorEl);
  const id = open ? "attribute-action-popover" : undefined;
  const handleClose = () => {
    setAnchorEl(null);
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
        <h4 style={styles.title}>{labelDialog}</h4>
        <DialogContentText id="alert-dialog-slide-description">{attributeLabel}</DialogContentText>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {props.cancelLabel || vi.button.cancel}
          </Button>
          <LoadingButton
            loading={status.loading}
            onClick={() => {
              handleDelete();
              handleClose();
            }}
            color="error"
            variant="contained"
          >
            {props.submitLabel || vi.button.delete}
          </LoadingButton>
        </DialogActions>
      </div>
    </Popover>
  );
}

export default DeletePopover;

const styles = {
  wrapContent: { padding: "20px 20px 10px 20px" },
  title: { maxWidth: 500 },
};
