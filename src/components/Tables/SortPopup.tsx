// Libraries
import { Dispatch } from "react";

// Components
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import ArrowVerticalIcon from "assets/illustrations/arrow_vertical_icon";

// Constants & Utils
import { DIRECTION_SORT_TYPE, SortType } from "_types_/SortType";
import map from "lodash/map";
import { ColumnShowSortType } from "_types_/DGridType";

interface Props {
  columnShowSort?: ColumnShowSortType[];
  setColumnShowSort?: Dispatch<ColumnShowSortType[]> | undefined;
  columnSortIndex: number;
  sortInstance?: SortType[];
  setSortInstance: (columnName: string, fieldName: string, direction: DIRECTION_SORT_TYPE) => void;
}

function SortPopup(props: Props) {
  const { columnShowSort, columnSortIndex, sortInstance, setSortInstance } = props;
  const columns = columnShowSort || [];
  const theme = useTheme();

  const handleToggleSorting = (field: { title: string; name: string }) => {
    const direction =
      sortInstance?.[0].columnName === field?.name
        ? sortInstance?.[0].direction === DIRECTION_SORT_TYPE.ASC
          ? DIRECTION_SORT_TYPE.DESC
          : DIRECTION_SORT_TYPE.ASC
        : DIRECTION_SORT_TYPE.ASC;

    direction && setSortInstance(columns[columnSortIndex].name, field?.name, direction);
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormLabel sx={{ color: theme.palette.primary.main, mb: 3 }}>Sort by:</FormLabel>

      {map(columns[columnSortIndex].fields, (field) => (
        <Stack
          direction="row"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          key={field?.name}
          sx={{ py: 0.25 }}
        >
          <Stack direction="column" display="flex" justifyContent="center" alignItems="center">
            <ArrowVerticalIcon
              direction={
                sortInstance?.[0].columnName === field?.name
                  ? sortInstance?.[0].direction
                  : undefined
              }
              handleClickUp={() =>
                setSortInstance(columns[columnSortIndex].name, field?.name, DIRECTION_SORT_TYPE.ASC)
              }
              handleClickDown={() =>
                setSortInstance(
                  columns[columnSortIndex].name,
                  field?.name,
                  DIRECTION_SORT_TYPE.DESC
                )
              }
            />
          </Stack>
          <Typography
            sx={{ fontSize: "0.8125rem", "&:hover": { color: "primary.main", cursor: "pointer" } }}
            onClick={() => handleToggleSorting(field)}
          >
            {field.title}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

export default SortPopup;
