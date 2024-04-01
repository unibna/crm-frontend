import ObjectID from "bson-objectid";

import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  alpha,
  styled,
} from "@mui/material";

import { AirTableConjunctionLabel } from "views/AirtableV2/constants";

import { Conjunction } from "../AbstractFilterItem";
import FilterItem from "../FilterItem";
import FilterSet from "../FilterSet";

import { AirTableColumn } from "_types_/SkyTableType";
import { MButton } from "components/Buttons";
import TextLink from "../../TextLink";
import ConditionComponent from "./FilterCondition";

interface Props {
  id: string;
  filterSet: FilterSet;
  filterItemIndex: number;
  columns: AirTableColumn[];
  columnsObject: { [key: string]: AirTableColumn };
  conjunction: Conjunction;
  onChangeGroup: (name: string) => (value: any) => void;
  onChange: (
    filter: FilterSet,
    setFilter: any,
    index: number
  ) => (name: string) => (value: any) => void;
  onDeleteGroup: (id: string) => void;
  onDelete: (filter: FilterSet, setFilter: any) => (id: string) => void;
  onAddCondition: (filter: FilterSet, setFilter: any) => void;
  onAddConditionGroup: (filter: FilterSet, setFilter: any) => void;
  setFilter: (prevState: FilterSet) => void | React.Dispatch<React.SetStateAction<FilterSet>>;
}

const ConditionGroupComponent = (props: Props) => {
  const {
    id,
    filterItemIndex,
    filterSet,
    columns,
    columnsObject,
    conjunction,
    onChange,
    onChangeGroup,
    onDelete,
    onDeleteGroup,
    onAddCondition,
    onAddConditionGroup,
    setFilter,
  } = props;

  return (
    <TableRow>
      <TableCell>
        {filterItemIndex === 0 ? (
          <SelectStyled
            value={conjunction}
            onChange={(e) => onChangeGroup("conjunction")(e.target.value)}
            input={
              <OutlinedInputStyled
                sx={{
                  minWidth: `80px!important`,
                  width: 80,
                }}
              />
            }
          >
            <MenuItem value={Conjunction.AND}>
              <ItemText>{AirTableConjunctionLabel[Conjunction.AND]}</ItemText>
            </MenuItem>
            <MenuItem value={Conjunction.OR}>
              <ItemText>{AirTableConjunctionLabel[Conjunction.OR]}</ItemText>
            </MenuItem>
          </SelectStyled>
        ) : (
          <TextLink content={AirTableConjunctionLabel[conjunction]} sx={{ pl: 1 }} />
        )}
      </TableCell>
      <TableCell colSpan={3}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5}>
                <Stack direction="row" spacing={1}>
                  <ButtonStyled
                    variant="text"
                    startIcon={<Add />}
                    onClick={() => onAddCondition(filterSet, setFilter)}
                  >
                    {"Add condition"}
                  </ButtonStyled>
                  <ButtonStyled
                    variant="text"
                    startIcon={<Add />}
                    onClick={() => onAddConditionGroup(filterSet, setFilter)}
                  >
                    {"Add condition group"}
                  </ButtonStyled>
                </Stack>
              </TableCell>
            </TableRow>

            {filterSet?.filterSet?.length > 0 &&
              filterSet?.filterSet?.map((filterItem: FilterItem & FilterSet, index: number) =>
                filterItem.conjunction ? (
                  <ConditionGroupComponent
                    key={filterItem.id}
                    filterItemIndex={index}
                    id={filterItem.id || new ObjectID().toHexString()}
                    filterSet={filterItem}
                    columns={columns}
                    columnsObject={columnsObject}
                    conjunction={filterSet.conjunction || Conjunction.AND}
                    onChange={onChange}
                    onChangeGroup={onChange(filterSet, setFilter, index)}
                    onDelete={onDelete}
                    onDeleteGroup={onDelete(filterSet, setFilter)}
                    onAddCondition={onAddCondition}
                    onAddConditionGroup={onAddConditionGroup}
                    setFilter={(newFilter: FilterSet) => {
                      filterSet.filterSet[index] = newFilter;
                      setFilter({
                        ...filterSet,
                      });
                    }}
                  />
                ) : (
                  <ConditionComponent
                    key={filterItem.id}
                    filterItemIndex={index}
                    {...filterItem}
                    id={filterItem.id || new ObjectID().toHexString()}
                    columns={columns}
                    columnsObject={columnsObject}
                    conjunction={filterSet.conjunction || Conjunction.AND}
                    onChange={onChange(filterSet, setFilter, index)}
                    onDelete={onDelete(filterSet, setFilter)}
                  />
                )
              )}
          </TableBody>
        </Table>
      </TableCell>
      <TableCell>
        <IButtonStyled onClick={() => onDeleteGroup(id)}>
          <DeleteIcon />
        </IButtonStyled>
      </TableCell>
    </TableRow>
  );
};

export default ConditionGroupComponent;

const SelectStyled = styled(Select)(() => ({
  minWidth: 140,
  fontSize: 12,
  height: "fit-content",
  ".MuiSelect-select": {
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
  },
}));

const OutlinedInputStyled = styled(OutlinedInput)(() => ({
  width: 140,
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

const IButtonStyled = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  ".MuiSvgIcon-root": { fontSize: 16, color: theme.palette.primary.main },
}));

const ButtonStyled = styled(MButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  fontSize: 12,
}));
