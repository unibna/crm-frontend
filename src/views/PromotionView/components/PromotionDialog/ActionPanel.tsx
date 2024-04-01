import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import vi from "locales/vi.json";

const ActionPanel = ({ duplidateAction }: { duplidateAction: () => void }) => {
  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center">
      <Button variant="outlined" color="error" onClick={duplidateAction} sx={{ width: 130 }}>
        {vi.duplidate}
      </Button>
    </Stack>
  );
};

export default ActionPanel;
