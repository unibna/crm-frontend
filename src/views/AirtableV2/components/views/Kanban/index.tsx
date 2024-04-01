import ObjectID from "bson-objectid";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { alpha, Paper, Stack, useTheme } from "@mui/material";

import FormDialog from "components/Dialogs/FormDialog";
import { FormInput } from "components/Popups/FormPopup";

import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import usePopup from "hooks/usePopup";

import { randomHSLA } from "utils/helpers";

import { AirtableContext } from "views/AirtableV2/context";

import { GridSizeType } from "_types_/GridLayoutType";

import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableFieldConfig,
  AirTableOption,
  AirTableRow,
  AirTableView,
  InsertColumnProps,
  InsertRowProps,
  LinkRecordProps,
  SortItem,
} from "_types_/SkyTableType";
import { DropdownMultiSelect } from "components/Selectors";
import { useAppSelector } from "hooks/reduxHook";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { checkFilterSet, compareFunction } from "utils/skyTableUtil";
import { BEFieldType, DefaultData } from "views/AirtableV2/constants";
import AttachmentReviewer from "../../AttachmentReviewer";
import Filter from "../../Filter";
import FilterSet from "../../Filter/FilterSet";
import Form from "../../Form";
import LinkRecordForm from "../../Form/LinkRecordForm";
import Sort from "../../Sort";
import UploadAttachment from "../../UploadAttachment";
import KanbanColumn from "./KanbanColumn";
import KanbanColumnAdd from "./KanbanColumnAdd";
import SkeletonKanbanColumn from "./SkeletonKanbanColumn";
import { isReadAndWriteRole } from "utils/roleUtils";
import useAuth from "hooks/useAuth";

