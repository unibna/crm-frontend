import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableOption,
  AirTableRow,
  AirTableView,
  LinkRecordProps,
  ROW_HEIGHT_TYPES,
} from "_types_/SkyTableType";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import React, { memo } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import { convertTableRecordToOptions } from "utils/skyTableUtil";
import {
  AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT,
  BEFieldType,
  DefaultData,
  OPTIONS_TYPES,
} from "views/AirtableV2/constants";

function GridCell({
  col,
  colIndex,
  value,
  selection,
  isEdit,
  records,
  column,
  row,
  dataTable,
  view,
  detailTable,
  viewPermission,
  userOptions,
  setFileReviewConfig,
  onOpenPopup,
  onChange,
  onOpenLinkRecordPopup,
  setLinkRecord,
  onChangeOptions,
}: {
  col: AirTableColumn;
  colIndex: number;
  value: { id: string; value: any };
  selection: [string | null, string | null];
  isEdit: boolean;
  records: AirTableRow[];
  column: AirTableColumn;
  row: any;
  dataTable: AirTableBase;
  view: AirTableView;
  detailTable?: AirTableBase | null;
  viewPermission?: ROLE_TYPE;
  userOptions: AirTableOption[];
  setLinkRecord: React.Dispatch<
    React.SetStateAction<{
      recordId: string | undefined;
      tableId: string | undefined;
    }>
  >;
  setFileReviewConfig: React.Dispatch<
    React.SetStateAction<{
      files: any[];
      currentIndex: number;
      cell?: AirTableCell | undefined;
    }>
  >;
  onOpenPopup: ({ cell, column, row }: { cell: any; column: AirTableColumn; row: any }) => void;
  onChange: (
    cell: any,
    column: AirTableColumn,
    row: any,
    records: any[]
  ) => (newValues: any) => void;
  onOpenLinkRecordPopup: (props: LinkRecordProps) => void;
  onChangeOptions: (id: any) => (
    newValue: AirTableOption[],
    optional?: {
      actionSuccess: () => void;
    }
  ) => void;
}) {
  const { user } = useAuth();

  const { ATTACHMENT, MULTIPLE_USER, LINK_TO_RECORD, SINGLE_USER, AUTO_NUMBER, CHECKBOX } =
    AirTableColumnTypes;

  const [rowIdSl, colIdSl] = selection;

  const isMatch = rowIdSl == row.id && colIdSl === column.id;

  const id = `[${row.id}-${column.id}]`;

  const cell = value;

  const cellValue = cell?.value || DefaultData[col.type];

  const renderFunc =
    isReadAndWriteRole(user?.is_superuser, viewPermission) &&
    (col.type === CHECKBOX || (isEdit && isMatch))
      ? AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[col.type]?.editFunc
      : AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[col.type]?.renderFunc;

  const choices =
    col.type === SINGLE_USER || col.type === MULTIPLE_USER
      ? userOptions
      : col.type === LINK_TO_RECORD
      ? convertTableRecordToOptions(dataTable, col.options?.recordDisplay, userOptions)
      : col?.options?.choices;

  const onToggleUpload = () => onOpenPopup({ cell, column, row });

  const onChangeFileReviewConfig = (config: { files: any[]; currentIndex: number }) =>
    setFileReviewConfig({
      cell: {
        id: cell.id,
        table: detailTable?.id || "",
        field: column.id,
        record: row.id,
        cell: {
          type: BEFieldType[column.type],
          value: cellValue,
        },
      },
      ...config,
    });

  if (col.type === AirTableColumnTypes.CHECKBOX) {
    return renderFunc(cellValue, onChange(cell, column, row, records));
  }

  // Render Cell To Edit
  if (isEdit && isMatch && isReadAndWriteRole(user?.is_superuser, viewPermission)) {
    if (col.type === AirTableColumnTypes.LINK_TO_RECORD) {
      return renderFunc(
        choices,
        cellValue,
        onChange(cell, column, row, records),
        () => onOpenLinkRecordPopup({ dataTable, cell, column, row, records, onChange }),
        (recordId: string) =>
          setLinkRecord({
            recordId,
            tableId: col.options?.tableLinkToRecordId,
          })
      );
    }

    if (OPTIONS_TYPES.includes(col.type))
      return renderFunc(
        choices,
        cellValue,
        onChange(cell, column, row, records),
        onChangeOptions(col.id),
        id
      );

    if (col.type === AirTableColumnTypes.ATTACHMENT) {
      return renderFunc(
        cellValue,
        onChange(cell, column, row, records),
        onToggleUpload,
        onChangeFileReviewConfig,
        false,
        {
          stack: {
            alignItems: "center",
            height: "100%",
          },
          image: {
            height: "100%",
          },
        }
      );
    }

    return renderFunc(cellValue, onChange(cell, column, row, records));
  }

  // Render Cell To View
  if (!cellValue || cellValue.length === 0) return null;

  if (col.type === LINK_TO_RECORD)
    return renderFunc(choices, cellValue, (recordId: string) =>
      setLinkRecord({
        recordId,
        tableId: col.options?.tableLinkToRecordId,
      })
    );

  if (OPTIONS_TYPES.includes(col.type)) return renderFunc(choices, cellValue);

  if (col.type === ATTACHMENT)
    return renderFunc(cellValue, onChangeFileReviewConfig, false, {
      stack: {
        alignItems: "center",
        height: "100%",
      },
      image: {
        height: "100%",
      },
    });

  const textLinkStyles = {
    whiteSpace: "break-spaces",
    WebkitBoxOrient: "vertical",
    display: "-webkit-box",
  };

  return renderFunc(cellValue, {
    ...(col.type === AUTO_NUMBER &&
      colIndex === 0 && {
        textlink: {
          justifyContent: "flex-end",
        },
      }),
    ...(view.options?.rowHeight &&
      view.options?.rowHeight !== ROW_HEIGHT_TYPES.SHORT && {
        textlink: {
          ...textLinkStyles,
          WebkitLineClamp: {
            [ROW_HEIGHT_TYPES.MEDIUM]: 3,
            [ROW_HEIGHT_TYPES.TALL]: 6,
            [ROW_HEIGHT_TYPES.EXTRA_TALL]: 9,
          } ?? [view.options?.rowHeight],
        },
      }),
  });
}

export default memo(GridCell);
