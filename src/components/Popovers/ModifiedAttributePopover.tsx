import React from "react";
import { Icon } from "@iconify/react";
import refreshFill from "@iconify/icons-eva/refresh-fill";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";
import vi from "locales/vi.json";

interface Props {
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleRefresh?: () => void;
  attributeLabel?: string;
  labelDialog?: string;
  status: { loading: boolean; error: boolean; type: string | null };
  style?: React.CSSProperties;
  type?: "label" | "icon";
}

const ModifiedAttributePopover = ({ type = "icon", ...props }: Props) => {
  const {
    handleDelete,
    handleEdit,
    handleRefresh,
    attributeLabel = "",
    labelDialog = "Bạn chắc chắn muốn xóa?",
    status,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "attribute-action-popover" : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid style={props.style}>
      {handleEdit &&
        (type === "icon" ? (
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={handleEdit}
          >
            <EditIcon style={iconStyle} />
          </IconButton>
        ) : (
          <Button sx={{ color: "secondary.main" }} size="small" onClick={handleEdit}>
            {vi.button.update}
          </Button>
        ))}
      {handleDelete &&
        (type === "icon" ? (
          <IconButton
            color="error"
            aria-label="upload picture"
            component="span"
            onClick={handleClick}
          >
            <DeleteIcon style={iconStyle} />
          </IconButton>
        ) : (
          <Button sx={{ color: "error.main" }} size="small" onClick={handleClick}>
            {vi.button.delete}
          </Button>
        ))}
      {handleRefresh && (
        <Tooltip title="Refresh">
          <IconButton onClick={handleClick}>
            <Icon icon={refreshFill} width={20} height={20} />
          </IconButton>
        </Tooltip>
      )}
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
        <div style={wrapContentStyle}>
          <h4 style={titleStyle}>{labelDialog}</h4>
          <DialogContentText id="alert-dialog-slide-description">
            {attributeLabel}
          </DialogContentText>
          <Divider />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {vi.button.cancel}
            </Button>
            <LoadingButton
              loading={status.loading}
              onClick={(e) => {
                handleDelete && handleDelete();
                handleRefresh && handleRefresh();
                handleClose();
              }}
              color="error"
              variant="contained"
            >
              {vi.button.delete}
            </LoadingButton>
          </DialogActions>
        </div>
      </Popover>
    </Grid>
  );
};

export default ModifiedAttributePopover;

const iconStyle = { fontSize: 20 };
const wrapContentStyle: React.CSSProperties = { padding: "20px 20px 10px 20px" };
const titleStyle = { maxWidth: 500 };
