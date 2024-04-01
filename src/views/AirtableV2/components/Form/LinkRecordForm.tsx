import ObjectID from "bson-objectid";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { skycomtableApi } from "_apis_/skycomtable.api";

import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

import { GridSizeType } from "_types_/GridLayoutType";
import { ROLE_OPTION, ROLE_TAB, STATUS_ROLE_SKYCOM_TABLE } from "constants/rolesTab";

import { Grid, LinearProgress, Stack, Typography } from "@mui/material";

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
  LinkRecordProps,
} from "_types_/SkyTableType";
import FormDialog from "components/Dialogs/FormDialog";
import { MTextLine } from "components/Labels";
import { FormInput } from "components/Popups/FormPopup";
import { convertColumnToField, convertTableRecordToOptions } from "utils/skyTableUtil";
import {
  AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT,
  AirTableColumnIcons,
  BEFieldType,
  DefaultData,
  OPTIONS_TYPES,
} from "views/AirtableV2/constants";
import AttachmentReviewer from "../AttachmentReviewer";
import MenuRecord from "../MenuRecord";
import UploadAttachment from "../UploadAttachment";
import { isReadAndWriteRole } from "utils/roleUtils";

type Props = {
  tableId?: string;
  linkTable?: AirTableBase;
  mainTable?: AirTableBase;
  recordId?: string;
  setLinkTable: (newLinkTable?: AirTableBase) => void;
};

