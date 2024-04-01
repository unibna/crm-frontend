import {
  alpha,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  TableRow,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, TableCell } from "@mui/material";
import { AirTableColumn, SortDirection, SortItem } from "_types_/SkyTableType";
import { AirTableColumnIcons } from "views/AirtableV2/constants";

function SortCondition({
  sortItem: { id, columnId, ascending },
  columns,
  columnOptions,
  onChange,
  onDelete,
}: {
  sortItem: SortItem;
  columns: AirTableColumn[];
  columnOptions: AirTableColumn[];
  onChange: (name: string) => (value: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <SelectStyled
          value={columnId}
          onChange={(e) => onChange("columnId")(e.target.value)}
          input={<OutlinedInputStyled />}
        >
          {columns.map((column) => (
            <MenuItem
              key={column.id}
              value={column.id}
              sx={{
                ...(!columnOptions.some((item) => item.id === column.id) && {
                  display: "none",
                }),
              }}
            >
              <ItemIcon>{AirTableColumnIcons[column.type]}</ItemIcon>
              <ItemText>{column.name}</ItemText>
            </MenuItem>
          ))}
        </SelectStyled>
      </TableCell>
      <TableCell>
        <SelectStyled
          value={ascending}
          onChange={(e) => onChange("ascending")(e.target.value === "true")}
          input={
            <OutlinedInputStyled
              sx={{
                minWidth: `120px!important`,
                width: 120,
              }}
            />
          }
        >
          <MenuItem value={"true"}>
            <ItemText>{SortDirection.ASCENDING}</ItemText>
          </MenuItem>
          <MenuItem value={"false"}>
            <ItemText>{SortDirection.DESCENDING}</ItemText>
          </MenuItem>
        </SelectStyled>
      </TableCell>
      <TableCell>
        <ButtonStyled onClick={() => onDelete(id)}>
          <DeleteIcon />
        </ButtonStyled>
      </TableCell>
    </TableRow>
  );
}

export default SortCondition;

const SelectStyled = styled(Select)(() => ({
  minWidth: 160,
  fontSize: 12,
  height: "fit-content",
  ".MuiSelect-select": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
  },
}));

const OutlinedInputStyled = styled(OutlinedInput)(() => ({
  width: 160,
  ".MuiOutlinedInput-input": {
    padding: "6px 12px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const ItemText = styled(ListItemText)(() => ({
  ".MuiTypography-root": {
    fontSize: 12,
    fontWeight: 500,
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

const ButtonStyled = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  ".MuiSvgIcon-root": { fontSize: 16, color: theme.palette.primary.main },
}));
