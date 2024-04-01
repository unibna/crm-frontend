import { Button, Grid } from "@mui/material";
import vi from "locales/vi.json";

const SubmitButton = ({ disabled, onSubmit }: { disabled?: boolean; onSubmit: () => void }) => {
  return (
    <Grid container justifyContent="flex-end" sx={{ marginTop: 1 }}>
      <Button
        variant="contained"
        sx={{ backgroundColor: "primary.main", textTransform: "none" }}
        onClick={onSubmit}
        disabled={disabled}
        fullWidth
      >
        {vi.button.customer_update}
      </Button>
    </Grid>
  );
};

export default SubmitButton;
