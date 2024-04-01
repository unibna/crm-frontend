import React, { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";

import FormDialog from "components/Dialogs/FormDialog";
import DeletePopover from "components/Popovers/DeletePopover";
import FormConfig from "./FormConfig";
import PermissionConfig from "./PermissionConfig";

import { useAppSelector } from "hooks/reduxHook";

import { AirTableBase } from "_types_/SkyTableType";
import { ROLE_OPTION, ROLE_TYPE, STATUS_ROLE_SKYCOM_TABLE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { getOptionRole } from "selectors/roles";
import { isReadAndWriteRole } from "utils/roleUtils";

enum ACTION_TYPE {
  EDIT = "EDIT",
  COPY = "COPY",
  DELETE = "DELETE",
  EDIT_PERMISSION = "EDIT_PERMISSION",
}

const ACTION_LABELS = {
  [ACTION_TYPE.EDIT]: "Đổi tên",
  [ACTION_TYPE.COPY]: "Sao chép bảng",
  [ACTION_TYPE.DELETE]: "Xoá bảng",
  [ACTION_TYPE.EDIT_PERMISSION]: "Chỉnh sửa quyền",
};

const MENU_CONFIG = [
  {
    label: ACTION_LABELS[ACTION_TYPE.EDIT],
    value: ACTION_TYPE.EDIT,
    icon: <EditIcon />,
  },
  // {
  //   label: ACTION_LABELS[ACTION_TYPE.COPY],
  //   value: ACTION_TYPE.COPY,
  //   icon: <ContentCopyIcon />,
  // },
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

function MenuConfigTable({
  table,
  onUpdateTable,
  onDeleteTable,
  buttonStyles,
  permission,
}: {
  table: AirTableBase;
  onUpdateTable: (data: Partial<AirTableBase>) => void;
  onDeleteTable: () => void;
  buttonStyles?: SxProps<Theme>;
  permission:
    | {
        [key: string]: ROLE_TYPE;
      }
    | undefined;
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorElDelete, setAnchorElDelete] = useState<HTMLElement | null>(null);

  const [currentAction, setCurrentAction] = useState<null | ACTION_TYPE>(null);

  const [isOpenPermission, setIsOpenPermission] = useState(false);

  const roles = useAppSelector((state) => getOptionRole(state.roles));

  const open = Boolean(anchorEl);

  const { user } = useAuth();

  const isCanDelete = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.DELETE]
  );
  const isCanEdit = isReadAndWriteRole(
    user?.is_superuser,
    permission?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE] ||
      table.options?.permission?.[user?.group_permission?.id || ""]
  );

  useEffect(() => {
    currentAction && setCurrentAction(null);
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitEdit = (newValues: AirTableBase) => {
    onUpdateTable({ ...newValues });
  };

  const handleChangePermission = (newPermission: any) => {
    onUpdateTable({
      options: {
        ...table.options,
        permission: newPermission,
      },
    });
  };

  const handleCopy = () => {
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
    onDeleteTable();
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
      case ACTION_TYPE.EDIT_PERMISSION:
        handleClose();
        setIsOpenPermission(true);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <FormDialog
        open={isOpenPermission}
        onClose={() => setIsOpenPermission(false)}
        enableCloseByDropClick
        isShowFooter={false}
      >
        <PermissionConfig
          roles={roles}
          permission={table?.options?.permission}
          onChangePermission={handleChangePermission}
          onClose={() => {
            setIsOpenPermission(false);
          }}
          containerStyles={{ width: "100%" }}
        />
      </FormDialog>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0, ...buttonStyles }}
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
      </IconButton>
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
        {(!currentAction ||
          currentAction === ACTION_TYPE.DELETE ||
          currentAction === ACTION_TYPE.EDIT_PERMISSION) &&
          MENU_CONFIG.map((item) => (
            <MenuItem
              onClick={() => handleClickMenuItem(item.value)}
              key={item.value}
              disabled={
                (item.value === ACTION_TYPE.DELETE && !isCanDelete) ||
                (item.value !== ACTION_TYPE.DELETE && !isCanEdit)
              }
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
          <FormConfig value={table} onClose={handleClose} onSubmit={handleSubmitEdit} />
        )}
      </Menu>
      <DeletePopover
        anchorEl={anchorElDelete}
        setAnchorEl={setAnchorElDelete}
        status={{ loading: false, error: false }}
        type="label"
        labelDialog="Xác nhận xoá bảng này?"
        cancelLabel="Huỷ"
        submitLabel="Xoá"
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default MenuConfigTable;
