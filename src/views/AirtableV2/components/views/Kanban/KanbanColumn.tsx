import { memo, useContext, useLayoutEffect, useRef } from "react";
import { Draggable, DraggableProvided, Droppable } from "react-beautiful-dnd";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableOption,
  AirTableView,
} from "_types_/SkyTableType";

import { KanbanContext } from ".";
// @mui
import { Button, Divider, Paper, Stack } from "@mui/material";

// components
import Add from "@mui/icons-material/Add";
import { getStyle } from "utils/skyTableUtil";
import KanbanColumnToolbar from "./KanbanColumnToolbar";
import KanbanTaskCard from "./KanbanTaskCard";

// ----------------------------------------------------------------------

type Props = {
  provided: DraggableProvided;
  isDragging: boolean;
  style?: any;
  choice: AirTableOption;
  choices?: { [key: string]: AirTableOption };
  index: number;
  cards?: { [key: string]: any[] };
  columns: AirTableColumn[];
  view: AirTableView;
  userOptions: AirTableOption[];
  linkTables: { [key: string]: AirTableBase };
  setFileReviewConfig: React.Dispatch<
    React.SetStateAction<{
      files: any[];
      currentIndex: number;
      cell?: AirTableCell;
    }>
  >;
  onOpenRecordForm: (row: any) => void;
  onAddRow: () => void;
  onChangeOptions: (
    newValue: AirTableOption[],
    optional?: {
      actionSuccess: () => void;
    }
  ) => void;
  onOpenLinkRecordFormPopup: React.Dispatch<
    React.SetStateAction<{
      recordId: string | undefined;
      tableId: string | undefined;
    }>
  >;
};

export default function KanbanColumn({
  style,
  choice,
  choices,
  index,
  cards,
  columns,
  view,
  userOptions,
  provided,
  isDragging,
  linkTables,
  setFileReviewConfig,
  onOpenRecordForm,
  onAddRow,
  onChangeOptions,
  onOpenLinkRecordFormPopup,
}: Props) {
  const { id } = choice;
  const { getSize } = useContext<any>(KanbanContext);

  const ItemList = memo(({ card, index }: any) => {
    const listRef = useRef<any>();

    useLayoutEffect(() => {
      const list = listRef.current;
      if (list) {
        list.scrollTo(card?.length);
      }
    }, [index]);

    return (
      <Droppable
        droppableId={id}
        mode="virtual"
        type="task"
        renderClone={(provided, snapshot, rubric) => (
          <KanbanTaskCard
            provided={provided}
            isDragging={snapshot.isDragging}
            key={card?.[rubric.source.index]?.id}
            rowIndex={rubric.source.index}
            index={index}
            view={view}
            columns={columns}
            userOptions={userOptions}
            card={card?.[rubric.source.index]}
            linkTables={linkTables}
            setFileReviewConfig={setFileReviewConfig}
            onOpenRecordForm={() => onOpenRecordForm(card?.[rubric.source.index])}
            onOpenLinkRecordFormPopup={onOpenLinkRecordFormPopup}
          />
        )}
      >
        {(provided, snapshot) => {
          const itemCount = snapshot.isUsingPlaceholder ? card?.length || 0 + 1 : card?.length || 1;
          return (
            <FixedSizeList
              height={window.innerHeight - 490}
              width={280}
              itemSize={getSize() || window.innerHeight - 490}
              itemCount={itemCount}
              itemData={card || []}
              outerRef={provided.innerRef}
              ref={listRef}
            >
              {Row}
            </FixedSizeList>
          );
        }}
      </Droppable>
    );
  });

  const Row = memo(({ data, index: rowIndex, style }: ListChildComponentProps) => {
    const item = data[rowIndex];
    if (!item) {
      return null;
    }

    return (
      <Draggable draggableId={item.id} index={rowIndex} key={item.id}>
        {(provided, snapshot) => (
          <KanbanTaskCard
            isDragging={snapshot.isDragging}
            provided={provided}
            style={style}
            key={item.id}
            rowIndex={rowIndex}
            index={index}
            view={view}
            columns={columns}
            card={item}
            userOptions={userOptions}
            linkTables={linkTables}
            setFileReviewConfig={setFileReviewConfig}
            onOpenRecordForm={() => onOpenRecordForm(item)}
            onOpenLinkRecordFormPopup={onOpenLinkRecordFormPopup}
          />
        )}
      </Draggable>
    );
  });

  return (
    <Paper
      {...provided.draggableProps}
      ref={provided.innerRef}
      variant="outlined"
      sx={{ px: 2, borderStyle: "dashed", backgroundColor: "transparent" }}
      style={getStyle({
        draggableStyle: provided.draggableProps.style,
        virtualStyle: style,
        isDragging,
      })}
    >
      <Divider
        sx={{
          borderWidth: "4px",
          borderColor: choice.color,
          margin: "0 -16px",
          borderRadius: "8px 8px 0 0",
        }}
      />
      <Stack spacing={3} {...provided.dragHandleProps}>
        <KanbanColumnToolbar choice={choice} choices={choices} onChangeOptions={onChangeOptions} />

        <ItemList card={cards?.[choice.id]} index={index} />

        <Stack spacing={2} sx={{ pb: 3 }}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            startIcon={<Add width={20} height={20} />}
            onClick={onAddRow}
            sx={{ fontSize: 14 }}
          >
            New Record
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
