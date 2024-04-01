import React, { useState } from "react";
import { Column } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { MBadgeButton } from "components/Buttons";
import filter from "lodash/filter";

interface Props {
  columns?: Column[];
  hiddenColumns?: string[];
  onToggleColumns?: (columns: string[]) => void;
  toggleColumnsDisable?: string[];
}
const DVisibleColumns = ({
  columns = [],
  hiddenColumns = [],
  onToggleColumns,
  toggleColumnsDisable = [],
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onChange = (checked: boolean, columnName: string) => {
    onToggleColumns &&
      onToggleColumns(
        checked
          ? filter(hiddenColumns, (item) => item !== columnName)
          : [...hiddenColumns, columnName]
      );
  };

  return (
    <>
      <MBadgeButton
        label="Lọc cột"
        value={columns.length - hiddenColumns.length}
        ref={anchorEl as any}
        setShowPopup={(value, e) => handleClick(e)}
      />

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
                  disabled={toggleColumnsDisable.includes(column.name)}
                  color="primary"
                  checked={!hiddenColumns.includes(column.name)}
                  onChange={(e) => onChange(e.target.checked, column.name)}
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

export default DVisibleColumns;

const itemStyle = { padding: "0px 16px 0px 6px", height: 36 };
const itemIconStyle = { margin: 0 };
