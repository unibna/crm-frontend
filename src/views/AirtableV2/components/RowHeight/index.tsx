import LineWeightIcon from "@mui/icons-material/LineWeight";
import { List, ListItemIcon, ListItemText, MenuItem, styled } from "@mui/material";
import { ROW_HEIGHT_TYPES } from "_types_/SkyTableType";
import MDropdown from "components/DragAndDrop/MDropdown";
import { AirTableRowHeightIcons, AirTableRowHeightLabels } from "views/AirtableV2/constants";

export default function RowHeight({
  rowHeight,
  setRowHeight,
}: {
  rowHeight: ROW_HEIGHT_TYPES;
  setRowHeight: (newRowHeight: ROW_HEIGHT_TYPES) => void;
}) {
  return (
    <MDropdown buttonTitle="Row Height" buttonIcon={<LineWeightIcon />}>
      <List sx={{ maxHeight: "300px", overflow: "auto", width: "180px" }}>
        {Object.keys(ROW_HEIGHT_TYPES).map((item: keyof typeof ROW_HEIGHT_TYPES) => (
          <MenuItem
            key={ROW_HEIGHT_TYPES[item]}
            onClick={() => setRowHeight(ROW_HEIGHT_TYPES[item])}
            selected={rowHeight === ROW_HEIGHT_TYPES[item]}
          >
            <ItemIcon>{AirTableRowHeightIcons[ROW_HEIGHT_TYPES[item]]}</ItemIcon>
            <ItemText>{AirTableRowHeightLabels[ROW_HEIGHT_TYPES[item]]}</ItemText>
          </MenuItem>
        ))}
      </List>
    </MDropdown>
  );
}

const ItemText = styled(ListItemText)(() => ({
  ".MuiTypography-root": {
    fontSize: 14,
    fontWeight: 600,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const ItemIcon = styled(ListItemIcon)(() => ({
  "&.MuiListItemIcon-root": {
    minWidth: "24px!important",
    marginRight: "4px",
  },

  ".MuiSvgIcon-root": { fontSize: 16 },
}));
