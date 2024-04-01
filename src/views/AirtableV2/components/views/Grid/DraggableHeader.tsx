import { Stack } from "@mui/material";
import { AirTableBase, AirTableView } from "_types_/SkyTableType";
import { useDrag, useDrop } from "react-dnd";
import { Resizer, TableHeaderWrap, styles } from "./CommonComponents";

interface Props {
  view: AirTableView;
  table?: AirTableBase | null;
  column: any;
  columnIndex: number;
  columnOrder: string[];
  setColumnOrder: (newColumnOrder: string[]) => void;
  reorderColumn: (
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[]
  ) => string[];
}

export const DraggableHeader = (props: Props) => {
  const { column, columnIndex, columnOrder, view, table, setColumnOrder, reorderColumn } = props;

  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: any) => {
      if (draggedColumn.id !== column.id) {
        const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
        setColumnOrder(newColumnOrder);
      }
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });

  return (
    <TableHeaderWrap
      {...column.getHeaderProps()}
      key={columnIndex}
      className="td"
      sx={{
        display: "flex",
        ...(column.sticky === "left" && {
          left: `${styles.checkbox.width - 5 + column.totalLeft}px!important`,
        }),
        opacity: isDragging ? 0.5 : 1,
      }}
      id={column.id}
      ref={dropRef}
    >
      <Stack ref={previewRef} width="100%" height={"100%"}>
        <Stack direction="row" ref={dragRef} width="100%" height={"100%"}>
          {column.render("Header", {
            columnWidth: column.width,
            view,
            table,
          })}
          {/* <DragHandle
            ref={dragRef}
            isDragging={isDragging}
            className="btn-drag"
            sx={{ width: "fit-content", opacity: 1 }}
          /> */}
        </Stack>
      </Stack>

      <Resizer
        {...column.getResizerProps()}
        isResizing={column.isResizing}
        className={`resizer ${column.isResizing ? "isResizing" : ""}`}
        sx={{ ...(isDragging ? { opacity: 0 } : { opacity: 1 }) }}
      />
    </TableHeaderWrap>
  );
};
