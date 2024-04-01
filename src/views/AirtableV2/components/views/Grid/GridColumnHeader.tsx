import { Stack } from "@mui/material";
import { AirTableBase, AirTableColumn, InsertColumnProps } from "_types_/SkyTableType";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import { AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT } from "views/AirtableV2/constants";
import { TableHeaderName } from "./CommonComponents";
import MenuHeader from "./MenuHeader";
import { isReadAndWriteRole } from "utils/roleUtils";
import useAuth from "hooks/useAuth";

function GridColumnHeader({
  column,
  columns,
  columnWidth,
  table,
  viewPermission,
  onAddColumn,
  onToggleHideColumn,
  onChangeColumn,
  onDeleteField,
  onUpdateTable,
}: {
  column: AirTableColumn;
  columns: AirTableColumn[];
  columnWidth: number;
  table: AirTableBase;
  viewPermission?: ROLE_TYPE;
  onAddColumn: (
    column: AirTableColumn,
    optional?: {
      insertColumn: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
  onToggleHideColumn: (col: AirTableColumn) => void;
  onChangeColumn: (
    column: AirTableColumn,
    optional?:
      | {
          insertColumn?: InsertColumnProps | undefined;
          action?: (() => void) | undefined;
          actionSuccess?: (() => void) | undefined;
          actionError?: (() => void) | undefined;
        }
      | undefined
  ) => void;
  onDeleteField: (id: string) => void;
  onUpdateTable: (data: any, action?: ((newData: any) => any) | undefined) => void;
}) {
  const { user } = useAuth();
  
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={"space-between"}
      width="100%"
      height="100%"
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.icon}
        <TableHeaderName
          sx={{
            width: `calc(${columnWidth}px - 62px)`,
            ...(column.id === table?.primary_key && {
              fontWeight: 700,
            }),
          }}
        >
          {column.name}
        </TableHeaderName>
      </Stack>
      {isReadAndWriteRole(user?.is_superuser, viewPermission) && (
        <MenuHeader
          columns={columns}
          column={column}
          table={table}
          onAddColumn={onAddColumn}
          onToggleHideColumn={() => onToggleHideColumn(column)}
          onChangeColumn={onChangeColumn}
          onDeleteField={onDeleteField}
          onUpdateTable={onUpdateTable}
        />
      )}
    </Stack>
  );
}

export default GridColumnHeader;
