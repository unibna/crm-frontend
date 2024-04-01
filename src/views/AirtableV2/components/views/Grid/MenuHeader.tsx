import React, { useEffect, useState } from "react";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EastIcon from "@mui/icons-material/East";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import WestIcon from "@mui/icons-material/West";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, useTheme } from "@mui/material";

import { AirTableBase, AirTableColumn, InsertColumnProps } from "_types_/SkyTableType";

import DeletePopover from "components/Popovers/DeletePopover";
import { store } from "store";
import { toastSuccess } from "store/redux/toast/slice";
import EditFieldConfig from "views/AirtableV2/components/views/Grid/EditFieldConfig";
import NewFieldForm from "./NewFieldForm";

enum ACTION_TYPE {
  EDIT = "EDIT",
  SHALLOW_COPY = "SHALLOW_COPY",
  DEEP_COPY = "DEEP_COPY",
  DELETE = "DELETE",
  HIDE = "HIDE",
  INSERT_LEFT = "INSERT_LEFT",
  INSERT_RIGHT = "INSERT_RIGHT",
  SET_PRIMARY_KEY = "SET_PRIMARY_KEY",
}

const DISABLE_ACTION = [
  ACTION_TYPE.INSERT_LEFT,
  ACTION_TYPE.HIDE,
  ACTION_TYPE.DELETE,
  ACTION_TYPE.SET_PRIMARY_KEY,
];

const ACTION_LABELS = {
  [ACTION_TYPE.EDIT]: "Chỉnh sửa",
  [ACTION_TYPE.SET_PRIMARY_KEY]: "Đặt làm khoá chính",
  [ACTION_TYPE.SHALLOW_COPY]: "Sao chép trường",
  [ACTION_TYPE.DEEP_COPY]: "Sao chép trường và dữ liệu",
  [ACTION_TYPE.INSERT_LEFT]: "Chèn bên trái",
  [ACTION_TYPE.INSERT_RIGHT]: "Chèn bên phải",
  [ACTION_TYPE.HIDE]: "Ẩn trường",
  [ACTION_TYPE.DELETE]: "Xoá trường",
};

const MENU_CONFIG = [
  {
    label: ACTION_LABELS[ACTION_TYPE.EDIT],
    value: ACTION_TYPE.EDIT,
    icon: <EditIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.SET_PRIMARY_KEY],
    value: ACTION_TYPE.SET_PRIMARY_KEY,
    icon: <VpnKeyIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.SHALLOW_COPY],
    value: ACTION_TYPE.SHALLOW_COPY,
    icon: <ContentCopyIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.DEEP_COPY],
    value: ACTION_TYPE.DEEP_COPY,
    icon: <FileCopyIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.INSERT_LEFT],
    value: ACTION_TYPE.INSERT_LEFT,
    icon: <WestIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.INSERT_RIGHT],
    value: ACTION_TYPE.INSERT_RIGHT,
    icon: <EastIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.HIDE],
    value: ACTION_TYPE.HIDE,
    icon: <VisibilityOffIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.DELETE],
    value: ACTION_TYPE.DELETE,
    icon: <DeleteIcon />,
  },
];

function MenuHeader({
  table,
  columns,
  column,
  onAddColumn,
  onToggleHideColumn,
  onChangeColumn,
  onDeleteField,
  onUpdateTable,
}: {
  table?: AirTableBase;
  columns: AirTableColumn[];
  column: AirTableColumn;
  onAddColumn: (
    column: AirTableColumn,
    optional?: {
      insertColumn?: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
  onToggleHideColumn: () => void;
  onChangeColumn: (
    column: AirTableColumn,
    optional?: {
      insertColumn?: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
  onDeleteField: (id: AirTableColumn["id"]) => void;
  onUpdateTable: (data: any, action?: (newData: any) => any) => void;
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElDelete, setAnchorElDelete] = useState<HTMLElement | null>(null);
  const [currentAction, setCurrentAction] = useState<null | ACTION_TYPE>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    currentAction && setCurrentAction(null);
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitEdit = (newColumn: AirTableColumn) => {
    onChangeColumn(newColumn);
    handleClose();
  };

  const handleShallowCopy = () => {
    let name = `${column.name} Copy (${Date.now()})`;
    onChangeColumn(
      {
        ...column,
        name,
        isCreateByFe: true,
      },
      {
        insertColumn: {
          direction: "right",
          column,
        },
      }
    );
    handleClose();
  };

  const handleDeepCopy = () => {
    let name = `${column.name} Copy (${Date.now()})`;
    onChangeColumn(
      {
        ...column,
        name,
        isCreateByFe: true,
      },
      {
        insertColumn: {
          direction: "right",
          column,
          duplicateData: true,
        },
      }
    );
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
    onDeleteField(column.id);
  };

  const handleSetPrimaryKey = () => {
    handleClose();
    onUpdateTable(
      {
        ...table,
        primary_key: column.id,
      },
      () => {
        store.dispatch(toastSuccess({ message: "Cập nhật khoá chính thành công" }));
      }
    );
  };

  const handleClickMenuItem = (value: ACTION_TYPE) => {
    setCurrentAction(value);
    switch (value) {
      case ACTION_TYPE.SHALLOW_COPY:
        handleShallowCopy();
        break;
      case ACTION_TYPE.DEEP_COPY:
        handleDeepCopy();
        break;
      case ACTION_TYPE.DELETE:
        setAnchorElDelete(anchorEl);
        break;
      case ACTION_TYPE.HIDE:
        handleClose();
        onToggleHideColumn();
        break;
      case ACTION_TYPE.SET_PRIMARY_KEY:
        handleSetPrimaryKey();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {(!currentAction || currentAction === ACTION_TYPE.DELETE) &&
          MENU_CONFIG.map((item) => (
            <MenuItem
              onClick={() => handleClickMenuItem(item.value)}
              key={item.value}
              disabled={column.id === table?.primary_key && DISABLE_ACTION.includes(item.value)}
            >
              <ListItemIcon
                sx={{
                  ".MuiSvgIcon-root": {
                    fontSize: 20,
                    opacity: 0.3,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                sx={{
                  ".MuiTypography-root": {
                    fontSize: 14,
                  },
                  ...(item.value === ACTION_TYPE.DELETE && {
                    color: theme.palette.error.main,
                  }),
                }}
              >
                {item.label}
              </ListItemText>
            </MenuItem>
          ))}{" "}
        {currentAction === ACTION_TYPE.EDIT && (
          <EditFieldConfig
            column={column}
            columns={columns}
            onClose={handleClose}
            onSubmit={handleSubmitEdit}
          />
        )}
        {(currentAction === ACTION_TYPE.INSERT_LEFT ||
          currentAction === ACTION_TYPE.INSERT_RIGHT) && (
          <NewFieldForm
            columns={columns}
            onAddColumn={(newCol) =>
              onAddColumn(newCol, {
                insertColumn: {
                  column,
                  direction: currentAction === ACTION_TYPE.INSERT_LEFT ? "left" : "right",
                },
              })
            }
            onClose={handleClose}
          />
        )}
      </Menu>
      <DeletePopover
        anchorEl={anchorElDelete}
        setAnchorEl={setAnchorElDelete}
        status={{ loading: false, error: false }}
        type="label"
        labelDialog="Xác nhận xoá trường này?"
        cancelLabel="Huỷ"
        submitLabel="Xoá"
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default MenuHeader;
