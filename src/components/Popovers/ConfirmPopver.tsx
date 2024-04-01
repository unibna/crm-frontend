import LoadingButton from "@mui/lab/LoadingButton";
import { DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import vi from "locales/vi.json";
import React from "react";

interface Props {
  handleCancel?: () => void;
  handleCofirm?: () => void;
  description?: string;
  title?: string;
  status: { loading: boolean; error: boolean; type: string | null };
  style?: React.CSSProperties;
  children?: React.ReactNode | JSX.Element;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const ConfirmPopover = ({ anchorEl = null, setAnchorEl, children, title, ...props }: Props) => {
  const { handleCofirm, handleCancel, description = "", status } = props;
  const open = Boolean(anchorEl);
  const id = open ? "attribute-action-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleCancel}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <div style={wrapContentStyle}>
        <h4 style={titleStyle}>{title}</h4>
        <DialogContentText id="alert-dialog-slide-description">{description}</DialogContentText>
        {children && <DialogContent>{children}</DialogContent>}
        <Divider />
        <DialogActions>
          {handleCancel && (
            <Button onClick={handleCancel} color="primary">
              {vi.button.cancel}
            </Button>
          )}
          {handleCofirm && (
            <LoadingButton loading={status.loading} onClick={handleCofirm} variant="contained">
              {vi.button.confirm}
            </LoadingButton>
          )}
        </DialogActions>
      </div>
    </Popover>
  );
};

export default ConfirmPopover;

const wrapContentStyle: React.CSSProperties = { padding: "20px 20px 10px 20px" };
const titleStyle = { maxWidth: 500 };
