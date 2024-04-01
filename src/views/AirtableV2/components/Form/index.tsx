import { Grid, Stack, Typography } from "@mui/material";
import {
  AirTableBase,
  AirTableCell,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableOption,
  AirTableView,
  LinkRecordProps,
} from "_types_/SkyTableType";
import { MTextLine } from "components/Labels";
import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import React, { useMemo } from "react";
import { isReadAndWriteRole } from "utils/roleUtils";
import { convertTableRecordToOptions } from "utils/skyTableUtil";
import {
  AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT,
  AirTableColumnIcons,
  BEFieldType,
  DefaultData,
  OPTIONS_TYPES,
} from "views/AirtableV2/constants";

export type FormProps = {
  tableId: string;
  columns: AirTableColumn[];
  view: AirTableView;
  row: any;
  records: any[];
  viewPermission?: ROLE_TYPE;
  linkTables: { [key: string]: AirTableBase };
  setFileReviewConfig: React.Dispatch<
    React.SetStateAction<{
      files: any[];
      currentIndex: number;
      cell?: AirTableCell;
    }>
  >;
  onChange: (
    cell: any,
    column: AirTableColumn,
    row: any,
    records: any[]
  ) => (newValues: any) => void;
  onChangeOptions: (id: any) => (newValue: any) => void;
  onOpenAttachmentPopup: ({ cell, column, row }: any) => void;
  onOpenLinkRecordPopup: (props: LinkRecordProps) => void;
  onOpenLinkRecordFormPopup: React.Dispatch<
    React.SetStateAction<{
      recordId: string | undefined;
      tableId: string | undefined;
    }>
  >;
};

function Form({
  tableId,
  view,
  columns,
  row,
  records,
  viewPermission,
  linkTables,
  setFileReviewConfig,
  onChange,
  onChangeOptions,
  onOpenAttachmentPopup,
  onOpenLinkRecordPopup,
  onOpenLinkRecordFormPopup,
}: FormProps) {
  const { user } = useAuth();
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

  if (!row) return null;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Stack direction="column" spacing={2} sx={{ pr: 3 }}>
          {view?.visible_fields?.map((field) => {
            if (!field.visible) return <React.Fragment key={field.field_id}></React.Fragment>;

            const column: AirTableColumn | undefined = columns.find(
              (col) => col.id === field.field_id
            );

            if (!column) return <React.Fragment key={field.field_id}></React.Fragment>;

            const idSelect = `select[${row.id}-${column.id}]`;

            const cell = row[field.field_id];

            const cellValue = cell?.value || DefaultData[column.type];

            const renderFunc = isReadAndWriteRole(user?.is_superuser, viewPermission)
              ? AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.editFunc
              : AIRTABLE_COLUMN_TYPE_CONFIG_OBJECT[column.type]?.renderFunc;

            const isOriginal = true;

            const dataTable =
              (column?.options?.tableLinkToRecordId &&
                linkTables[column?.options?.tableLinkToRecordId]) ||
              undefined;

            const choices =
              column.type === AirTableColumnTypes.SINGLE_USER ||
              column.type === AirTableColumnTypes.MULTIPLE_USER
                ? userOptions
                : column.type === AirTableColumnTypes.LINK_TO_RECORD
                ? convertTableRecordToOptions(dataTable, column.options?.recordDisplay, userOptions)
                : column?.options?.choices;

            const onToggleUpload = () => onOpenAttachmentPopup({ cell, column, row });

            const onChangeFileReviewConfig = (config: { files: any[]; currentIndex: number }) =>
              setFileReviewConfig({
                cell: {
                  id: cell.id,
                  table: tableId,
                  field: column.id,
                  record: row.id,
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
                    onChange(cell, column, row, records),
                    () =>
                      onOpenLinkRecordPopup({ dataTable, cell, column, row, records, onChange }),
                    (recordId: string) =>
                      onOpenLinkRecordFormPopup({
                        recordId,
                        tableId: column?.options?.tableLinkToRecordId,
                      }),
                    isOriginal,
                    { stack: { flexWrap: "wrap", gap: "4px", alignItems: "center" } }
                  );
                }

                if (OPTIONS_TYPES.includes(column.type))
                  return renderFunc(
                    choices,
                    cellValue,
                    onChange(cell, column, row, records),
                    onChangeOptions(column.id),
                    idSelect,
                    isOriginal
                  );

                if (column.type === AirTableColumnTypes.ATTACHMENT) {
                  return renderFunc(
                    cellValue,
                    onChange(cell, column, row, records),
                    onToggleUpload,
                    onChangeFileReviewConfig,
                    isOriginal,
                    { stack: { flexWrap: "wrap", gap: "4px", alignItems: "center" } }
                  );
                }

                return renderFunc(cellValue, onChange(cell, column, row, records), isOriginal);
              }
              if (!cellValue || cellValue.length === 0) return null;

              if (column.type === AirTableColumnTypes.LINK_TO_RECORD)
                return renderFunc(choices, cellValue, (recordId: string) =>
                  onOpenLinkRecordFormPopup({
                    recordId,
                    tableId: column?.options?.tableLinkToRecordId,
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
                xsLabel={4}
                xsValue={8}
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
  );
}

export default Form;
