import IconButton from "@mui/material/IconButton";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import WebIcon from "@mui/icons-material/Web";
import React from "react";

const ToggleModeTable = ({
  onToggleModeTable,
  isFullTable,
  style,
}: {
  onToggleModeTable?: () => void;
  isFullTable?: boolean;
  style?: React.CSSProperties;
}) => {
  return (
    <IconButton
      onClick={onToggleModeTable && onToggleModeTable}
      style={{ width: 50, height: 50, ...containerStyle, ...style }}
      color={isFullTable ? "primary" : "secondary"}
    >
      {isFullTable ? <WebIcon style={iconStyle} /> : <FormatLineSpacingIcon style={iconStyle} />}
    </IconButton>
  );
};

export default ToggleModeTable;

const containerStyle = { margin: 0, padding: 0 };
const iconStyle = { fontSize: 27, margin: 5, marginLeft: 10, marginRight: 10 };
