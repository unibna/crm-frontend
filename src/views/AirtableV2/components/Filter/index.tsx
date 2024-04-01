import ObjectID from "bson-objectid";
import { useMemo } from "react";

import Add from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { alpha, Box, Stack, styled, Table, TableBody } from "@mui/material";

import { Conjunction, Operator } from "./AbstractFilterItem";
import FilterItem from "./FilterItem";
import FilterSet from "./FilterSet";

import { MAP_OPERATOR_WITH_COLUMN_TYPE } from "views/AirtableV2/constants";

import { AirTableColumn } from "_types_/SkyTableType";
import { MButton } from "components/Buttons";
import ConditionComponent from "./components/FilterCondition";
import ConditionGroupComponent from "./components/FilterConditionGroup";
import EmptyContent from "views/DataFlow/components/EmptyContent";
import MDropdown from "components/DragAndDrop/MDropdown";

export const initState: FilterSet = new FilterSet(
  new ObjectID().toHexString(),
  [],
  Conjunction.AND
);

export default function Filter({
  isNonPopover = false,
  columns = [],
  filter = initState,
  setFilter,
  onSetDefault,
}: {
  isNonPopover?: boolean;
  columns: AirTableColumn[];
  filter: FilterSet;
  setFilter: (newFilterSet: FilterSet) => void;
  onSetDefault?: (newFilterSet: FilterSet) => void;
}) {
  const columnsObject: any = useMemo(
    () => columns.reduce((prev, current) => ({ ...prev, [current.id]: current }), {}),
    [columns]
  );

  const handleAddCondition = (
    filter: FilterSet,
    setFilter: React.Dispatch<React.SetStateAction<FilterSet>>
  ) => {
    if (columns.length > 0) {
      const defaultOperator: string | undefined = Object.keys(Operator).find(
        (operatorKey: keyof typeof Operator) =>
          MAP_OPERATOR_WITH_COLUMN_TYPE[Operator[operatorKey]].includes(columns[0].type)
      );
      if (defaultOperator) {
        setFilter({
          ...filter,
          filterSet: [
            ...filter.filterSet,
            new FilterItem(
              new ObjectID().toHexString(),
              columns[0].id,
              Operator[defaultOperator as keyof typeof Operator],
              ""
            ),
          ],
        });
      }
    }
  };

  const handleAddConditionGroup = (
    filter: FilterSet,
    setFilter: React.Dispatch<React.SetStateAction<FilterSet>>
  ) => {
    setFilter({
      ...filter,
      filterSet: [
        ...filter.filterSet,
        new FilterSet(new ObjectID().toHexString(), [], Conjunction.AND),
      ],
    });
  };

  const handleChange =
    (
      filter: FilterSet,
      setFilter: React.Dispatch<React.SetStateAction<FilterSet>>,
      index: number
    ) =>
    (name: string) =>
    (value: string & Conjunction & Operator) => {
      if (name === "conjunction") {
        setFilter({
          ...filter,
          conjunction: value,
        });
        return;
      }

      if (name === "columnId") {
        filter.filterSet[index].columnId = value;
        const newColumnType = columnsObject[value].type;
        const operator = filter.filterSet[index].operator;
        const defaultOperator: string | undefined = Object.keys(Operator).find(
          (operatorKey: keyof typeof Operator) =>
            MAP_OPERATOR_WITH_COLUMN_TYPE[Operator[operatorKey]].includes(newColumnType)
        );
        filter.filterSet[index].operator =
          operator && MAP_OPERATOR_WITH_COLUMN_TYPE[operator].includes(newColumnType)
            ? operator
            : Operator[defaultOperator as keyof typeof Operator];
        filter.filterSet[index].value = "";
      }

      if (name === "operator") {
        filter.filterSet[index].operator = value || Operator.EQUAL;
      }

      if (name === "value") filter.filterSet[index].value = value;

      setFilter({
        ...filter,
      });
    };

  const handleDelete =
    (filter: FilterSet, setFilter: React.Dispatch<React.SetStateAction<FilterSet>>) =>
    (id: string) => {
      setFilter({ ...filter, filterSet: filter.filterSet.filter((item) => item.id !== id) });
    };

  const renderContent = (
    <Box sx={{ p: 2, minWidth: 300 }}>
      <Stack direction="row" spacing={1}>
        <ButtonStyled
          variant="text"
          startIcon={<Add />}
          onClick={() => handleAddCondition(filter, setFilter)}
        >
          {"Add condition"}
        </ButtonStyled>
        <ButtonStyled
          variant="text"
          startIcon={<Add />}
          onClick={() => handleAddConditionGroup(filter, setFilter)}
        >
          {"Add condition group"}
        </ButtonStyled>
      </Stack>
      {filter?.filterSet.length === 0 && (
        <EmptyContent
          title="Empty"
          description="No conditions are applied in this view"
          imgStyles={{ height: 100 }}
          sx={{ p: 0, pt: 3 }}
        />
      )}

      <Table sx={{ gap: 1, mt: 3, maxHeight: "400px", overflow: "auto" }}>
        <TableBody>
          {filter?.filterSet?.length > 0 &&
            filter?.filterSet?.map((filterItem: FilterItem & FilterSet, filterItemIndex: number) =>
              filterItem.conjunction ? (
                <ConditionGroupComponent
                  key={filterItem.id}
                  filterItemIndex={filterItemIndex}
                  id={filterItem.id || new ObjectID().toHexString()}
                  filterSet={filterItem}
                  columns={columns}
                  columnsObject={columnsObject}
                  conjunction={filter.conjunction || Conjunction.AND}
                  onChange={handleChange}
                  onDelete={handleDelete}
                  onChangeGroup={handleChange(filter, setFilter, filterItemIndex)}
                  onDeleteGroup={handleDelete(filter, setFilter)}
                  onAddCondition={handleAddCondition}
                  onAddConditionGroup={handleAddConditionGroup}
                  setFilter={(newFilter: FilterSet) => {
                    filter.filterSet[filterItemIndex] = newFilter;
                    setFilter({
                      ...filter,
                    });
                  }}
                />
              ) : (
                <ConditionComponent
                  key={filterItem.id}
                  filterItemIndex={filterItemIndex}
                  {...filterItem}
                  id={filterItem.id || new ObjectID().toHexString()}
                  columns={columns}
                  columnsObject={columnsObject}
                  conjunction={filter.conjunction || Conjunction.AND}
                  onChange={handleChange(filter, setFilter, filterItemIndex)}
                  onDelete={handleDelete(filter, setFilter)}
                />
              )
            )}
        </TableBody>
      </Table>
      {onSetDefault && (
        <Stack direction="row" mt={2} justifyContent={"flex-end"}>
          <MButton sx={{ fontSize: "12px" }} onClick={() => onSetDefault({ ...filter })}>
            Áp dụng mặc định
          </MButton>
        </Stack>
      )}
    </Box>
  );

  if (isNonPopover) return renderContent;

  return (
    <MDropdown
      buttonTitle="Filter"
      buttonIcon={<FilterListIcon />}
      badgeContent={filter.filterSet.length}
    >
      {renderContent}
    </MDropdown>
  );
}

const ButtonStyled = styled(MButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  fontSize: 12,
}));
