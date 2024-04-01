// Libraries
import { FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";

// Types
import { LoadingType } from "_types_/LoadingType";

const LoadingModal: FC<LoadingType> = (props) => {
  const { size, style } = props;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        // background: "rgba(255, 255, 255, .5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        ...style,
      }}
    >
      <CircularProgress size={size} />
    </div>
  );
};

export default LoadingModal;
