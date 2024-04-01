import { styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { forwardRef } from "react";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
  color?:
    | "inherit"
    | "error"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | undefined;
  stylesButton?: any;
}

const MExpandMoreWrapIcon = styled(
  forwardRef((props: ExpandMoreProps, ref: any) => {
    const { expand, color, stylesButton, ...other } = props;
    return <IconButton {...other} sx={{ ...stylesButton }} ref={ref} />;
  })
)(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const MExpandMoreIconButton = forwardRef((props: ExpandMoreProps, ref: any) => {
  const { color = "primary.main" } = props;

  return (
    <MExpandMoreWrapIcon {...props} ref={ref}>
      <ExpandMoreIcon sx={{ color }} />
    </MExpandMoreWrapIcon>
  );
});
