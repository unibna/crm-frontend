import { Stack } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import {
  AirTableBase,
  AirTableColumn,
  AirTableFieldConfig,
  AirTableView,
} from "_types_/SkyTableType";
import { useMemo } from "react";
import {
  TableHeadStyled,
  TableHeaderWrap,
  styles,
} from "views/AirtableV2/components/views/Grid/CommonComponents";
import IndeterminateCheckbox from "../../IndeterminateCheckbox";
import DragHandle from "./DragHandle";
import { DraggableHeader } from "./DraggableHeader";

function GridHeader({
  view,
  detailTable,
  headerGroups,
  isCheckAll,
  selectedRow,
  columnOrder,
  lastColRef,
  fieldConfigsObject,
  onSelectedRow,
  onChangeView,
}: {
  view: AirTableView;
  detailTable: AirTableBase | null | undefined;
  headerGroups: any[];
  isCheckAll: boolean;
  selectedRow: any;
  columnOrder: string[];
  lastColRef?: React.MutableRefObject<HTMLElement | undefined>;
  fieldConfigsObject: {
    [key: string]: AirTableFieldConfig;
  };
  onSelectedRow: ({
    rowId,
    isAll,
  }: {
    rowId?: string | undefined;
    isAll?: boolean | undefined;
  }) => (checked: boolean) => void;
  onChangeView: (view: any, optional?: any) => void;
}) {
  const arrSelectedRow = useMemo(() => {
    return Object.keys(selectedRow).filter((item) => selectedRow[item]);
  }, [selectedRow]);

  const onChangeColumnOrder = (newColumnOrder: AirTableColumn["id"][]) => {
    onChangeView({
      ...view,
      visible_fields: newColumnOrder.map((columnId) => ({
        ...fieldConfigsObject[columnId],
      })),
    });
  };

  const reorderColumn = (
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[]
  ): any => {
    columnOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
    );
    return [...columnOrder];
  };
  return (
    <TableHeadStyled className="th">
      {headerGroups.map((headerGroup: any, headerGroupIndex: number) => (
        <TableRow {...headerGroup.getHeaderGroupProps()} className="tr" key={headerGroupIndex}>
          <TableHeaderWrap className="td" sx={styles.checkbox}>
            <Stack direction="row" height={"100%"} alignItems="center" spacing={0.2}>
              <DragHandle />
              <IndeterminateCheckbox
                checked={isCheckAll || false}
                onChange={(e: any) => onSelectedRow({ isAll: true })(!isCheckAll)}
                label={`${arrSelectedRow.length ? `(${arrSelectedRow.length})` : ""}`}
              />
            </Stack>
          </TableHeaderWrap>

          {headerGroup.headers.map((column: any, columnIndex: number) => (
            <DraggableHeader
              key={column.id}
              column={column}
              columnOrder={columnOrder}
              columnIndex={columnIndex}
              view={view}
              table={detailTable}
              reorderColumn={reorderColumn}
              setColumnOrder={onChangeColumnOrder}
            />
          ))}
          <TableCell ref={lastColRef} style={{ width: 0, padding: 0 }} />
        </TableRow>
      ))}
    </TableHeadStyled>
  );
}

export default GridHeader;
