import { Column, DataTypeProvider } from "@devexpress/dx-react-grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Iconify from "components/Icons/Iconify";
import MenuPopover from "components/Popovers/MenuPopover";
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
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>

        <MenuPopover
          open={Boolean(openMenu)}
          anchorEl={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          arrow="left-top"
          sx={{
            mt: -1,
            p: 1,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
              "& svg": { mr: 2, width: 20, height: 20 },
            },
          }}
        >
          {isShowAdd && (
            <MenuItem onClick={() => handleAdd(row)}>
              <Iconify icon={"eva:file-add-fill"} />
              Thêm
            </MenuItem>
          )}

          {isShowEdit && (
            <MenuItem onClick={() => handleEdit(row)}>
              <Iconify icon={"eva:edit-fill"} />
              Chỉnh sửa
            </MenuItem>
          )}

          {isShowView && (
            <MenuItem onClick={() => handleView(row)}>
              <Iconify icon={"eva:info-fill"} />
              Chỉnh sửa
            </MenuItem>
          )}

          {isShowDelete && (
            <>
              {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

              <MenuItem onClick={() => handleDelete(row)} sx={{ color: "error.main" }}>
                <Iconify icon={"eva:trash-2-outline"} />
                Delete
              </MenuItem>
            </>
          )}
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
