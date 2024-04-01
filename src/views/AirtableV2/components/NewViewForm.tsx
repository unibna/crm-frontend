import { useState } from "react";

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

import vi from "locales/vi.json";

import { MButton } from "components/Buttons";

import {
  AirTableBase,
  AirTableColumnTypes,
  AirTableView,
  AirTableViewTypes,
} from "_types_/SkyTableType";
import { standardString } from "utils/helpers";
import { AIRTABLE_VIEW_TYPE_CONFIG, BEFieldType } from "../constants";

const initState = {
  name: "",
  type: AirTableViewTypes.GRID,
  id: undefined,
  visible_fields: [],
};

function NewViewForm({
  views,
  table,
  onClose,
  onAddView,
}: {
  views: AirTableView[];
  table?: AirTableBase;
  onClose: () => void;
  onAddView: (newView: AirTableView) => void;
}) {
  const theme = useTheme();
  const [view, setView] = useState<AirTableView>(initState);
  const [isShowListField, setIsShowListField] = useState(false);
  const [fieldId, setFieldId] = useState<string>("");

  const [error, setError] = useState("");

  const handleClose = () => {
    if (error) setError("");
    setView({ ...initState });
    onClose();
  };

  const handleChangeType = (newType: AirTableViewTypes) => {
    if (newType === AirTableViewTypes.KANBAN && !isShowListField) {
      setIsShowListField(true);
    }
    if (view.type !== newType) {
      setView({
        ...view,
        type: newType,
      });
    }
  };

  const handleChange = (e: any) => {
    const { value } = e.target;
    const standardName = standardString(value);
    const itemDuplicate = views.find((item) => standardString(item.name) === standardName);

    setView({
      ...view,
      name: value,
    });

    if (itemDuplicate) {
      setError(vi.airtable.duplicate);
      return;
    }
    if (error) setError("");
  };

  const handleBack = () => {
    if (isShowListField) {
      setFieldId("");
      setIsShowListField(false);
    }
  };

  return (
    <Stack direction="column" spacing={1} px={2} py={3} sx={{ minWidth: 260 }}>
      <TextField
        fullWidth
        size="small"
        label="Tên view"
        placeholder="Nhập tên view"
        value={view.name}
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
          {isShowListField && (
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
            {!isShowListField && "Chọn kiểu dữ liệu của trường"}
            {isShowListField && "Chọn trường phân loại"}
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
          {!isShowListField &&
            AIRTABLE_VIEW_TYPE_CONFIG.map((item) => (
              <ListItem disablePadding selected={view.type === item.value} key={item.value}>
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

          {isShowListField &&
            table?.fields?.map(
              (field) =>
                BEFieldType[AirTableColumnTypes.SINGLE_SELECT] === field.type && (
                  <ListItem disablePadding key={field.id} selected={fieldId === field.id}>
                    <ListItemButton onClick={() => setFieldId(field.id)}>
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
            onAddView({
              ...view,
              visible_fields: views[0].visible_fields,
              options: {
                ...views[0].options,
                ...(view.type === AirTableViewTypes.KANBAN && {
                  fieldKanban: fieldId,
                }),
              },
            });
            handleClose();
          }}
          disabled={!view.name || !!error || (view.type === AirTableViewTypes.KANBAN && !fieldId)}
        >
          Thêm
        </MButton>
      </Stack>
    </Stack>
  );
}

export default NewViewForm;
