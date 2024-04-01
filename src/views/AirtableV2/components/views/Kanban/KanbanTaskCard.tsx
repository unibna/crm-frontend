import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableOption,
  AirTableView,
} from "_types_/SkyTableType";
import { MTextLine } from "components/Labels";
import { useAppSelector } from "hooks/reduxHook";
import React, { forwardRef, useContext, useEffect, useRef } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { convertTableRecordToOptions, getStyle } from "utils/skyTableUtil";
import {
  AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT,
  AirTableColumnIcons,
  BEFieldType,
  OPTIONS_TYPES,
} from "views/AirtableV2/constants";
import { AirtableContext } from "views/AirtableV2/context";
import { KanbanContext } from ".";

type Props = {
  provided: DraggableProvided;
  isDragging: boolean;
  index: number;
  rowIndex: number;
  columns: AirTableColumn[];
  view: AirTableView;
  card: any;
  userOptions: AirTableOption[];
  linkTables: { [key: string]: AirTableBase };
  style?: React.CSSProperties;
  setFileReviewConfig: React.Dispatch<
    React.SetStateAction<{
      files: any[];
      currentIndex: number;
      cell?: AirTableCell;
    }>
  >;
  onOpenRecordForm: () => void;
  onOpenLinkRecordFormPopup: React.Dispatch<
    React.SetStateAction<{
      recordId: string | undefined;
      tableId: string | undefined;
    }>
  >;
};

const KanbanTaskCard = forwardRef(
  (
    {
      provided,
      isDragging,
      view,
      columns,
      card,
      userOptions,
      linkTables,
      index,
      rowIndex,
      style,
      setFileReviewConfig,
      onOpenRecordForm,
      onOpenLinkRecordFormPopup,
    }: Props,
    ref: any
  ) => {
    const cardRef = useRef<any>(null);
    const userList = useAppSelector<any>((state) => state.users).users;
    const { setSize } = useContext<any>(KanbanContext);
    const {
      state: {
        data: { detailTable },
      },
    } = useContext(AirtableContext);

    useEffect(() => {
      cardRef?.current && setSize(cardRef?.current?.offsetHeight + 20);
    }, [cardRef?.current]);

    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={getStyle({
          draggableStyle: provided.draggableProps.style,
          virtualStyle: style,
          isDragging,
        })}
      >
        <Paper
          ref={cardRef}
          sx={{
            p: 2,
            width: 1,
            position: "relative",
            boxShadow: (theme) => theme.customShadows.z1,
            "&:hover": {
              boxShadow: (theme) => theme.customShadows.z16,
            },
          }}
        >
          <Box onClick={onOpenRecordForm} sx={{ cursor: "pointer" }}>
            <Stack direction="column" spacing={2}>
              {view?.visible_fields?.map((field) => {
                if (!field.visible) return null;
                const column = columns.find((col) => col.id === field.field_id);

                if (!column) return null;
                const cell = card[field.field_id];
                const cellValue = cell?.value;

                const dataTable =
                  column.options?.tableLinkToRecordId &&
                  linkTables?.[column.options?.tableLinkToRecordId];

                const renderFunc = AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.renderFunc;

                const onChangeFileReviewConfig = (config: { files: any[]; currentIndex: number }) =>
                  setFileReviewConfig({
                    cell: {
                      id: cell.id,
                      table: detailTable?.id || "",
                      field: column.id,
                      record: card.id,
                      cell: {
                        type: BEFieldType[column.type],
                        value: cellValue,
                      },
                    },
                    ...config,
                  });

                const choices =
                  column.type === AirTableColumnTypes.SINGLE_USER ||
                  column.type === AirTableColumnTypes.MULTIPLE_USER
                    ? userOptions
                    : column.type === AirTableColumnTypes.LINK_TO_RECORD
                    ? convertTableRecordToOptions(
                        dataTable,
                        column.options?.recordDisplay,
                        userOptions
                      )
                    : column?.options?.choices;

                const renderValue = () => {
                  if (!cellValue || cellValue.length === 0) return null;

                  if (column.type === AirTableColumnTypes.LINK_TO_RECORD)
                    return renderFunc(
                      choices,
                      cellValue,
                      (recordId: string) =>
                        onOpenLinkRecordFormPopup({
                          recordId,
                          tableId: column.options?.tableLinkToRecordId,
                        }),
                      {
                        stack: {
                          overflow: "hidden",
                        },
                      }
                    );

                  if (OPTIONS_TYPES.includes(column.type))
                    return renderFunc(choices, cellValue, {
                      stack: {
                        overflow: "hidden",
                      },
                    });

                  if (column.type === AirTableColumnTypes.ATTACHMENT)
                    return renderFunc(cellValue, onChangeFileReviewConfig, false, {
                      stack: {
                        overflow: "hidden",
                      },
                    });

                  return renderFunc(cellValue);
                };

                return (
                  column && (
                    <MTextLine
                      key={field.field_id}
                      displayType="grid"
                      label={
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: "16px",
                              color: "grey[900]",
                            },
                          }}
                        >
                          {AirTableColumnIcons[column.type]}
                          <Typography fontSize={"10px"} color="grey[900]">
                            {column.name}
                          </Typography>
                        </Stack>
                      }
                      value={renderValue()}
                    />
                  )
                );
              })}
            </Stack>
          </Box>
        </Paper>
      </div>
    );
  }
);

export default KanbanTaskCard;
