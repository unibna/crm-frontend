import { useEffect, useState } from "react";

import { InputAdornment, Stack, TextField } from "@mui/material";

import vi from "locales/vi.json";

import { MButton } from "components/Buttons";

import { standardString } from "utils/helpers";

import {
  AirTableColumn,
  AirTableColumnLabels,
  AirTableColumnTypes,
  AirTableOption,
} from "_types_/SkyTableType";
import { AirTableColumnIcons } from "views/AirtableV2/constants";
import MenuOption from "../../MenuOption";

function EditFieldConfig({
  column,
  columns,
  onClose,
  onSubmit,
}: {
  column: AirTableColumn;
  columns: AirTableColumn[];
  onClose: () => void;
  onSubmit: (column: AirTableColumn) => void;
}) {
  const [name, setName] = useState<string>(column.name);
  const [tempOptions, setTempOptions] = useState<AirTableOption[]>([]);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;
    const standardName = standardString(value);
    const itemDuplicate = columns.find((item) => standardString(item.name) === standardName);
    setName(value);
    if (itemDuplicate) {
      setError(vi.airtable.duplicate);
      return;
    }
    if (error) setError("");
  };

  useEffect(() => {
    column.name !== name && setName(column.name);
    setTempOptions(column?.options?.choices || []);
    error && setError("");
  }, [column]);

  return (
    <Stack direction="column" spacing={2} px={2} py={3} sx={{ minWidth: 320 }}>
      <TextField
        size="small"
        label="Tên trường"
        placeholder="Nhập tên trường"
        value={name}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        error={!!error}
        helperText={error}
      />

      <TextField
        fullWidth
        size="small"
        label="Kiểu dữ liệu"
        value={AirTableColumnLabels[column.type]}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">{AirTableColumnIcons[column.type]}</InputAdornment>
          ),
        }}
        disabled
      />

      {(column.type === AirTableColumnTypes.MULTIPLE_SELECT ||
        column.type === AirTableColumnTypes.SINGLE_SELECT) && (
        <MenuOption options={tempOptions} setOptions={setTempOptions} />
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end" width={"100%"} pt={1}>
        <MButton variant="outlined" onClick={onClose}>
          Huỷ
        </MButton>
        <MButton
          variant="contained"
          onClick={() => {
            onSubmit({
              ...column,
              name,
              options: {
                ...column.options,
                choices: column.options?.choices ? tempOptions : undefined,
                choiceOrder: column.options?.choices
                  ? tempOptions.map((item) => item.id)
                  : undefined,
              },
            });
            onClose();
          }}
          disabled={!name || !!error}
        >
          Xác nhận
        </MButton>
      </Stack>
    </Stack>
  );
}

export default EditFieldConfig;
