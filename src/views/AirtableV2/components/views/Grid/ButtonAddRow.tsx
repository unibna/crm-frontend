import { IconButton, Tooltip, useTheme } from "@mui/material";
import Add from "@mui/icons-material/Add";

function ButtonAddRow({ onAddRow }: { onAddRow: () => void }) {
  const theme = useTheme();
  return (
    <Tooltip title="Add Row">
      <IconButton
        onClick={onAddRow}
        sx={{
          borderRadius: 0.5,
          fontSize: 13,
          height: 36,
          backgroundColor: theme.palette.background.neutral,
        }}
      >
        <Add /> {"New Row"}
      </IconButton>
    </Tooltip>
  );
}

export default ButtonAddRow;
