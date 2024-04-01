import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { MTextLine } from "components/Labels";

const NoteInput = ({
  isMutation,
  setCustomerInfo,
  note,
}: {
  note?: string;
  tagsCustomer?: string[];
  isMutation?: boolean;
  loading?: boolean;
  setCustomerInfo: (note: string) => void;
}) => {
  return (
    <Grid item xs={12}>
      <MTextLine
        label="Ghi chú:"
        value={
          <TextField
            disabled={!isMutation}
            multiline
            minRows={2}
            maxRows={4}
            sx={{ fontSize: 13, ".MuiOutlinedInput-root": { padding: 1 } }}
            fullWidth
            value={note || ""}
            onChange={(e) => setCustomerInfo(e.target.value)}
          />
        }
        displayType="grid"
      />
    </Grid>
  );
};

export default NoteInput;
