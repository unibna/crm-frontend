import { alpha, Stack, TableRow, useTheme } from "@mui/material";
import IndeterminateCheckbox from "../../IndeterminateCheckbox";
import { styles, TableCellStyled } from "./CommonComponents";
import DragHandle from "./DragHandle";

import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import { IconButton } from "@mui/material";
import {
  AirTableBase,
  AirTableColumnTypes,
  AirTableView,
  ROW_HEIGHT_TYPES,
  SelectedCellRangeType,
} from "_types_/SkyTableType";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import { forwardRef, memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AirTableRowHeightSizes } from "views/AirtableV2/constants";
import { isMatchRoles } from "utils/roleUtils";
import useAuth from "hooks/useAuth";

interface Props {
  row: any;
  rowHeight: number;
  records: any;
  isEdit: boolean;
  isSelecting: boolean;
  selection: [string | null, string | null];
  selectedRow: any;
  linkTables: { [key: string]: AirTableBase };
  view: AirTableView;
  viewPermission?: ROLE_TYPE;
  selectedCellRange: SelectedCellRangeType;
  setSelectedCellRange: React.Dispatch<React.SetStateAction<SelectedCellRangeType>>;
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setSelection: React.Dispatch<React.SetStateAction<[string | null, string | null]>>;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
  onContextMenu: (e: any) => void;
  onSelectedRow: ({
    rowId,
    isAll,
  }: {
    rowId?: string;
    isAll?: boolean;
  }) => (checked: boolean) => void;
  onClickCell: (
    e: any,
    { row, col }: { row: string; col: string; type: AirTableColumnTypes }
  ) => void;
  onOpenRecordForm: () => void;
}

