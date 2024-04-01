// material
import { styled } from "@mui/material/styles";
import { PopoverProps } from "@mui/material";
import Popover from "@mui/material/Popover";

// ----------------------------------------------------------------------

type Arrow =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";

type ArrowStyleProps = {
  arrow: Arrow;
};

const ArrowStyle = styled("span")<ArrowStyleProps>(({ arrow, theme }) => {
  const SIZE = 12;

  const POSITION = -(SIZE / 2);

  const borderStyle = `solid 1px ${theme.palette.grey[500_12]}`;

  const topStyle = {
    borderRadius: "0 0 3px 0",
    top: POSITION,
    borderBottom: borderStyle,
    borderRight: borderStyle,
  };
  const bottomStyle = {
    borderRadius: "3px 0 0 0",
    bottom: POSITION,
    borderTop: borderStyle,
    borderLeft: borderStyle,
  };
  const leftStyle = {
    borderRadius: "0 3px 0 0",
    left: POSITION,
    borderTop: borderStyle,
    borderRight: borderStyle,
  };
  const rightStyle = {
    borderRadius: "0 0 0 3px",
    right: POSITION,
    borderBottom: borderStyle,
    borderLeft: borderStyle,
  };

  return {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      zIndex: 1,
      width: SIZE,
      height: SIZE,
      content: "''",
      display: "block",
      position: "absolute",
      transform: "rotate(-135deg)",
      background: theme.palette.background.paper,
    },
    // Top
    ...(arrow === "top-left" && { ...topStyle, left: 20 }),
    ...(arrow === "top-center" && { ...topStyle, left: 0, right: 0, margin: "auto" }),
    ...(arrow === "top-right" && { ...topStyle, right: 20 }),
    // Bottom
    ...(arrow === "bottom-left" && { ...bottomStyle, left: 20 }),
    ...(arrow === "bottom-center" && { ...bottomStyle, left: 0, right: 0, margin: "auto" }),
    ...(arrow === "bottom-right" && { ...bottomStyle, right: 20 }),
    // Left
    ...(arrow === "left-top" && { ...leftStyle, top: 20 }),
    ...(arrow === "left-center" && { ...leftStyle, top: 0, bottom: 0, margin: "auto" }),
    ...(arrow === "left-bottom" && { ...leftStyle, bottom: 20 }),
    // Right
    ...(arrow === "right-top" && { ...rightStyle, top: 20 }),
    ...(arrow === "right-center" && { ...rightStyle, top: 0, bottom: 0, margin: "auto" }),
    ...(arrow === "right-bottom" && { ...rightStyle, bottom: 20 }),
  };
});

// ----------------------------------------------------------------------

interface Props extends PopoverProps {
  arrow?: Arrow;
}

export default function MenuPopover({ children, sx, arrow = "top-right", ...other }: Props) {
  return (
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          mt: 0.5,
          ml: 0.5,
          overflow: "inherit",
          boxShadow: (theme) => theme.customShadows.z20,
          border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
          width: 200,
          ...sx,
        },
      }}
      {...other}
    >
      <ArrowStyle arrow={arrow} />

      {children}
    </Popover>
  );
}
