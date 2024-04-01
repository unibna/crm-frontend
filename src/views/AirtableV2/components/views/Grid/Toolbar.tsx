import React from "react";

import AnchorIcon from "@mui/icons-material/Anchor";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Stack } from "@mui/material";

import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";

import ExportFile from "components/DDataGrid/components/ExportFile";
import { DropdownMultiSelect } from "components/Selectors";
import ButtonAddFileld from "views/AirtableV2/components/views/Grid/ButtonAddFileld";
import Filter from "../../Filter";
import FilterSet from "../../Filter/FilterSet";
import RowHeight from "../../RowHeight";
import Sort from "../../Sort";

import {
  AirTableBase,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableView,
  InsertColumnProps,
  ROW_HEIGHT_TYPES,
  SortItem,
} from "_types_/SkyTableType";

import { stringToSlug } from "utils/helpers";
import { isReadAndWriteRole } from "utils/roleUtils";
import useAuth from "hooks/useAuth";

function Toolbar({
  loading,
  columns,
  visibleColumns,
  disabledFixedFields,
  view,
  filter,
  sort,
  dataExport,
  detailTable,
  viewPermission,
  setFilter,
  setSort,
  onChangeView,
  onAddColumn,
}: {
  loading: boolean;
  columns: AirTableColumn[];
  visibleColumns: any[];
  disabledFixedFields: string[];
  view: AirTableView;
  filter?: FilterSet;
  sort?: SortItem[];
  dataExport: any[];
  detailTable: AirTableBase | null | undefined;
  viewPermission: ROLE_TYPE | undefined;
  setFilter: React.Dispatch<React.SetStateAction<FilterSet | undefined>>;
  setSort: React.Dispatch<React.SetStateAction<SortItem[] | undefined>>;
  onChangeView: (view: any, optional?: any) => void;
  onAddColumn: (
    column: AirTableColumn,
    optional?: {
      insertColumn: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
}) {
  const { user } = useAuth();
  const isMasterPermission = isReadAndWriteRole(user?.is_superuser, viewPermission);

  return (
    <Stack
      direction="row"
      justifyContent={"flex-end"}
      alignItems="center"
      width="100%"
      spacing={2}
      mb={1}
    >
      <Filter
        columns={columns.filter((col) => col.type !== AirTableColumnTypes.LINK_TO_RECORD)}
        filter={filter as any}
        setFilter={setFilter}
        onSetDefault={
          isMasterPermission
            ? (newFilterSet) => {
                onChangeView({
                  ...view,
                  options: {
                    ...view.options,
                    filterSet: newFilterSet,
                  },
                });
              }
            : undefined
        }
      />
      <Sort
        columns={columns.filter((col) => col.type !== AirTableColumnTypes.LINK_TO_RECORD)}
        sort={sort as any}
        setSort={setSort}
        onSetDefault={
          isMasterPermission
            ? (newSortSet) => {
                onChangeView({
                  ...view,
                  options: {
                    ...view.options,
                    sortSet: newSortSet,
                  },
                });
              }
            : undefined
        }
      />
      <RowHeight
        rowHeight={view.options?.rowHeight || ROW_HEIGHT_TYPES.SHORT}
        setRowHeight={(newRowHeight: ROW_HEIGHT_TYPES) => {
          onChangeView({
            ...view,
            options: {
              ...view.options,
              rowHeight: newRowHeight,
            },
          });
        }}
      />
      <ExportFile
        disabled={loading}
        defaultData={dataExport}
        hideTooltip
        label="Export File"
        fileName={stringToSlug(detailTable?.name || "")}
      />
      <DropdownMultiSelect
        isShowHidden
        buttonIcon={<VisibilityOffIcon />}
        title="Hidden Fields"
        options={columns.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        values={visibleColumns.map((item: any) => item.id)}
        setValues={(newVisibleColumns: string[]) => {
          onChangeView({
            ...view,
            visible_fields: view.visible_fields.map((field) => ({
              ...field,
              visible: newVisibleColumns.includes(field.field_id),
            })),
          });
        }}
        disabledValues={detailTable?.primary_key ? [detailTable?.primary_key] : []}
      />

      <DropdownMultiSelect
        buttonIcon={<AnchorIcon />}
        title="Fixed Fields"
        options={columns.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        values={
          view?.options?.fixedFields
            ? detailTable?.primary_key &&
              view?.options?.fixedFields?.includes(detailTable?.primary_key)
              ? view?.options?.fixedFields
              : [detailTable?.primary_key || "", ...view?.options?.fixedFields]
            : [detailTable?.primary_key || ""]
        }
        setValues={(newFixedColumns: string[]) => {
          onChangeView({
            ...view,
            options: {
              ...view.options,
              fixedFields: newFixedColumns,
            },
          });
        }}
        disabledValues={disabledFixedFields}
      />
      {isMasterPermission && <ButtonAddFileld onAddColumn={onAddColumn} columns={columns} />}
    </Stack>
  );
}

export default Toolbar;
