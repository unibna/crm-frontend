import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { LabelInfo, TextInfo } from "components/Labels";
import vi from "locales/vi.json";
import { FieldError } from "react-hook-form";

const Note = ({
  error,
  isEdit,
  onChange,
  value,
}: {
  isEdit?: boolean;
  error?: FieldError;
  onChange: (value: string) => void;
  value?: string;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>Ghi chú thanh toán</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <TextField
            fullWidth
            error={!!error}
            helperText={error?.message}
            multiline
            minRows={2}
            placeholder={vi.addition_fee_note}
            label={vi.addition_fee_note}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, textAlign: "end" }}>{value}</TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default Note;
