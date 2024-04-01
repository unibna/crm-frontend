import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  AirTableBase,
  AirTableColumnTypes,
  AirTableRow,
  AirTableView,
  SelectedCellRangeType,
} from "_types_/SkyTableType";
import { ROLE_TYPE } from "constants/rolesTab";
import { forwardRef } from "react";
import { VirtualItem } from "react-virtual";

import { TableBodyStyled } from "views/AirtableV2/components/views/Grid/CommonComponents";
import { DraggableTableRow } from "views/AirtableV2/components/views/Grid/DraggableRow";

const GridBody = forwardRef(
  (
    {
      data,
      rows,
      view,
      isEdit,
      isSelecting,
      selection,
      selectedRow,
      linkTables,
      listRecords,
      detailTable,
      viewPermission,
      getTableBodyProps,
      prepareRow,
      lastRowRef,
      newRecordIdJustAdded,
      virtualRows,
      totalSize,
      selectedCellRange,
      setSelection,
      setIsEdit,
      setIsSelecting,
      setSelectedCellRange,
      setRecordId,
      onSelectedRow,
      onContextMenu,
      onClickCell,
    }: {
      data: any[];
      rows: any[];
      view: AirTableView;
      isEdit: boolean;
      isSelecting: boolean;
      selection: [string | null, string | null];
      selectedRow: {};
      linkTables: {
        [key: string]: AirTableBase;
      };
      listRecords: AirTableRow[];
      detailTable?: AirTableBase | null;
      virtualRows: VirtualItem[];
      totalSize: number;
      viewPermission?: ROLE_TYPE;
      getTableBodyProps: any;
      prepareRow: any;
      lastRowRef: any;
      newRecordIdJustAdded: any;
      selectedCellRange: SelectedCellRangeType;
      setSelectedCellRange: React.Dispatch<React.SetStateAction<SelectedCellRangeType>>;
      setSelection: React.Dispatch<React.SetStateAction<[string | null, string | null]>>;
      setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
      setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
      setRecordId: React.Dispatch<React.SetStateAction<string>>;
      onSelectedRow: ({
        rowId,
        isAll,
      }: {
        rowId?: string | undefined;
        isAll?: boolean | undefined;
      }) => (checked: boolean) => void;
      onContextMenu: (rowId: string) => (e: any) => void;
      onClickCell: (
        e: any,
        {
          row,
          col,
          type,
        }: {
          row: string;
          col: string;
          type: AirTableColumnTypes;
        }
      ) => void;
    },
    ref: any
  ) => {
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom =
      virtualRows.length > 0 ? totalSize - virtualRows?.[virtualRows.length - 1]?.end || 0 : 0;

    const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
      data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0]);
      // onChangeView({
      //   ...view,
      //   options: {
      //     ...view.options,
      //     rowOrder: newRowOrder(dataTable).reduce((r: any, v: any) => ({ ...r, [v.id]: v.id }), {}),
      //   },
      // });
    };

    const handleOpenRecordForm = (row: any) => {
      setRecordId(row.original.id);
    };
    return (
      <TableBodyStyled {...getTableBodyProps()} className="tbody" ref={ref}>
        {paddingTop > 0 && (
          <TableRow>
            <TableCell sx={{ height: `${paddingTop}px` }} />
          </TableRow>
        )}

        {virtualRows.map((virtualRow) => {
          let row = rows[virtualRow.index] as any;
          prepareRow(row);
          return (
            <DraggableTableRow
              key={row.original.id}
              row={row}
              rowHeight={virtualRow.size}
              records={listRecords}
              isEdit={isEdit}
              isSelecting={isSelecting}
              selection={selection}
              selectedRow={selectedRow}
              linkTables={linkTables}
              view={view}
              viewPermission={viewPermission}
              selectedCellRange={selectedCellRange}
              ref={newRecordIdJustAdded?.current === row.original.id ? lastRowRef : null}
              setIsEdit={setIsEdit}
              setSelection={setSelection}
              setIsSelecting={setIsSelecting}
              setSelectedCellRange={setSelectedCellRange}
              reorderRow={reorderRow}
              onSelectedRow={onSelectedRow}
              onContextMenu={onContextMenu(row.original.id)}
              onClickCell={onClickCell}
              onOpenRecordForm={() => handleOpenRecordForm(row)}
            />
          );
        })}

        {paddingBottom > 0 && (
          <TableRow>
            <TableCell sx={{ height: `${paddingBottom}px` }} />
          </TableRow>
        )}
      </TableBodyStyled>
    );
  }
);

export default GridBody;
