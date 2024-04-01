import React, { useEffect, useState } from "react";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";

import { AirTableView } from "_types_/SkyTableType";
import DeletePopover from "components/Popovers/DeletePopover";
import { useAppSelector } from "hooks/reduxHook";
import { getOptionRole } from "selectors/roles";
import FormConfig from "./FormConfig";
import PermissionConfig from "./PermissionConfig";

enum ACTION_TYPE {
  EDIT = "EDIT",
  COPY = "COPY",
  DELETE = "DELETE",
  EDIT_PERMISSION = "EDIT_PERMISSION",
}

const ACTION_LABELS = {
  [ACTION_TYPE.EDIT]: "Đổi tên",
  [ACTION_TYPE.COPY]: "Sao chép ",
  [ACTION_TYPE.DELETE]: "Xoá",
  [ACTION_TYPE.EDIT_PERMISSION]: "Chỉnh sửa quyền",
};

const MENU_CONFIG = [
  {
    label: ACTION_LABELS[ACTION_TYPE.EDIT],
    value: ACTION_TYPE.EDIT,
    icon: <EditIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.COPY],
    value: ACTION_TYPE.COPY,
    icon: <ContentCopyIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.EDIT_PERMISSION],
    value: ACTION_TYPE.EDIT_PERMISSION,
    icon: <LockPersonIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.DELETE],
    value: ACTION_TYPE.DELETE,
    icon: <DeleteIcon />,
  },
];

function MenuConfigView({
  disabled,
  view,
  onUpdateView,
  onDeleteView,
  buttonStyles,
}: {
  disabled?: boolean;
  view: AirTableView;
  onUpdateView: (view: Partial<AirTableView>) => void;
  onDeleteView: (viewId: AirTableView["id"]) => void;
  buttonStyles?: SxProps<Theme>;
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElDelete, setAnchorElDelete] = useState<HTMLElement | null>(null);
  const [currentAction, setCurrentAction] = useState<null | ACTION_TYPE>(null);
  const open = Boolean(anchorEl);

  const roles = useAppSelector((state) => getOptionRole(state.roles));

  useEffect(() => {
    currentAction && setCurrentAction(null);
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitEdit = (newValues: AirTableView) => {
    onUpdateView({ ...newValues });
  };

  const handleChangePermission = (newPermission: any) => {
    onUpdateView({
      ...view,
      options: {
        ...view.options,
        permission: newPermission,
      },
    });
  };

  const handleCopy = () => {
    onUpdateView({ ...view, name: `${view.name} Copy`, id: undefined });
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
    onDeleteView(view.id);
  };

  const handleClickMenuItem = (value: ACTION_TYPE) => {
    setCurrentAction(value);
    switch (value) {
      case ACTION_TYPE.COPY:
        handleCopy();
        break;
      case ACTION_TYPE.DELETE:
        setAnchorElDelete(anchorEl);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Box
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0, ...buttonStyles }}
        component="div"
      >
        <KeyboardArrowDownIcon
          sx={{
            transform: "rotate(0deg)",
            transition: "transform 0.15s linear",
            ...(open && {
              transform: "rotate(180deg)",
            }),
          }}
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        onKeyDown={(e) => e.stopPropagation()}
        sx={{
          ".MuiList-root": {
            minWidth: 200,
            p: 1,
          },
        }}
      >
        {(!currentAction || currentAction === ACTION_TYPE.DELETE) &&
          MENU_CONFIG.map((item) => (
            <MenuItem
              onClick={() => handleClickMenuItem(item.value)}
              key={item.value}
              disabled={disabled && item.value === ACTION_TYPE.DELETE}
            >
              <ListItemIcon
                sx={{
                  mr: 0,
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
          ))}
        {currentAction === ACTION_TYPE.EDIT && (
          <FormConfig
            value={view}
            onClose={handleClose}
            onSubmit={handleSubmitEdit}
            label="Tên view"
            placeholder="Nhập tên view"
          />
        )}
        {currentAction === ACTION_TYPE.EDIT_PERMISSION && (
          <PermissionConfig
            roles={roles}
            permission={view?.options?.permission}
            onChangePermission={handleChangePermission}
            onClose={handleClose}
          />
        )}
      </Menu>
      <DeletePopover
        anchorEl={anchorElDelete}
        setAnchorEl={setAnchorElDelete}
        status={{ loading: false, error: false }}
        type="label"
        labelDialog="Xác nhận xoá view này?"
        cancelLabel="Huỷ"
        submitLabel="Xoá"
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default MenuConfigView;
