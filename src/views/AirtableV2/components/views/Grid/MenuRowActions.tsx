import DeleteIcon from "@mui/icons-material/Delete";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  useTheme,
} from "@mui/material";
import { AirTableRow } from "_types_/SkyTableType";

import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { isReadAndWriteRole } from "utils/roleUtils";

enum ACTION_TYPE {
  COPY = "COPY",
  INSERT_ABOVE = "above",
  INSERT_BELOW = "below",
  DELETE = "DELETE",
}

const ACTION_LABELS = {
  [ACTION_TYPE.INSERT_ABOVE]: "Chèn 1 hàng lên trên",
  [ACTION_TYPE.INSERT_BELOW]: "Chèn 1 hàng xuống dưới",
  [ACTION_TYPE.COPY]: "Sao chép hàng",
  [ACTION_TYPE.DELETE]: "Xoá hàng",
};

const MENU_CONFIG = (numRows: number) => {
  return [
    ...(numRows === 1
      ? [
          // {
          //   label: ACTION_LABELS[ACTION_TYPE.INSERT_ABOVE],
          //   value: ACTION_TYPE.INSERT_ABOVE,
          //   icon: <NorthIcon />,
          // },
          // {
          //   label: ACTION_LABELS[ACTION_TYPE.INSERT_BELOW],
          //   value: ACTION_TYPE.INSERT_BELOW,
          //   icon: <SouthIcon />,
          // },
          // {
          //   label: ACTION_LABELS[ACTION_TYPE.COPY],
          //   value: ACTION_TYPE.COPY,
          //   icon: <FileCopyIcon />,
          // },
          {
            label: ACTION_LABELS[ACTION_TYPE.DELETE],
            value: ACTION_TYPE.DELETE,
            icon: <DeleteIcon />,
          },
        ]
      : []),

    // {
    //   label: ACTION_LABELS[ACTION_TYPE.DELETE],
    //   value: ACTION_TYPE.DELETE,
    //   icon: <DeleteIcon />,
    // },
  ];
};

function MenuRowActions({
  records,
  clicked,
  points,
  selectedRow = {},
  setSelectedRow,
  viewPermission,
  onChangeRow,
  onDeleteRow,
}: {
  records: any[];
  clicked: boolean;
  points: { x: number; y: number };
  selectedRow: any;
  setSelectedRow: any;
  viewPermission: ROLE_TYPE;
  onChangeRow: (row: any, records: any[], optional?: any) => void;
  onDeleteRow: (id: AirTableRow["id"]) => void;
}) {
  const theme = useTheme();
  const { user } = useAuth();

  const handleClickMenuItem = (value: ACTION_TYPE) => {
    switch (value) {
      case ACTION_TYPE.INSERT_ABOVE:
      case ACTION_TYPE.INSERT_BELOW: {
        handleInsertRow(value);
        break;
      }
      case ACTION_TYPE.COPY: {
        handleCopyRow();
        break;
      }

      case ACTION_TYPE.DELETE: {
        handleDeleteRow();
        break;
      }

      default:
        break;
    }
    setSelectedRow({});
  };

  const handleInsertRow = (direction: ACTION_TYPE.INSERT_ABOVE | ACTION_TYPE.INSERT_BELOW) => {
    const rowToInsert = records.find((record) => record.id === Object.values(selectedRow)[0]);
    onChangeRow({}, records, {
      insertRow: {
        row: rowToInsert,
        direction,
      },
    });
  };

  const handleCopyRow = () => {
    const rowToInsert = records.find((record) => record.id === Object.values(selectedRow)[0]);
    onChangeRow({}, records, {
      insertRow: {
        row: rowToInsert,
        direction: ACTION_TYPE.INSERT_BELOW,
        duplicateData: true,
      },
    });
  };

  const handleDeleteRow = () => {
    onDeleteRow(Object.values(selectedRow)[0] as string);
  };

  return (
    <Popover
      open={clicked}
      anchorReference="anchorPosition"
      anchorPosition={{ top: points.y, left: points.x }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <List dense>
        {MENU_CONFIG(Object.keys(selectedRow).length).map((item) => (
          <ListItem
            onClick={() => handleClickMenuItem(item.value)}
            key={item.value}
            sx={{ px: 0 }}
            disabled={!isReadAndWriteRole(user?.is_superuser, viewPermission)}
          >
            <ListItemButton>
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
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}

export default MenuRowActions;
