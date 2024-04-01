import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableField,
  AirTableFieldConfig,
  AirTableRow,
  AirTableView,
  InsertColumnProps,
  InsertRowProps,
} from "_types_/SkyTableType";
import ObjectID from "bson-objectid";
import { BEFieldType, DefaultData } from "../constants";

export const convertArrayFieldToObject = ({
  fieldConfigs,
  fields,
}: {
  fieldConfigs?: AirTableFieldConfig[];
  fields?: AirTableField[];
}) => {
  let newFieldConfigs = fieldConfigs && Array.isArray(fieldConfigs) ? [...fieldConfigs] : [];
  fields?.map((field) => {
    const isExisted = newFieldConfigs.find((item) => item.field_id === field.id);
    if (!isExisted) {
      newFieldConfigs = [
        ...newFieldConfigs,
        {
          field_configs: null,
          field_id: field.id,
          visible: true,
          width: 150,
        },
      ];
    }
  });

  newFieldConfigs = newFieldConfigs.filter((item) =>
    fields?.find((field) => field.id === item.field_id)
  );
  return (
    newFieldConfigs?.reduce(
      (prev: { [key: string]: AirTableFieldConfig }, current: AirTableFieldConfig) => ({
        ...prev,
        [current.field_id]: current,
      }),
      {}
    ) || {}
  );
};

export const convertFieldsToColumns = ({
  fieldConfigsObject,
  fields,
  linkTables,
  getLinkTable,
}: {
  fieldConfigsObject: {
    [key: string]: AirTableFieldConfig;
  };
  fields?: AirTableField[];
  linkTables: React.MutableRefObject<{
    [key: string]: AirTableBase;
  }>;
  getLinkTable: (id: string) => Promise<void>;
}) => {
  let tempCols = [];
  tempCols =
    (fieldConfigsObject &&
      fields?.map((field: any) => {
        if (
          field.type === BEFieldType[AirTableColumnTypes.LINK_TO_RECORD] &&
          field.options?.tableLinkToRecordId &&
          !linkTables.current?.[field.options?.tableLinkToRecordId]
        ) {
          getLinkTable(field.options?.tableLinkToRecordId);
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
          width: fieldConfigsObject[field.id]?.width || 200,
        };
      })) ||
    [];
  return tempCols;
};

export const convertRecordsToData = ({
  listRecords,
  columns,
}: {
  listRecords: AirTableRow[];
  columns: AirTableColumn[];
}) => {
  const list =
    listRecords?.map(
      (record: {
        id: string;
        fields: {
          field: string;
          value: any;
          id?: string;
        }[];
      }) =>
        columns.reduce((prev: any, column: AirTableColumn) => {
          const cell = record?.fields?.find((field: any) => field?.field === column.id);
          return {
            ...prev,
            [column.id]: {
              id: cell?.id,
              value: cell?.value || DefaultData[column.type],
            },
            id: record.id,
          };
        }, {})
    ) || [];
  return list;
};

export const handleNewField =
  ({
    detailTable,
    viewIndex,
    newField,
    optional,
    listRecords,
    column,
    updateCells,
    getTable,
    onChangeView,
  }: {
    detailTable: AirTableBase | null | undefined;
    viewIndex: number;
    newField: AirTableField;
    optional?: {
      insertColumn: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    };
    listRecords: AirTableRow[];
    column: AirTableColumn;
    updateCells: (data: any, action?: ((newData: any) => any) | undefined) => Promise<void>;
    getTable: (id: string) => Promise<void>;
    onChangeView: (
      newView: AirTableView,
      optional?:
        | {
            action?: ((result: any) => void) | undefined;
            fields?: any[] | undefined;
            records?: AirTableRow[] | undefined;
          }
        | undefined
    ) => void;
  }) =>
  (result: any) => {
    const indexField = detailTable?.fields?.findIndex((field: any) => field.id === result.id) || 0;

    let newFields = [...(detailTable?.fields || [])];

    let newFieldConfigs: AirTableFieldConfig[] = detailTable?.views[viewIndex].visible_fields || [];

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
                table: detailTable?.id || "",
                cell: {
                  type: BEFieldType[column.type],
                  value:
                    record.fields.find((item) => item.field === column.id)?.value ||
                    DefaultData[column.type],
                },
              }));

              updateCells(cells, () => {
                getTable(detailTable?.id || "");
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
          table: detailTable?.id,
          cell: {
            type: newField.type,
            value: recordIndex + 1,
          },
        }));

        updateCells(cells, () => {
          getTable(detailTable?.id || "");
        });
      }
    } else {
      newFields[indexField] = newField;
    }

    detailTable &&
      onChangeView(
        {
          ...detailTable?.views[viewIndex],
          visible_fields: newFieldConfigs,
        },
        {
          fields: newFields,
        }
      );

    optional?.actionSuccess && optional.actionSuccess();
  };