export const KanbanContext = createContext({});
interface Props {
  columns: AirTableColumn[];
  data: any[];
  view: AirTableView;
  fieldConfigsObject: { [key: string]: AirTableFieldConfig };
  viewPermission?: ROLE_TYPE;
  linkTables: { [key: string]: AirTableBase };
  setLinkTables: (newLinkTables: { [key: string]: AirTableBase }) => void;
  onChangeColumn: (
    column: AirTableColumn,
    optional?: {
      insertColumn?: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
  onChangeRow: (
    row: any,
    records: any[],
    optional?: {
      insertRow?: InsertRowProps;
      action?: (result: any) => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
  onChangeCell: (cell: AirTableCell, records: any[], optional?: any) => void;
  onChangeView: (view: any, optional?: any) => void;
  onDeleteField: (id: AirTableColumn["id"]) => void;
  onDeleteRow: (id: AirTableRow["id"]) => void;
  onOpenLinkRecordPopup: (props: LinkRecordProps) => void;
}

function KanbanView(props: Props) {
  const {
    columns = [],
    data = [],
    view,
    fieldConfigsObject,
    viewPermission,
    linkTables,
    setLinkTables,
    onChangeColumn,
    onChangeRow,
    onChangeCell,
    onChangeView,
    onDeleteField,
    onDeleteRow,
    onOpenLinkRecordPopup,
  } = props;

  const { user } = useAuth();

  const [fileReviewConfig, setFileReviewConfig] = useState<{
    files: any[];
    currentIndex: number;
    cell?: AirTableCell;
  }>({
    files: [],
    currentIndex: -1,
    cell: undefined,
  });
  const [recordId, setRecordId] = useState<string>("");
  const [filter, setFilter] = useState<FilterSet>();
  const [sort, setSort] = useState<SortItem[]>();
  const [linkRecord, setLinkRecord] = useState<{
    recordId: string | undefined;
    tableId: string | undefined;
  }>({
    recordId: "",
    tableId: "",
  });

  const { dataPopupChild, setDataPopupChild, dataFormChild, closePopupChild } = usePopup();
  const {
    state: {
      data: { listRecords, detailTable },
    },
  } = useContext(AirtableContext);

  const theme = useTheme();
  const selectColumn = useMemo(() => {
    return columns.find((column) => column.id === view.options?.fieldKanban);
  }, [columns]);

  const userList = useAppSelector<any>((state) => state.users).users;

  const userOptions: AirTableOption[] = useMemo(
    () =>
      userList.map(
        (item: any) =>
        ({
          ...item,
          label: item.name,
          value: item.id,
          image: item?.image?.url,
        } || [])
      ),
    [userList]
  );

  useEffect(() => {
    setFilter(view.options?.filterSet);
  }, [view.options?.filterSet]);

  useEffect(() => {
    setSort(view.options?.sortSet);
  }, [view.options?.sortSet]);

  const dataTable = useMemo(() => {
    let temp = data;
    if (columns.length > 0 && filter && filter?.filterSet?.length > 0 && temp.length > 0) {
      temp = data.filter((item) => checkFilterSet(item, filter as any));
    }

    if (columns.length > 0 && sort && sort?.length > 0 && temp.length > 1) {
      temp = temp.sort(compareFunction(columns, sort));
    }

    return temp;
  }, [data, filter, sort, columns]);

  const board: {
    choiceOrder: string[];
    choices: {
      uncategorized: {
        id: string;
        name: string;
        color: string;
      };
      [key: string]: {
        id: string;
        name: string;
        color: string;
      };
    };
    cards: any;
  } = useMemo(() => {
    const choiceOrder =
      selectColumn?.options?.choiceOrder &&
        selectColumn?.options?.choiceOrder?.length === selectColumn?.options?.choices?.length
        ? selectColumn?.options?.choiceOrder
        : selectColumn?.options?.choices?.map((choice) => choice.id) || [];

    const choices =
      selectColumn?.options?.choices?.reduce(
        (prev, current) => ({ ...prev, [current.id]: current }),
        {}
      ) || null;

    const cards = dataTable.reduce((prev, current) => {
      if (selectColumn && !current[selectColumn.id].value) {
        prev.uncategorized = prev.uncategorized ? [...prev.uncategorized, current] : [current];
      }

      selectColumn?.options?.choices?.map((choice) => {
        if (current[selectColumn.id].value === choice.id) {
          prev[choice.id] = prev[choice.id] ? [...prev[choice.id], current] : [current];
        }
      });
      return prev;
    }, {});

    return {
      choiceOrder: ["uncategorized", ...choiceOrder],
      choices: {
        uncategorized: { id: "uncategorized", name: "Uncategorized", color: "#eee" },
        ...choices,
      },
      cards,
    };
  }, [selectColumn, dataTable]);

  useEffect(() => {
    if (Object.values(dataFormChild).length) {
      handleSubmit(dataFormChild);
    }
  }, [dataFormChild]);

  const handleSubmit = ({ files, column, row, cell }: FormInput) => {
    const newImage = [...(cell?.value || []), ...files];
    onChange(cell, column, row, listRecords)(newImage);
    closePopupChild();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    if (type === "column") {
      const newChoiceOrder = Array.from(board.choiceOrder);
      newChoiceOrder.splice(source.index, 1);
      newChoiceOrder.splice(destination.index, 0, draggableId);

      const newColumn: any = {
        ...selectColumn,
        options: {
          ...selectColumn?.options,
          choiceOrder: newChoiceOrder.filter((item) =>
            selectColumn?.options?.choices?.some((itemChoice) => itemChoice.id === item)
          ),
        },
      };

      onChangeColumn(newColumn);
      return;
    }

    const record = board.cards[source.droppableId][source.index];
    const cell = record[view.options?.fieldKanban || ""];

    selectColumn?.type && onChangeCell(
      {
        id: cell?.id || new ObjectID().toHexString(),
        field: view.options?.fieldKanban || "",
        record: record.id,
        table: detailTable?.id || "",
        cell: {
          type: BEFieldType[selectColumn?.type],
          value: destination.droppableId !== "uncategorized" ? destination.droppableId : "",
        },
      },
      listRecords
    );
  };

  const onChange =
    (cell: any, column: AirTableColumn, row: any, records: any[]) => (newValues: any) => {
      {
        onChangeCell(
          {
            id: cell?.id || new ObjectID().toHexString(),
            field: column.id,
            record: row.id,
            table: detailTable?.id || "",
            cell: {
              type: BEFieldType[column.type],
              value: newValues,
            },
          },
          records
        );
      }
    };

  const onChangeOptions =
    (id: any) => (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => {
      const index = columns.findIndex((col) => col.id === id);
      if (index !== -1 && columns?.[index]?.options?.choices) {
        (columns[index].options || { choices: [] }).choices = newValue.filter(
          (item) => item.id !== "uncategorized"
        );
        onChangeColumn(columns[index], optional);
      }
    };

  const onAddOption = (name: string) => {
    const newOptions = {
      id: new ObjectID().toHexString(),
      color: randomHSLA(),
      name,
    };
    if (selectColumn) {
      const newChoices = [...(selectColumn?.options?.choices || []), newOptions];
      const newChoiceOrder = [
        ...(selectColumn?.options?.choiceOrder || newChoices.map((item) => item.id)),
        newOptions.id,
      ];
      selectColumn.options = {
        choices: newChoices,
        choiceOrder: newChoiceOrder.filter((item) =>
          newChoices.some((itemChoice) => itemChoice.id === item)
        ),
      };
      onChangeColumn(selectColumn);
    }
  };

  const onOpenPopup = ({ cell, column, row }: { cell: any; column: AirTableColumn; row: any }) => {
    let funcContentSchema: any;
    let buttonTextPopup = "Upload";
    let defaultData = { files: [], cell, column, row };
    let title = "Attachment";
    let isShowFooter = true;
    let isDisabledSubmit = true;
    let maxWidthForm: GridSizeType = "md";

    let newContentRender = (methods: any) => {
      return <UploadAttachment {...methods} />;
    };

    funcContentSchema = (yup: any) => {
      return {
        files: yup.mixed(),
      };
    };

    setDataPopupChild({
      ...dataPopupChild,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isDisabledSubmit,
      isOpenPopup: true,
      title,
      defaultData,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const onAddRow = (choiceId?: string) => {
    const newRow = columns.reduce(
      (prev, current) => ({
        ...prev,
        [current.id]:
          current.type === AirTableColumnTypes.AUTO_NUMBER
            ? data.length + 1
            : DefaultData[current.type],
      }),
      {}
    );

    selectColumn?.type && onChangeRow(newRow, listRecords, {
      action: ({ newRecord, newRecords }: any) => {
        if (choiceId !== "uncategorized") {
          onChangeCell(
            {
              id: new ObjectID().toHexString(),
              field: view?.options?.fieldKanban || "",
              record: newRecord.id,
              table: detailTable?.id || "",
              cell: {
                type: BEFieldType[selectColumn?.type],
                value: choiceId !== "uncategorized" ? choiceId : "",
              },
            },
            newRecords,
            {
              action: () => {
                setRecordId(newRecord.id);
              },
            }
          );
        } else setRecordId(newRecord.id);
      },
    });
  };

  const sizeMap = useRef(0);

  const getSize = useCallback(() => {
    return sizeMap.current;
  }, []);

  const setSize = useCallback((size: number) => {
    sizeMap.current = (size && size > sizeMap.current) || 200 ? size : sizeMap.current || 200;
  }, []);

  const isMasterPermission = isReadAndWriteRole(user?.is_superuser, viewPermission);

  const Column = memo(({ data, index, style }: ListChildComponentProps) => {
    const item = data[index];
    if (!item) {
      return null;
    }

    return (
      <Draggable draggableId={item} index={index} isDragDisabled={index === 0}>
        {(provided, snapshot) => (
          <KanbanColumn
            provided={provided}
            isDragging={snapshot.isDragging}
            index={index}
            key={item}
            choice={board?.choices?.[item]}
            choices={board?.choices || []}
            cards={board?.cards}
            columns={columns}
            view={view}
            userOptions={userOptions}
            linkTables={linkTables}
            setFileReviewConfig={setFileReviewConfig}
            onOpenRecordForm={(row: any) => setRecordId(row.id)}
            onAddRow={() => onAddRow(item)}
            onChangeOptions={onChangeOptions(selectColumn?.id)}
            onOpenLinkRecordFormPopup={setLinkRecord}
            style={style}
          />
        )}
      </Draggable>
    );
  });

  return (
    <Paper
      title="Kanban"
      sx={{
        width: "100%",
        p: 2,
        border: `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
        height: "calc(100vh - 200px)",
        backgroundColor: `${alpha(theme.palette.grey[500], 0.1)}`,
      }}
    >
      <FormDialog
        open={Boolean(recordId)}
        onClose={() => setRecordId("")}
        maxWidth="lg"
        isShowFooter={false}
        title="Chi tiết bản ghi"
        enableCloseByDropClick
      >
        <Form
          view={view}
          columns={columns}
          row={data.find((item) => item.id === recordId)}
          records={listRecords}
          tableId={detailTable?.id || ""}
          linkTables={linkTables}
          viewPermission={viewPermission}
          setFileReviewConfig={setFileReviewConfig}
          onChange={onChange}
          onChangeOptions={onChangeOptions}
          onOpenAttachmentPopup={onOpenPopup}
          onOpenLinkRecordPopup={onOpenLinkRecordPopup}
          onOpenLinkRecordFormPopup={setLinkRecord}
        />
      </FormDialog>

      <FormDialog
        open={Boolean(linkRecord.recordId)}
        onClose={() =>
          setLinkRecord({
            recordId: undefined,
            tableId: undefined,
          })
        }
        maxWidth="lg"
        isShowFooter={false}
        title="Chi tiết bản ghi"
        enableCloseByDropClick
      >
        <LinkRecordForm
          tableId={linkRecord.tableId}
          recordId={linkRecord.recordId}
          linkTable={(linkRecord?.tableId && linkTables?.[linkRecord?.tableId]) || undefined}
          mainTable={detailTable as any}
          setLinkTable={(newLinkTable?: AirTableBase | undefined) => {
            newLinkTable && setLinkTables({ ...linkTables, [newLinkTable?.id]: newLinkTable });
          }}
        />
      </FormDialog>

      <AttachmentReviewer
        listFile={fileReviewConfig.files}
        currentIndex={fileReviewConfig.currentIndex}
        setCurrentIndex={(newCurrentIndex: number) => {
          setFileReviewConfig({
            ...fileReviewConfig,
            currentIndex: newCurrentIndex,
          });
        }}
        onDelete={(id: string) => {
          if (fileReviewConfig.cell) {
            onChangeCell(
              {
                ...fileReviewConfig.cell,
                cell: {
                  ...fileReviewConfig.cell.cell,
                  value:
                    fileReviewConfig.cell.cell.value?.filter((file: any) => file.id !== id) || [],
                },
              },
              listRecords,
              {
                action: () =>
                  setFileReviewConfig({
                    currentIndex: -1,
                    cell: undefined,
                    files: [],
                  }),
              }
            );
          }
        }}
      />
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
        <DropdownMultiSelect
          isShowHidden
          buttonIcon={<VisibilityOffIcon />}
          title="Hidden Fields"
          options={columns.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          values={view.visible_fields
            .filter((item) => item.visible)
            .map((item: any) => item.field_id)}
          setValues={(newVisibleColumns: string[]) => {
            onChangeView({
              ...view,
              visible_fields: view.visible_fields.map((field, fieldIndex) => ({
                ...field,
                visible: newVisibleColumns.includes(field.field_id),
              })),
            });
          }}
        />
      </Stack>
      <KanbanContext.Provider value={{ getSize, setSize }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => (
              <KanbanColumn
                provided={provided}
                isDragging={snapshot.isDragging}
                index={rubric.source.index}
                key={board?.choiceOrder[rubric.source.index]}
                choice={board?.choices?.[board?.choiceOrder[rubric.source.index]]}
                choices={board?.choices || []}
                cards={board?.cards}
                columns={columns}
                view={view}
                userOptions={userOptions}
                linkTables={linkTables}
                setFileReviewConfig={setFileReviewConfig}
                onOpenRecordForm={(row: any) => setRecordId(row.id)}
                onAddRow={() => onAddRow(board?.choiceOrder[rubric.source.index])}
                onChangeOptions={onChangeOptions(selectColumn?.id)}
                onOpenLinkRecordFormPopup={setLinkRecord}
              />
            )}
          >
            {(provided, snapshot) => {
              const itemCount = snapshot.isUsingPlaceholder
                ? board.choiceOrder?.length || 0 + 1
                : board.choiceOrder?.length || 1;
              return (
                <Stack
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  direction="row"
                  alignItems="flex-start"
                  spacing={3}
                  sx={{ height: "calc(100% - 32px)", overflowY: "hidden" }}
                >
                  {!board.choiceOrder || board.choiceOrder.length === 0 ? (
                    <SkeletonKanbanColumn />
                  ) : (
                    <FixedSizeList
                      height={window.innerHeight || 1000 - 32}
                      width={itemCount * 350}
                      itemSize={350}
                      itemCount={itemCount}
                      itemData={board.choiceOrder || []}
                      outerRef={provided.innerRef}
                      layout="horizontal"
                      style={{ overflow: "visible" }}
                    >
                      {Column}
                    </FixedSizeList>
                  )}

                  {provided.placeholder}
                  <KanbanColumnAdd onAddColumn={onAddOption} />
                </Stack>
              );
            }}
          </Droppable>
        </DragDropContext>
      </KanbanContext.Provider>
    </Paper>
  );
}

export default KanbanView;
