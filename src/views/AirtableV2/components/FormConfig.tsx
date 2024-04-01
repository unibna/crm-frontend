import { Stack, TextField } from "@mui/material";
import { MButton } from "components/Buttons";
import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";

const FormConfig = ({
  value,
  label = "Tên bảng",
  placeholder = "Nhập tên bảng",
  onClose,
  onSubmit,
}: {
  value?: { [key: string]: any };
  label?: string;
  placeholder?: string;
  onClose: () => void;
  onSubmit: (newValues: any) => void;
}) => {
  const [state, setState] = useState<{ [key: string]: any } | undefined>(value);
  const [error, setError] = useState("");

  const handleChange = (name: string) => (value: any) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  useEffect(() => {
    setState(value);
    error && setError("");
  }, [value]);

  return (
    <Stack direction="column" spacing={1} px={2} py={3}>
      <Stack direction="row" spacing={1} alignItems="center">
        {value?.color && <ColorPicker value={state?.color} onChange={handleChange("color")} />}
        <TextField
          size="small"
          label={label}
          placeholder={placeholder}
          value={state?.name}
          onChange={(e) => handleChange("name")(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error}
          helperText={error}
        />
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" width={"100%"} pt={1}>
        <MButton variant="outlined" onClick={onClose}>
          Huỷ
        </MButton>
        <MButton
          variant="contained"
          onClick={() => {
            onSubmit(state);
            onClose();
          }}
          disabled={!state?.name || !!error}
        >
          Cập nhật
        </MButton>
      </Stack>
    </Stack>
  );
};

export default FormConfig;