function LinkRecordForm(props: Props) {
  const { tableId, linkTable, mainTable, recordId, setLinkTable } = props;

  const [tableDataById, setTableDataById] = useState<AirTableBase>();
  const [listRecords, setListRecords] = useState<
    {
      id: string;
      fields: any;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [fileReviewConfig, setFileReviewConfig] = useState<{
    files: any[];
    currentIndex: number;
    cell?: AirTableCell;
  }>({
    files: [],
    currentIndex: -1,
    cell: undefined,
  });
  const [linkRecord, setLinkRecord] = useState<{
    recordId: string | undefined;
    tableId: string | undefined;
  }>({
    recordId: "",
    tableId: "",
  });

  const linkTables = useRef<{ [key: string]: AirTableBase }>({});

  const { dataPopupChild, setDataPopupChild, dataFormChild, closePopupChild } = usePopup();

  const { newCancelToken } = useCancelToken();

  const { user } = useAuth();

  const permission = user?.group_permission?.data?.[ROLE_TAB.SKYCOM_TABLE];

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

  const viewPermission = useMemo(() => {
    return isReadAndWriteRole(user?.is_superuser, permission?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE])
      ? ROLE_OPTION.READ_AND_WRITE
      : tableDataById?.options?.permission?.[user?.id || ""];
  }, [tableDataById?.options?.permission, permission]);

  const handleSubmit = ({ files, column, row, cell }: FormInput) => {
    const newImage = [...(cell?.value || []), ...files];
    tableDataById && onChange(tableDataById)(cell, column, row, listRecords)(newImage);
    closePopupChild();
  };

  const getTable = async (id: string) => {
    setLoading(true);
    const result = await skycomtableApi.getId(
      {
        id,
        cancelToken: newCancelToken(),
      },
      `table/`
    );

    if (result && result.data) {
      setTableDataById(result.data);
      setLinkTable(result.data);

      setListRecords(
        Object.keys(result.data.records).map((recordId: string) => ({
          id: recordId,
          fields: result.data.records[recordId],
        })) || []
      );
    }
    setLoading(false);
  };

  const getLinkTable = async (id: string) => {
    const result = await skycomtableApi.getId(
      {
        id,
        cancelToken: newCancelToken(),
      },
      `table/`
    );

    if (result && result.data) {
      linkTables.current[result.data.id] = result.data;
    }
  };

  const updateField = async (field: any, action?: (newData: any) => any) => {
    setLoading(true);
    const result = await skycomtableApi.update(
      {
        ...field,
      },
      `table/${tableDataById?.id}/fields/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    setLoading(false);
  };

  const updateView = async (view: any, action?: (newData: any) => any) => {
    setLoading(true);
    const result = await skycomtableApi.update(
      {
        ...view,
      },
      `table/${tableDataById?.id}/views/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    setLoading(false);
  };

  const updateCells = async (data: any, action?: (newData: any) => any) => {
    setLoading(true);
    const result = await skycomtableApi.update({ cells: data }, `table/cells/`);

    if (result && result.data) {
      action && action(result.data);
    }
    setLoading(false);
  };

  const deleteCell = async (id: AirTableCell["id"], action?: (newData: any) => any) => {
    setLoading(true);
    const result = await skycomtableApi.remove(
      {
        id,
      },
      `table/cells/`
    );

    if (result && result.data) {
      action && action(result.data);
    }
    setLoading(false);
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

  const onOpenLinkRecordPopup = (props: LinkRecordProps) => {
    const { dataTable, cell, column, row, records, onChange } = props;
    let title = dataTable?.name;
    let isShowFooter = false;
    let maxWidthForm: GridSizeType = "lg";

    let newContentRender = () => {
      return (
        <MenuRecord
          dataTable={dataTable}
          recordIds={cell?.value?.map((item) => item.record_id) || []}
          recordDisplay={column?.options?.recordDisplay || ""}
          onChange={onChange(cell, column, row, records)}
          onClose={closePopupChild}
        />
      );
    };

    setDataPopupChild({
      ...dataPopupChild,
      maxWidthForm,
      isOpenPopup: true,
      title,
      isShowFooter,
      funcContentRender: newContentRender,
    });
  };

  const onChangeCell = (
    cell: AirTableCell,
    records: {
      id: string;
      fields: any;
    }[],
    optional?: { action?: (result?: any) => void }
  ) => {
    const handleNewCell = (result: any) => {
      const indexRecord = records.findIndex((record: any) => record.id === cell.record);
      if (indexRecord !== -1) {
        const indexCell = records[indexRecord].fields?.findIndex(
          (item: { field: string; id: string; value: any }) => item.field === cell.field
        );

        const newCell = {
          id: cell.id,
          field: cell.field,
          value: cell.cell.value,
        };
        if (indexCell !== -1) {
          records[indexRecord].fields[indexCell] = newCell;
        } else {
          records[indexRecord].fields = [...records[indexRecord].fields, newCell];
        }

        setListRecords([...records]);
        setLinkTable({
          ...tableDataById,
          records: records.reduce(
            (prev, current) => ({
              ...prev,
              [current.id]: current.fields,
            }),
            {}
          ),
        } as any);
      }

      optional?.action && optional?.action(result);
    };
    cell.cell.value ? updateCells([cell], handleNewCell) : deleteCell(cell.id, handleNewCell);
  };

  const onChangeView = (
    newView: AirTableView,
    optional?: { action?: (result: any) => void; fields?: any[]; records?: AirTableRow[] }
  ) => {
    const handleNewView = (result: any) => {
      const indexView =
        tableDataById?.views?.findIndex((view: AirTableView) => view.id === newView.id) || 0;

      let newViews = [...(tableDataById?.views || [])];

      newView = {
        ...newView,
        id: result.id,
      };

      if (indexView === -1) {
        newViews = [...newViews, newView];
      } else {
        newViews[indexView] = newView;
      }

      const newTableDataById = {
        ...tableDataById,
        views: newViews,
        ...(optional?.fields && {
          fields: optional?.fields,
        }),
      } as any;
      setTableDataById(newTableDataById);
      setLinkTable(newTableDataById);

      optional?.records && setListRecords(optional?.records);

      optional?.action && optional?.action(result);
    };

    updateView(
      {
        ...newView,
        id: newView.id,
      },
      handleNewView
    );
  };

  const onChangeColumn = (
    column: AirTableColumn,
    optional?: {
      insertColumn?: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => {
    let newField: any = convertColumnToField(column);

    const handleNewField = (result: any) => {
      const indexField =
        tableDataById?.fields?.findIndex((field: any) => field.id === result.id) || 0;

      let newFields = [...(tableDataById?.fields || [])];

      let newFieldConfigs: AirTableFieldConfig[] = tableDataById?.views[0]?.visible_fields || [];

      const newFieldConfig = {
        field_id: result.id,
        width: 200,
        visible: true,
        field_configs: null,
      };

      newField = {
        ...newField,
        id: result.id,
      };

      if (indexField === -1) {
        newFields = [...newFields, newField];
        if (optional?.insertColumn) {
          const { direction } = optional.insertColumn;

          const columnIndex = newFieldConfigs.findIndex(
            (field) => field.field_id === optional.insertColumn?.column.id
          );

          if (columnIndex >= 0) {
            if (direction === "left") {
              newFieldConfigs = [
                ...newFieldConfigs.slice(0, columnIndex),
                newFieldConfig,
                ...newFieldConfigs.slice(columnIndex, newFieldConfigs.length),
              ];
            } else {
              newFieldConfigs = [
                ...newFieldConfigs.slice(0, columnIndex + 1),
                newFieldConfig,
                ...newFieldConfigs.slice(columnIndex + 1, newFieldConfigs.length),
              ];

              if (optional.insertColumn?.duplicateData) {
                const cells = listRecords.map((record: AirTableRow) => ({
                  id: new ObjectID().toHexString(),
                  field: result.id,
                  record: record.id,
                  table: tableDataById?.id || "",
                  cell: {
                    type: BEFieldType[column.type],
                    value:
                      record.fields.find((item) => item.field === column.id)?.value ||
                      DefaultData[column.type],
                  },
                }));

                updateCells(cells, () => {
                  getTable(tableDataById?.id || "");
                });
              }
            }
          }
        } else {
          newFieldConfigs = [...newFieldConfigs, newFieldConfig];
        }

        if (column.type === AirTableColumnTypes.AUTO_NUMBER) {
          const cells = listRecords.map((record: AirTableRow, recordIndex: number) => ({
            id: new ObjectID().toHexString(),
            field: result.id,
            record: record.id,
            table: tableDataById?.id,
            cell: {
              type: newField.type,
              value: recordIndex + 1,
            },
          }));

          updateCells(cells, () => {
            getTable(tableDataById?.id || "");
          });
        }
      } else {
        newFields[indexField] = newField;
      }

      tableDataById &&
        onChangeView(
          {
            ...tableDataById?.views[0],
            visible_fields: newFieldConfigs,
          },
          {
            fields: newFields,
          }
        );

      optional?.actionSuccess && optional.actionSuccess();
    };

    updateField(
      {
        ...newField,
        id: newField.id,
      },
      handleNewField
    );
    optional?.action && optional.action();
  };

  const onChange =
    (table: AirTableBase) =>
    (
      cell: any,
      column: AirTableColumn,
      row: any,
      records: {
        id: string;
        fields: any;
      }[]
    ) =>
    (newValues: any) => {
      onChangeCell(
        {
          id: cell?.id || new ObjectID().toHexString(),
          field: column.id,
          record: row.id,
          table: table?.id || "",
          cell: {
            type: BEFieldType[column.type],
            value: newValues,
          },
        },
        records
      );
    };

  const onChangeOptions =
    (id: any) => (newValue: AirTableOption[], optional?: { actionSuccess: () => void }) => {
      const index = columns.findIndex((col) => col.id === id);
      if (index !== -1 && columns?.[index]?.options?.choices) {
        (columns[index].options || { choices: [] }).choices = newValue;
        onChangeColumn(columns[index], optional);
      }
    };

  const handleDeleteAttachment = (id: string) => {
    if (fileReviewConfig.cell) {
      onChangeCell(
        {
          ...fileReviewConfig.cell,
          cell: {
            ...fileReviewConfig.cell.cell,
            value: fileReviewConfig.cell.cell.value?.filter((file: any) => file.id !== id) || [],
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
  };

  const handleChangeCurrentIndex = (newCurrentIndex: number) => {
    setFileReviewConfig({
      ...fileReviewConfig,
      currentIndex: newCurrentIndex,
    });
  };

  useEffect(() => {
    if (recordId && linkTable && linkTable.id === tableId) {
      setTableDataById(linkTable);
      linkTable.records &&
        setListRecords(
          Object.keys(linkTable.records).map((recordId: string) => ({
            id: recordId,
            fields: linkTable.records?.[recordId],
          })) || []
        );
    } else {
      recordId && tableId && getTable(tableId);
    }
  }, [recordId]);

  useEffect(() => {
    if (Object.values(dataFormChild).length) {
      handleSubmit(dataFormChild);
    }
  }, [dataFormChild]);

  const columns: AirTableColumn[] = useMemo(() => {
    let tempCols = [];
    tempCols =
      tableDataById?.fields?.map((field: any) => {
        if (
          field.type === BEFieldType[AirTableColumnTypes.LINK_TO_RECORD] &&
          field.options?.tableLinkToRecordId &&
          !linkTables.current?.[field.options?.tableLinkToRecordId]
        ) {
          if (mainTable && field.options?.tableLinkToRecordId === mainTable?.id) {
            linkTables.current[field.options.tableLinkToRecordId] = mainTable;
          } else {
            getLinkTable(field.options?.tableLinkToRecordId);
          }
        }
        return {
          id: field.id,
          name: field.name,
          type:
            field?.options?.feType ||
            Object.keys(BEFieldType).find((item: AirTableColumnTypes) => BEFieldType[item] === field.type) ||
            AirTableColumnTypes.SINGLE_LINE_TEXT,
          options: {
            ...field.options,
            choices:
              (field?.options?.choices && Object.values(field?.options?.choices)) || undefined,
            choiceOrder: field?.options?.choiceOrder,
          },
          width: 100,
        };
      }) || [];
    return tempCols;
  }, [tableDataById?.fields]);

  const row = useMemo(() => {
    let record = (recordId && listRecords?.find((item) => item.id === recordId)) || undefined;
    if (!record) return undefined;
    return columns.reduce((prev: any, current: AirTableColumn) => {
      const cell = record?.fields?.find((field: any) => field?.field === current.id);
      return {
        ...prev,
        [current.id]: {
          id: cell?.id,
          value: cell?.value || DefaultData[current.type],
        },
        id: recordId,
      };
    }, {});
  }, [listRecords, recordId]);

  return (
    <>
      {loading && <LinearProgress />}
      <FormDialog
        open={Boolean(linkRecord.recordId)}
        onClose={() =>
          setLinkRecord({
            recordId: undefined,
            tableId: undefined,
          })
        }
        maxWidth="md"
        isShowFooter={false}
        title="Chi tiết bản ghi"
      >
        <LinkRecordForm
          tableId={linkRecord.tableId}
          recordId={linkRecord.recordId}
          linkTable={linkRecord?.tableId ? linkTables?.[linkRecord?.tableId as keyof typeof linkTables] as unknown as AirTableBase : undefined}
          mainTable={tableDataById as any}
          setLinkTable={(newLinkTable?: AirTableBase | undefined) => {
            if (newLinkTable) {
              linkTables.current[newLinkTable.id] = newLinkTable;
            }
          }}
        />
      </FormDialog>
      <Grid container spacing={1}>
        <AttachmentReviewer
          listFile={fileReviewConfig.files}
          currentIndex={fileReviewConfig.currentIndex}
          setCurrentIndex={handleChangeCurrentIndex}
          onDelete={handleDeleteAttachment}
        />
        <Grid item xs={12}>
          <Stack direction="column" spacing={2}>
            {tableDataById?.views?.[0]?.visible_fields?.map((field) => {
              if (!field.visible) return <React.Fragment key={field.field_id}></React.Fragment>;

              const column: AirTableColumn | undefined = columns.find(
                (col) => col.id === field.field_id
              );

              if (!column) return <React.Fragment key={field.field_id}></React.Fragment>;

              const idSelect = `select[${row?.id}-${column?.id}]`;

              const cell = row?.[field.field_id];

              const cellValue = cell?.value || DefaultData[column.type];

              const renderFunc = isReadAndWriteRole(user?.is_superuser, viewPermission)
                ? AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.editFunc
                : AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.renderFunc;

              const isOriginal = true;

              const dataTable =
                (column?.options?.tableLinkToRecordId &&
                  linkTables[column?.options?.tableLinkToRecordId as keyof typeof linkTables]) as unknown as AirTableBase ||
                undefined;

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

              const onToggleUpload = () => onOpenPopup({ cell, column, row });

              const onChangeFileReviewConfig = (config: { files: any[]; currentIndex: number }) =>
                setFileReviewConfig({
                  cell: {
                    id: cell.id,
                    table: tableDataById.id,
                    field: column.id,
                    record: row?.id,
                    cell: {
                      type: BEFieldType[column.type],
                      value: cellValue,
                    },
                  },
                  ...config,
                });

              const renderValue = () => {
                if (isReadAndWriteRole(user?.is_superuser, viewPermission)) {
                  if (column.type === AirTableColumnTypes.LINK_TO_RECORD) {
                    return renderFunc(
                      choices,
                      cellValue,
                      onChange(tableDataById)(cell, column, row, listRecords),
                      () =>
                        onOpenLinkRecordPopup({
                          dataTable,
                          cell,
                          column,
                          row,
                          records: listRecords,
                          onChange: onChange(tableDataById),
                        }),
                      (recordId: string) =>
                        setLinkRecord({
                          recordId,
                          tableId: column.options?.tableLinkToRecordId,
                        }),
                      isOriginal,
                      { stack: { flexWrap: "wrap", gap: "4px", alignItems: "center" } }
                    );
                  }

                  if (OPTIONS_TYPES.includes(column.type))
                    return renderFunc(
                      choices,
                      cellValue,
                      onChange(tableDataById)(cell, column, row, listRecords),
                      onChangeOptions(column.id),
                      idSelect,
                      isOriginal
                    );

                  if (column.type === AirTableColumnTypes.ATTACHMENT) {
                    return renderFunc(
                      cellValue,
                      onChange(tableDataById)(cell, column, row, listRecords),
                      onToggleUpload,
                      onChangeFileReviewConfig,
                      isOriginal,
                      { stack: { flexWrap: "wrap", gap: "4px", alignItems: "center" } }
                    );
                  }

                  return renderFunc(
                    cellValue,
                    onChange(tableDataById)(cell, column, row, listRecords),
                    isOriginal
                  );
                }

                if (!cellValue || cellValue.length === 0) return null;

                if (column.type === AirTableColumnTypes.LINK_TO_RECORD)
                  return renderFunc(
                    choices,
                    cellValue,
                    setLinkRecord({
                      recordId,
                      tableId: column.options?.tableLinkToRecordId,
                    })
                  );

                if (OPTIONS_TYPES.includes(column.type)) return renderFunc(choices, cellValue);

                if (column.type === AirTableColumnTypes.ATTACHMENT)
                  return renderFunc(cellValue, onChangeFileReviewConfig, isOriginal);

                return renderFunc(cellValue);
              };

              return (
                <MTextLine
                  key={field.field_id}
                  displayType="grid"
                  label={
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: "24px",
                        },
                      }}
                    >
                      {AirTableColumnIcons[column.type]}
                      <Typography fontSize={"medium"} fontWeight="600">
                        {column.name}
                      </Typography>
                    </Stack>
                  }
                  value={renderValue()}
                />
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default LinkRecordForm;
