import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const ClearAdornment = ({ onClear }: { onClear: () => void }) => {
  return (
    <InputAdornment position="end" className="selector-down-arrow-icon" onClick={onClear}>
      <IconButton style={{ padding: 3 }}>
        <HighlightOffIcon style={{ fontSize: 18 }} />
      </IconButton>
    </InputAdornment>
  );
};

export default ClearAdornment;
