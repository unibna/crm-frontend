import { Box, List, ListItem, Stack, Typography, alpha, useTheme } from "@mui/material";
import {
  AirTableBase,
  AirTableColumnTypes,
  AirTableField,
  AirTableOption,
} from "_types_/SkyTableType";
import { useAppSelector } from "hooks/reduxHook";
import { useMemo } from "react";

import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
  AirTableColumnRenderViewFuncs,
  BEFieldType,
  DefaultData,
  OPTIONS_TYPES,
} from "../constants";

function MenuRecord({
  dataTable,
  recordIds = [],
  recordDisplay, // fieldId
  onChange,
  onClose,
}: {
  dataTable: AirTableBase | undefined;
  recordIds: string[];
  recordDisplay: string;
  onChange: (newValues: { record_id: string; record_display: string }[]) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
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

  const handleClick = (recordId: string) => {
    const newValues = [...recordIds, recordId];
    onChange(
      newValues.map((item) => ({
        record_id: item,
        record_display: recordDisplay,
      }))
    );
    onClose();
  };

  const renderRow = (props: ListChildComponentProps) => {
    const { data, index, style } = props;

    const id = data[index];

    // if (recordIds?.includes(id)) return null;

    const objectCellByField: {
      [key: string]: {
        // AirTableField["id"]
        field: AirTableField;
        id: string; //AirTableCell["id"];
        value: any; // AirTableCell["cell"]["value"];
      };
    } =
      dataTable?.records?.[id]?.reduce(
        (prev, current) => ({
          ...prev,
          [current.field]: {
            ...current,
            field: dataTable.fields.find((field) => field.id === current.field),
          },
        }),
        {}
      ) || {};

    const cell = objectCellByField?.[recordDisplay];

    const field = objectCellByField?.[recordDisplay]?.field;

    const columnType: any =
      field?.options?.feType ||
      Object.keys(BEFieldType).find(
        (item: AirTableColumnTypes) => BEFieldType[item] === field?.type
      ) ||
      AirTableColumnTypes.SINGLE_LINE_TEXT;

    if (!columnType) return null;
    const renderFunc = AirTableColumnRenderViewFuncs[columnType];

    const choices =
      columnType === AirTableColumnTypes.SINGLE_USER ||
      columnType === AirTableColumnTypes.MULTIPLE_USER
        ? userOptions
        : (field?.options?.choices && Object.values(field?.options?.choices)) || [];

    return (
      <ListItem
        style={style}
        key={id}
        onClick={() => (recordIds?.includes(id) ? {} : handleClick(id))}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: "auto!important",
          cursor: "pointer",
          py: 0.5,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },

          ...(recordIds?.includes(id) && {
            opacity: 0.4,
          }),
        }}
      >
        <Box sx={{ ".MuiTypography-root": { fontWeight: 700, fontSize: "16px" }, mb: 1 }}>
          {OPTIONS_TYPES.includes(columnType)
            ? renderFunc(choices, cell?.value)
            : renderFunc(cell?.value)}
        </Box>
        <Stack direction={"row"} spacing={2}>
          {dataTable?.fields?.map((field) => {
            const columnInnerType: AirTableColumnTypes | any =
              field?.options?.feType ||
              Object.keys(BEFieldType).find(
                (item: AirTableColumnTypes) => BEFieldType[item] === field?.type
              ) ||
              AirTableColumnTypes.SINGLE_LINE_TEXT;

            if (!columnInnerType) return null;

            const renderInnerFunc = AirTableColumnRenderViewFuncs[columnInnerType];

            const innerChoices =
              columnInnerType === AirTableColumnTypes.SINGLE_USER ||
              columnInnerType === AirTableColumnTypes.MULTIPLE_USER
                ? userOptions
                : (field?.options?.choices && Object.values(field?.options?.choices)) || [];

            const value =
              objectCellByField?.[field.id]?.value ||
              DefaultData[columnInnerType as AirTableColumnTypes];

            return (
              <Stack direction="column" sx={{ width: "200px" }} key={field.id}>
                <Typography
                  sx={{
                    mb: 0.25,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    opacity: 0.5,
                  }}
                >
                  {field.name}
                </Typography>
                {OPTIONS_TYPES.includes(columnInnerType)
                  ? renderInnerFunc(innerChoices, value)
                  : renderInnerFunc(value)}
              </Stack>
            );
          })}
        </Stack>
      </ListItem>
    );
  };

  return (
    <List sx={{ height: 400, width: "100%", bgcolor: "background.paper" }}>
      <FixedSizeList
        height={400}
        width={"100%"}
        itemSize={120}
        itemCount={(dataTable?.records && Object.keys(dataTable?.records).length) || 0}
        overscanCount={1}
        itemData={(dataTable?.records && Object.keys(dataTable?.records)) || []}
      >
        {renderRow}
      </FixedSizeList>
    </List>
  );
}

export default MenuRecord;
