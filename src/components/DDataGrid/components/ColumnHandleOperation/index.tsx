import { Column, DataTypeProvider } from "@devexpress/dx-react-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Iconify from "components/Icons/Iconify";
import MenuPopover from "components/Popovers/MenuPopover";
import vi from "locales/vi.json";
import React, { useRef, useState } from "react";

interface Props {
  for: Array<string>;
  scale?: boolean;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  handleDelete?: (row: any) => void;
  handleEdit?: (row: any) => void;
  handleAdd?: (row: any) => void;
  handleRefresh?: (row: any) => void;
  handleView?: (row: any) => void;
  columns?: Column[];
}

interface ValueType {
  isShowEdit?: boolean;
  isShowAdd?: boolean;
  isShowDelete?: boolean;
  isShowRefresh?: boolean;
  isShowView?: boolean;
  disabled?: boolean;
  labelDialog?: string;
  buttonText?: string;
  tooltipRefresh?: string;
  contentTitleView?: string[];
}

const ColumnHandleOperation = (props: Props) => {
  const {
    handleDelete = (row: any) => {},
    handleEdit = (row: any) => {},
    handleAdd = (row: any) => {},
    handleRefresh = (row: any) => {},
    handleView = (row: any) => {},
  } = props;
  const Formatter = ({ value, row }: { value: ValueType; row?: any }) => {
    const {
      isShowEdit = false,
      isShowAdd = false,
      isShowDelete = false,
      isShowRefresh = false,
      isShowView = false,
      disabled = false,
      buttonText = vi.button.accept,
      labelDialog = "",
      tooltipRefresh = vi.resync,
    } = value;
    const [isOpen, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
      setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setOpenMenuActions(null);
    };

    const handleClick = () => {
      setOpen(!isOpen);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleSubmit = () => {
      isShowDelete && handleDelete(row);
      isShowRefresh && handleRefresh(row);
      handleClose();
    };

    return (
      <>
        {isShowAdd && (
          <IconButton
            ref={anchorRef}
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => handleAdd(row)}
          >
            <AddIcon />
          </IconButton>
        )}
        {isShowEdit && (
          <IconButton
            ref={anchorRef}
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => handleEdit(row)}
          >
            <EditIcon />
          </IconButton>
        )}
        {isShowView && (
          <Tooltip title="View">
            <IconButton onClick={() => handleView(row)}>
              <Iconify icon={"eva:eye-fill"} />
            </IconButton>
          </Tooltip>
        )}
        {isShowDelete && (
          <IconButton
            ref={anchorRef}
            color="error"
            aria-label="upload picture"
            component="span"
            onClick={handleClick}
          >
            <DeleteIcon />
          </IconButton>
        )}
        {isShowRefresh && (
          <Tooltip title={tooltipRefresh} disableHoverListener={disabled}>
            <Box>
              <IconButton onClick={handleClick} ref={anchorRef} disabled={disabled}>
                <SyncIcon />
              </IconButton>
            </Box>
          </Tooltip>
        )}
        <MenuPopover
          open={isOpen}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          sx={{ p: 1, mt: -1, width: "auto" }}
        >
          <div style={wrapActionDialogStyle}>
            <Typography variant="subtitle1" style={labelDialogStyle}>
              {labelDialog}
            </Typography>
            <Divider />
            <DialogActions sx={{ mb: 1 }}>
              <Button onClick={handleClose} color="primary">
                Hủy
              </Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {buttonText}
              </Button>
            </DialogActions>
          </div>
        </MenuPopover>
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandleOperation;

const imageStyle = { height: 40, width: 40 };
const wrapActionDialogStyle = { padding: "20px 20px 10px 20px" };
const labelDialogStyle = { maxWidth: 500, marginBottom: 10 };
const pdfViewerStyle = { border: "none" };
