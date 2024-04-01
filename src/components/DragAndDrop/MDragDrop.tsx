// Libraries
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult, Draggable } from "react-beautiful-dnd";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";

// Components
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

// @Types
import { RowDrop, ColumnDrop } from "_types_/DragDropTypes";

// Constants && Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

interface ContentShowRowProps extends RowDrop {
  indexRow: number;
}

interface ContentShowColumnsProps {
  id: string;
  label: string;
  indexColumn: number;
}

interface Props {
  data: RowDrop[];
  handleDragData: (data: RowDrop[]) => void;
}

const ContentShowColumn = (props: ContentShowColumnsProps) => {
  const { id, label, indexColumn } = props;

  return (
    <Draggable draggableId={id} index={indexColumn} isDragDisabled={false}>
      {(provided) => (
        <Chip
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          variant="outlined"
          size="small"
          label={label}
        />
      )}
    </Draggable>
  );
};

const ContentShowRow = (props: ContentShowRowProps) => {
  const theme = useTheme();
  const { id, label, indexRow, columnData = [] } = props;

  return (
    <Draggable draggableId={id} index={indexRow} isDragDisabled={false}>
      {(provided) => (
        <Grid
          container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            borderBottom: `solid 1px ${theme.palette.grey[500_32]}`,
            borderTop: `solid 1px ${theme.palette.grey[500_32]}`,
            p: 2,
          }}
        >
          <Grid item xs={5}>
            <Typography>{label}</Typography>
          </Grid>
          <Grid item xs={7}>
            <Droppable droppableId={indexRow + ""} type="columns" isDropDisabled={false}>
              {(provided) => (
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  direction="row"
                  alignItems="center"
                >
                  {map(columnData, (item: ColumnDrop, index: number) => {
                    return <ContentShowColumn key={item.id} indexColumn={index} {...item} />;
                  })}
                </Stack>
              )}
            </Droppable>
          </Grid>
        </Grid>
      )}
    </Draggable>
  );
};
/**
 * Create placeholder allow drag and drop
 *
 * @param data contain columns
 * @param handleDragData the data of the column is dragged
 * @returns
 */
const MDragDrop = (props: Props) => {
  const { data = [], handleDragData } = props;
  const [arrRender, setArrRender] = useState<RowDrop[]>([]);

  useEffect(() => {
    setArrRender(data);
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    let newArrRender = [...arrRender];

    if (type === "row") {
      [newArrRender[destination.index], newArrRender[source.index]] = [
        newArrRender[source.index],
        newArrRender[destination.index],
      ];
    } else {
      newArrRender = map(arrRender, (item: RowDrop, index: number) => {
        if (index === +destination.droppableId && index === +source.droppableId) {
          const newColumnData = [...item.columnData];

          [newColumnData[destination.index], newColumnData[source.index]] = [
            newColumnData[source.index],
            newColumnData[destination.index],
          ];

          return {
            ...item,
            columnData: getObjectPropSafely(() => item.columnData.length) ? newColumnData : [],
          };
        }

        return item;
      });
    }

    setArrRender(newArrRender);
    handleDragData(newArrRender);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-rows" type="row" isDropDisabled={false}>
        {(provided) => (
          <Stack {...provided.droppableProps} ref={provided.innerRef}>
            {map(arrRender, (item: RowDrop, index: number) => {
              return <ContentShowRow key={item.id} indexRow={index} {...item} />;
            })}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MDragDrop;
