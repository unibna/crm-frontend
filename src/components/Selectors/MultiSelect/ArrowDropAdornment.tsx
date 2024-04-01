import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ArrowDropAdornment = () => {
  return (
    <InputAdornment position="end" className="selector-down-arrow-icon">
      <IconButton style={{ padding: 0 }}>
        <ArrowDropDownIcon style={{ fontSize: 24 }} />
      </IconButton>
    </InputAdornment>
  );
};

export default ArrowDropAdornment;