export const handleNewRecord =
  ({
    records,
    newRecord,
    optional,
    updateData,
  }: {
    records: AirTableRow[];
    newRecord: AirTableRow;
    optional?: { insertRow: InsertRowProps; action?: (result?: any) => void };
    updateData: (payload: any) => void;
  }) =>
  (result: any) => {
    const indexRecord = records.findIndex((record: any) => record.id === result.id);

    let newRecords = [...records];

    newRecord = {
      ...newRecord,
      id: result.id,
      fields: result.cells,
    };

    if (indexRecord === -1) {
      newRecords = [...newRecords, newRecord];
    } else {
      newRecords[indexRecord] = newRecord;
    }

    updateData({
      listRecords: newRecords,
    });

    optional?.action && optional?.action({ newRecord, newRecords });
  };

export const handleNewView =
  ({
    detailTable,
    newView,
    optional,
    updateData,
    setViewWaitIndex,
  }: {
    detailTable: AirTableBase | null | undefined;
    newView: AirTableView;
    optional?: { action?: (result: any) => void; fields?: any[]; records?: AirTableRow[] };
    updateData: (payload: any) => void;
    setViewWaitIndex: (value: React.SetStateAction<number>) => void;
  }) =>
  (result: any) => {
    const indexView =
      detailTable?.views?.findIndex((view: AirTableView) => view.id === newView.id) || 0;

    let newViews = [...(detailTable?.views || [])];

    newView = {
      ...newView,
      id: result.id,
    };

    if (indexView === -1) {
      newViews = [...newViews, newView];
      setViewWaitIndex(newViews.length - 1);
    } else {
      newViews[indexView] = newView;
    }

    updateData({
      detailTable: {
        ...detailTable,
        views: newViews,
        ...(optional?.fields && {
          fields: optional?.fields,
        }),
      },
      ...(optional?.records && {
        listRecords: optional?.records,
      }),
    });

    optional?.action && optional?.action(result);
  };

export const handleNewCell =
  ({
    records,
    cell,
    optional,
    updateData,
  }: {
    records: AirTableRow[];
    cell: AirTableCell;
    optional?: { action?: (result?: any) => void };
    updateData: (payload: any) => void;
  }) =>
  (result: any) => {
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

      updateData({
        listRecords: [...records],
      });
    }

    optional?.action && optional?.action(result);
  };

export const handleDeleteCell =
  ({
    records,
    cell,
    optional,
    updateData,
  }: {
    records: AirTableRow[];
    cell: AirTableCell;
    optional?: { action?: (result?: any) => void };
    updateData: (payload: any) => void;
  }) =>
  (result: any) => {
    const indexRecord = records.findIndex((record: any) => record.id === result.record);
    if (indexRecord !== -1) {
      records[indexRecord].fields = records[indexRecord].fields.filter(
        (item: any) => item.id !== cell.id
      );
      updateData({
        listRecords: [...records],
      });
    }

    optional?.action && optional?.action(result);
  };

export const handleMultiNewCell =
  ({
    records,
    optional,
    updateData,
  }: {
    records: AirTableRow[];
    optional?: { action?: (result?: any) => void };
    updateData: (payload: any) => void;
  }) =>
  (result: AirTableCell[]) => {
    result.map((cell) => {
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
      }
    });

    updateData({
      listRecords: [...records],
    });

    optional?.action && optional?.action(result);
  };

export const handleMultiDeleteCell =
  ({ records, updateData }: { records: AirTableRow[]; updateData: (payload: any) => void }) =>
  (result: AirTableCell) => {
    const indexRecord = records.findIndex((record: any) => record.id === result.record);
    if (indexRecord !== -1) {
      records[indexRecord].fields = records[indexRecord].fields.filter(
        (item: any) => item.id !== result.id
      );
    }

    updateData({
      listRecords: [...records],
    });
  };

export const handleDeleteField =
  ({
    id,
    detailTable,
    viewIndex,
    onChangeView,
  }: {
    id: AirTableColumn["id"];
    detailTable: AirTableBase | null | undefined;
    viewIndex: number;
    onChangeView: (
      newView: AirTableView,
      optional?:
        | {
            action?: ((result: any) => void) | undefined;
            fields?: any[] | undefined;
            records?: AirTableRow[] | undefined;
          }
        | undefined
    ) => void;
  }) =>
  (_: any) => {
    const fields = detailTable?.fields?.filter((field: AirTableField) => field.id !== id);

    const visible_fields =
      detailTable?.views[viewIndex]?.visible_fields?.filter((field) => field.field_id !== id) || [];

    detailTable &&
      onChangeView(
        {
          ...detailTable?.views[viewIndex],
          visible_fields,
        },
        {
          fields,
        }
      );
  };
