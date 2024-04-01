import React, { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, useTheme } from "@mui/material";

import { AirTableOption } from "_types_/SkyTableType";

import FormConfig from "../../FormConfig";

enum ACTION_TYPE {
  EDIT = "EDIT",
  DELETE = "DELETE",
}

const DISABLE_ACTION = [ACTION_TYPE.DELETE];

const ACTION_LABELS = {
  [ACTION_TYPE.EDIT]: "Chỉnh sửa",
  [ACTION_TYPE.DELETE]: "Xoá option",
};

const MENU_CONFIG = [
  {
    label: ACTION_LABELS[ACTION_TYPE.EDIT],
    value: ACTION_TYPE.EDIT,
    icon: <EditIcon />,
  },
  {
    label: ACTION_LABELS[ACTION_TYPE.DELETE],
    value: ACTION_TYPE.DELETE,
    icon: <DeleteIcon />,
  },
];

function KanbanMenuHeader({
  choices,
  choice,
  onChangeOptions,
}: {
  choices?: { [key: string]: AirTableOption };
  choice?: AirTableOption;
  onChangeOptions: (
    newValue: AirTableOption[],
    optional?: { actionSuccess: () => void } | undefined
  ) => void;
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleSubmitEdit = (value: AirTableOption) => {
    if (choices && choice?.id && choices[choice.id]) {
      choices[choice.id] = value;
      onChangeOptions(Object.values(choices));
    }

    handleClose();
  };

  const handleDelete = () => {
    if (choices && choice?.id && choices[choice.id]) {
      delete choices[choice.id];
      onChangeOptions(Object.values(choices));
    }
    handleClose();
  };

  const handleClickMenuItem = (value: ACTION_TYPE) => {
    setCurrentAction(value);
    switch (value) {
      case ACTION_TYPE.DELETE:
        handleDelete();
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
        sx={{
          p: 0.5,
          marginRight: "-12px",
          ".MuiSvgIcon-root": {
            fontSize: "20px",
          },
        }}
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
        {!currentAction &&
          MENU_CONFIG.map((item) => (
            <MenuItem onClick={() => handleClickMenuItem(item.value)} key={item.value}>
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
          <FormConfig
            value={choice}
            onClose={handleClose}
            onSubmit={handleSubmitEdit}
            label="Tên"
            placeholder="Nhập tên"
          />
        )}
      </Menu>
    </div>
  );
}

export default KanbanMenuHeader;