export const DraggableTableRow = memo(
  forwardRef((props: Props, ref: any) => {
    const {
      row,
      rowHeight,
      records,
      isEdit,
      isSelecting,
      selection,
      selectedRow,
      linkTables,
      selectedCellRange,
      view,
      viewPermission,
      setSelectedCellRange,
      setIsSelecting,
      setIsEdit,
      setSelection,
      reorderRow,
      onContextMenu,
      onSelectedRow,
      onClickCell,
      onOpenRecordForm,
    } = props;

    const { user } = useAuth();

    const { columnStart, columnEnd, rowStart, rowEnd } = selectedCellRange;

    const [, dropRef] = useDrop({
      accept: "row",
      drop: (draggedRow: any) => reorderRow(draggedRow.index, row.index),
    });

    const [{ isDragging }, dragRef, previewRef] = useDrag({
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => row,
      type: "row",
    });

    const theme = useTheme();

    const handleMouseDown = (e: any, cell: any) => {
      // !(selection[0] === cell.row.original.id && selection[1] === cell.column.id) &&
      //   setSelection([cell.row.original.id, cell.column.id]);
    };

    const handleMouseUp = (columnIndex: number, rowIndex: number) => (e: any) => {
      if (isSelecting && (columnEnd !== columnIndex || rowEnd !== rowIndex)) {
        e.preventDefault();
        const newSelectedCellRange = {
          ...selectedCellRange,
          columnEnd: columnIndex,
          rowEnd: rowIndex,
        };

        setSelectedCellRange(newSelectedCellRange);
      }
      setIsSelecting(false);
    };

    const handleMouseMove = (columnIndex: number, rowIndex: number) => (e: any) => {
      if (isSelecting && (columnEnd !== columnIndex || rowEnd !== rowIndex)) {
        e.preventDefault();
        const newSelectedCellRange = {
          ...selectedCellRange,
          columnEnd: columnIndex,
          rowEnd: rowIndex,
        };

        if (columnStart === -1) newSelectedCellRange.columnStart = columnIndex;
        if (rowStart === -1) newSelectedCellRange.rowStart = columnIndex;

        setSelectedCellRange(newSelectedCellRange);
      }
    };

    return (
      <TableRow
        {...row.getRowProps()}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="tr"
        sx={{ display: "flex", height: rowHeight }}
        ref={(el: any) => {
          previewRef(el);
          if (ref) {
            ref.current = el;
          }
        }}
        onContextMenu={onContextMenu}
      >
        <TableCellStyled
          className="td"
          sx={{
            ...styles?.checkbox,
            "&:hover": {
              ".btn-drag, .btn-openForm": {
                opacity: 1,
              },
            },
          }}
          isSelectedRow={!!selectedRow[row.original.id]}
          ref={dropRef}
        >
          <Stack direction="row" spacing={0.2} alignItems="center">
            <DragHandle ref={dragRef} isDragging={isDragging} className="btn-drag" />
            <IndeterminateCheckbox
              checked={!!selectedRow[row.original.id]}
              onChange={(e: any) => onSelectedRow({ rowId: row.original.id })(e.target.checked)}
              label={row.index + 1}
              labelStyles={{ pr: 1 }}
            />
            <IconButton
              className="btn-openForm"
              onClick={() => {
                onOpenRecordForm();
              }}
              sx={{
                opacity: 0,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                p: "6px",
                ".MuiSvgIcon-root": {
                  fontSize: "16px",
                  color: theme.palette.primary.main,
                },
              }}
            >
              <SpeakerNotesIcon />
            </IconButton>
          </Stack>
        </TableCellStyled>

        {row.cells.map((cell: any, cellIndex: number) => {
          const isSelectedRange =
            columnStart !== -1 && columnEnd !== -1 && rowStart !== -1 && rowEnd !== -1;

          // Ô được chọn nằm trong nhóm ô đươc chọn từ dưới lên trên, và từ trái qua phải (tức ô bắt đầu nằm ở góc dưới bên trái)
          const isInBottomLeft =
            isSelectedRange &&
            rowStart >= rowEnd &&
            columnStart <= columnEnd &&
            row.index <= rowStart &&
            row.index >= rowEnd &&
            cellIndex >= columnStart &&
            cellIndex <= columnEnd;

          // Ô được chọn nằm trong nhóm ô đươc chọn từ trên xuống dưới, và từ trái qua phải (tức ô bắt đầu nằm ở góc trên bên trái)
          const isInTopLeft =
            isSelectedRange &&
            rowStart <= rowEnd &&
            columnStart <= columnEnd &&
            row.index >= rowStart &&
            row.index <= rowEnd &&
            cellIndex >= columnStart &&
            cellIndex <= columnEnd;

          // Ô được chọn nằm trong nhóm ô đươc chọn từ dưới lên trên, và từ phải qua trái (tức ô bắt đầu nằm ở góc dưới bên phải)
          const isInBottomRight =
            isSelectedRange &&
            rowStart >= rowEnd &&
            columnStart >= columnEnd &&
            row.index <= rowStart &&
            row.index >= rowEnd &&
            cellIndex <= columnStart &&
            cellIndex >= columnEnd;

          // Ô được chọn nằm trong nhóm ô đươc chọn từ trên xuống dưới, và từ phải qua trái (tức ô bắt đầu nằm ở góc trên bên phải)
          const isInTopRight =
            isSelectedRange &&
            rowStart <= rowEnd &&
            columnStart >= columnEnd &&
            row.index >= rowStart &&
            row.index <= rowEnd &&
            cellIndex <= columnStart &&
            cellIndex >= columnEnd;

          return (
            <TableCellStyled
              key={cellIndex}
              {...cell.getCellProps()}
              className="td"
              sx={{
                ...(cell.column.sticky === "left" && {
                  left: `${styles.checkbox.width - 5 + cell.column.totalLeft}px!important`,
                }),
                ...(selection[0] === cell.row.original.id &&
                  selection[1] === cell.column.id &&
                  cell.column.type === AirTableColumnTypes.LONG_TEXT && {
                    height: "max-content",
                    zIndex: 99,
                    ...((rowHeight >= AirTableRowHeightSizes[ROW_HEIGHT_TYPES.TALL] ||
                      isMatchRoles(user?.is_superuser, viewPermission) ||
                      !isEdit) && {
                      height: "100%",
                    }),
                  }),
              }}
              isSelected={selection[0] === cell.row.original.id && selection[1] === cell.column.id}
              isEditing={
                selection[0] === cell.row.original.id && selection[1] === cell.column.id && isEdit
              }
              isSelectedRow={!!selectedRow[row.original.id]}
              isSelectedCellRange={isInBottomLeft || isInBottomRight || isInTopLeft || isInTopRight}
              isShowBorderTop={
                (row.index === rowEnd && (isInBottomLeft || isInBottomRight)) ||
                (row.index === rowStart && (isInTopLeft || isInTopRight))
              }
              isShowBorderBottom={
                (row.index === rowStart && (isInBottomLeft || isInBottomRight)) ||
                (row.index === rowEnd && (isInTopLeft || isInTopRight))
              }
              isShowBorderLeft={
                (cellIndex === columnStart && (isInBottomLeft || isInTopLeft)) ||
                (cellIndex === columnEnd && (isInBottomRight || isInTopRight))
              }
              isShowBorderRight={
                (cellIndex === columnEnd && (isInBottomLeft || isInTopLeft)) ||
                (cellIndex === columnStart && (isInBottomRight || isInTopRight))
              }
              onClick={(e: any) =>
                onClickCell(e, {
                  row: cell.row.original.id,
                  col: cell.column.id,
                  type: cell.column.type,
                })
              }
              onMouseDown={(e: any) => handleMouseDown(e, cell)}
              onMouseUp={handleMouseUp(cellIndex, row.index)}
              onMouseMove={handleMouseMove(cellIndex, row.index)}
            >
              {cell.render("Cell", {
                selection,
                isEdit,
                records,
                column: cell.column,
                row: cell.row.original,
                dataTable: linkTables[cell.column.options?.tableLinkToRecordId],
                view,
              })}
            </TableCellStyled>
          );
        })}
      </TableRow>
    );
  })
);
