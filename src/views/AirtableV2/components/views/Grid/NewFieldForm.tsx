import { useContext, useState } from "react";

import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import {
  Box,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";

import { AirTableBase, AirTableColumn, AirTableColumnTypes } from "_types_/SkyTableType";

import vi from "locales/vi.json";

import { MButton } from "components/Buttons";

import { skycomtableApi } from "_apis_/skycomtable.api";
import { useCancelToken } from "hooks/useCancelToken";
import { standardString } from "utils/helpers";
import { AIRTABLE_COLUMN_TYPE_CONFIG, BEFieldType } from "views/AirtableV2/constants";
import { AirtableContext } from "views/AirtableV2/context";

function NewFieldForm({
  columns,
  onClose,
  onAddColumn,
}: {
  columns: AirTableColumn[];
  onClose: () => void;
  onAddColumn: (newCol: AirTableColumn) => void;
}) {
  const HIDDEN_FIELD_TYPES = [
    // AirTableColumnTypes?.CHECKBOX,
    // AirTableColumnTypes?.ATTACHMENT,
    BEFieldType[AirTableColumnTypes?.LINK_TO_RECORD],
    // AirTableColumnTypes?.MULTIPLE_SELECT,
    // AirTableColumnTypes?.MULTIPLE_USER,
    // AirTableColumnTypes?.SINGLE_SELECT,
    // AirTableColumnTypes?.SINGLE_USER,
  ];

  const initState = {
    name: "",
    width: 200,
    type: AirTableColumnTypes?.SINGLE_LINE_TEXT,
    id: "",
  };

  const theme = useTheme();
  const [col, setCol] = useState<AirTableColumn>({ ...initState });
  const [isShowListTable, setIsShowListTable] = useState(false);
  const [table, setTable] = useState<AirTableBase | undefined>(undefined);
  const [recordDisplay, setRecordDisplay] = useState<string>("");

  const [error, setError] = useState("");

  const { newCancelToken } = useCancelToken();

  const {
    state: {
      data: { listTable, detailTable },
    },
    updateLoading,
    updateData,
  } = useContext(AirtableContext);

  const getListTable = async () => {
    updateLoading(true);

    const result = await skycomtableApi.get(
      {
        cancelToken: newCancelToken(),
      },
      `table`
    );

    if (result && result.data) {
      updateData({
        listTable: result.data,
      });
    }
    updateLoading(false);
  };

  const handleClose = () => {
    if (error) setError("");
    setCol({ ...initState });
    onClose();
  };

  const handleChangeType = (newType: AirTableColumnTypes) => {
    if (newType === AirTableColumnTypes.LINK_TO_RECORD) {
      getListTable();
      setIsShowListTable(true);
    }

    if (col.type !== newType) {
      setCol({
        ...col,
        type: newType,
      });
    }
  };

  const handleChange = (e: any) => {
    const { value } = e.target;
    const standardName = standardString(value);
    const itemDuplicate = columns.find((item) => standardString(item.name) === standardName);
    setCol({
      ...col,
      name: value,
      isCreateByFe: true,
    });
    if (itemDuplicate) {
      setError(vi.airtable.duplicate);
      return;
    }
    if (error) setError("");
  };

  const handleBack = () => {
    if (isShowListTable) {
      setTable(undefined);
      !table && setIsShowListTable(false);
    }
  };

  return (
    <Stack direction="column" spacing={1} px={2} py={3} sx={{ minWidth: 320 }}>
      <TextField
        fullWidth
        size="small"
        label="Tên trường"
        placeholder="Nhập tên trường"
        value={col.name}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        error={!!error}
        helperText={error}
      />
      <Box
        sx={{
          p: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.neutral
              : theme.palette.grey[300],
          borderRadius: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ pb: 1 }}>
          {isShowListTable && (
            <IconButton
              onClick={handleBack}
              sx={{ backgroundColor: theme.palette.divider, width: 30, height: 30 }}
            >
              <NavigateBeforeRoundedIcon />
            </IconButton>
          )}

          <FormLabel
            component="legend"
            sx={{
              fontSize: 13,
              color: theme.palette.text.primary,
            }}
          >
            {!isShowListTable && "Chọn kiểu dữ liệu của trường"}
            {isShowListTable && !table && "Chọn bảng muốn liên kết"}
            {isShowListTable && table && "Chọn trường hiển thị"}
          </FormLabel>
        </Stack>

        <List
          sx={{
            height: 200,
            overflow: "auto",
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
          }}
        >
          {!isShowListTable &&
            AIRTABLE_COLUMN_TYPE_CONFIG.map((item) => (
              <ListItem disablePadding selected={col.type === item.value} key={item.value}>
                <ListItemButton onClick={() => handleChangeType(item.value)}>
                  <ListItemIcon sx={{ fontSize: 13, color: theme.palette.grey[700] }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ ".MuiTypography-root": { fontSize: 13 } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

          {isShowListTable &&
            !table &&
            listTable?.map(
              (tableItem) =>
                tableItem.id !== detailTable?.id && (
                  <ListItem disablePadding key={tableItem.id}>
                    <ListItemButton onClick={() => setTable(tableItem)}>
                      <ListItemText
                        primary={tableItem.name}
                        sx={{ ".MuiTypography-root": { fontSize: 13 } }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
            )}

          {isShowListTable &&
            table &&
            table.fields.map(
              (field) =>
                !HIDDEN_FIELD_TYPES.includes(field.type) && (
                  <ListItem disablePadding key={field.id} selected={recordDisplay === field.id}>
                    <ListItemButton onClick={() => setRecordDisplay(field.id)}>
                      <ListItemText
                        primary={field.name}
                        sx={{ ".MuiTypography-root": { fontSize: 13 } }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
            )}
        </List>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end" width={"100%"} pt={1}>
        <MButton variant="outlined" onClick={handleClose}>
          Huỷ
        </MButton>
        <MButton
          variant="contained"
          onClick={() => {
            onAddColumn({
              ...col,
              options: {
                ...col.options,
                ...(col.type === AirTableColumnTypes.LINK_TO_RECORD && {
                  tableLinkToRecordId: table?.id,
                  recordDisplay,
                }),
              },
            });
            handleClose();
          }}
          disabled={
            !col.name ||
            !!error ||
            (col.type === AirTableColumnTypes.LINK_TO_RECORD && (!table || !recordDisplay))
          }
        >
          Thêm
        </MButton>
      </Stack>
    </Stack>
  );
}

export default NewFieldForm;
