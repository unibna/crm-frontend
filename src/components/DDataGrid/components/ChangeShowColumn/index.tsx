import React from "react";
import map from "lodash/map";
//component
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import ListItemButton from "@mui/material/ListItemButton";

//type
import { MColumnType } from "_types_/ColumnType";
import vi from "locales/vi.json";

const ChangeShowColumn = ({
  columnsCount,
  columns,
  onChangeColumn,
  toggleColumnsDisable = [],
}: {
  columnsCount?: number;
  // columns?: { title: string; name: keyof FacebookType; isShow: boolean }[];
  columns?: any;
  onChangeColumn: (column: MColumnType) => void;
  toggleColumnsDisable?: string[];
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Badge badgeContent={columnsCount} color="error">
        <Button variant="outlined" color="primary" onClick={handleClick}>
          {vi.button.column_filter}
        </Button>
      </Badge>

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
        <List component="nav">
          {map(columns, (column) => (
            <ListItemButton
              key={column.title}
              style={itemStyle}
              disabled={toggleColumnsDisable.includes(column.name)}
            >
              <ListItemIcon style={itemIconStyle}>
                <Checkbox
                  color="primary"
                  checked={column.isShow}
                  onChange={() => onChangeColumn(column)}
                  disabled={toggleColumnsDisable.includes(column.name)}
                />
              </ListItemIcon>
              <ListItemText primary={column.title} sx={{ span: { fontSize: 14 } }} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default ChangeShowColumn;

const itemStyle = { padding: "0px 16px 0px 6px", height: 36 };
const itemIconStyle = { margin: 0 };
