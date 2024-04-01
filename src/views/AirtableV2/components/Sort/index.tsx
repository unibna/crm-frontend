import { useMemo, useState } from "react";

import Add from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import {
  alpha,
  Box,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  styled,
  Table,
  TableBody,
  useTheme,
} from "@mui/material";

import ObjectID from "bson-objectid";

import { AirTableColumn, SortItem } from "_types_/SkyTableType";
import { MButton } from "components/Buttons";
import { AirTableColumnIcons } from "views/AirtableV2/constants";
import SortCondition from "./components/SortCondition";
import EmptyContent from "views/DataFlow/components/EmptyContent";
import MDropdown from "components/DragAndDrop/MDropdown";

export default function Sort({
  columns,
  sort = [],
  setSort,
  onSetDefault,
}: {
  columns: AirTableColumn[];
  sort: SortItem[];
  setSort: (newSort: SortItem[]) => void;
  onSetDefault?: (newSort: SortItem[]) => void;
}) {
  const theme = useTheme();
  const [controlClose, setControlClose] = useState(false);

  const columnOptions: AirTableColumn[] = useMemo(
    () =>
      (sort &&
        columns.filter((column) => !sort.some((sortItem) => sortItem.columnId === column.id))) ||
      [],
    [columns, sort]
  );

  const handleAddCondition = (columnId: string) => {
    if (columnOptions.length > 0) {
      const newSortItem: SortItem = {
        id: new ObjectID().toHexString(),
        columnId: columnId,
        ascending: true,
      };
      setSort([...sort, newSortItem]);
      setControlClose(true);
    }
  };

  const handleChange = (index: number) => (name: keyof SortItem) => (value: any) => {
    sort[index] = {
      ...sort[index],
      [name]: value,
    };
    setSort([...sort]);
  };

  const handleDelete = (id: string) => {
    setSort(sort.filter((item) => item.id !== id));
  };

  return (
    <MDropdown buttonTitle="Sort" buttonIcon={<SortIcon />} badgeContent={sort?.length}>
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Stack direction="row" spacing={1}>
          <MDropdown
            buttonTitle="Add another sort"
            buttonIcon={<Add />}
            buttonProps={{
              sx: {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                fontSize: 12,
              },
              variant: "text",
              disabled: columnOptions.length === 0,
            }}
            controlClose={controlClose}
            setControlClose={setControlClose}
            isHiddenEndIcon
          >
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {columns.map(
                (column) =>
                  columnOptions.some((item: AirTableColumn) => item.id === column.id) && (
                    <MenuItem key={column.id} onClick={() => handleAddCondition(column.id)}>
                      <ItemIcon>{AirTableColumnIcons[column.type]}</ItemIcon>
                      <ItemText>{column.name}</ItemText>
                    </MenuItem>
                  )
              )}
            </List>
          </MDropdown>
        </Stack>
        {sort?.length === 0 && (
          <EmptyContent
            title="Empty"
            description="No sorts are applied in this view"
            imgStyles={{ height: 100 }}
            sx={{ p: 0, pt: 3 }}
          />
        )}

        <Table sx={{ gap: 1, mt: 3, maxHeight: "400px", overflow: "auto" }}>
          <TableBody>
            {sort?.map((item: SortItem, index: number) => (
              <SortCondition
                sortItem={item}
                key={item.id}
                columns={columns}
                columnOptions={columnOptions}
                onChange={handleChange(index)}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
        {onSetDefault && (
          <Stack direction="row" mt={2} justifyContent={"flex-end"}>
            <MButton sx={{ fontSize: "12px" }} onClick={() => onSetDefault([...sort])}>
              Áp dụng mặc định
            </MButton>
          </Stack>
        )}
      </Box>
    </MDropdown>
  );
}

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
