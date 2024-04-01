// Libraries
import { useTheme } from "@mui/material";
import { Handle, Position } from "reactflow";

// ---------------------------------------------

export const HandleTarget = ({
  position = Position.Left,
  style,
  id,
}: {
  position?: Position;
  style?: React.CSSProperties;
  id?: string;
}) => {
  const theme = useTheme();
  return (
    <Handle
      type="target"
      id={id}
      position={position}
      style={{
        width: "10px",
        height: "20px",
        borderRadius: "1px",
        backgroundColor: theme.palette.info.main,
        zIndex: 1000,
        ...style,
      }}
    />
  );
};

export const HandleSource = ({ position = Position.Right }: { position?: Position }) => {
  const theme = useTheme();
  return (
    <Handle
      type="source"
      position={position}
      style={{
        width: "14px",
        height: "14px",
        backgroundColor: theme.palette.info.main,
      }}
    />
  );
};
