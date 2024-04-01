import { useState, useRef, useEffect } from "react";
// @mui
import { OutlinedInput, Paper, Button, ClickAwayListener, alpha } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";

// ----------------------------------------------------------------------

export default function KanbanColumnAdd({ onAddColumn }: { onAddColumn: (name: string) => void }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const [name, setName] = useState("");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreateColumn = async () => {
    try {
      if (name) {
        onAddColumn(name);
        // setName("");
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCreateColumn();
    }
  };

  return (
    <Paper sx={{ minWidth: 280, width: 280 }}>
      {!open && (
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<Add width={20} height={20} />}
          onClick={handleOpen}
          sx={{
            background: "transparent",
            border: `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          }}
        >
          New Stack
        </Button>
      )}

      {open && (
        <ClickAwayListener onClickAway={handleCreateColumn}>
          <OutlinedInput
            fullWidth
            placeholder="New stack"
            inputRef={nameRef}
            value={name}
            onChange={handleChangeName}
            onKeyUp={handleKeyUp}
            sx={{ typography: "h6" }}
          />
        </ClickAwayListener>
      )}
    </Paper>
  );
}
