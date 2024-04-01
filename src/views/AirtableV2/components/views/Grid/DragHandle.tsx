import { Box, styled, Theme, useTheme } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { forwardRef } from "react";

const HandleWrapper = styled(Box)(
  ({ isDragging, theme }: { isDragging: boolean; theme: Theme }) => ({
    cursor: isDragging ? "grabbing" : "grab",
    opacity: 0,
    transition: theme.transitions.create("opacity", {
      duration: ".2s",
    }),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })
);

const DragHandle = forwardRef((props: any, ref) => {
  const theme = useTheme();
  return (
    <HandleWrapper {...props} ref={ref}>
      {props.children}
      <DragIndicatorIcon sx={{ color: theme.palette.grey[600], width: 24, height: 24 }} />
    </HandleWrapper>
  );
});

export default DragHandle;
