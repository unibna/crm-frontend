import React, { useState, forwardRef } from "react";
import { animated, AnimatedComponent } from "@react-spring/web";
import SpeedDial, { SpeedDialProps } from "@mui/material/SpeedDial";
import { Backdrop, SpeedDialAction, SxProps, SpeedDialIcon, Theme, useTheme } from "@mui/material";
import { ColorSchema } from "_types_/ThemeColorType";
import { createGradient } from "theme/palette";
import map from "lodash/map";
import MDraggable from "components/DragAndDrop/MDraggable";

// --------------------------------------------------------------------------
export interface GroupButtonProps {
  iconContainerButton?: JSX.Element;
  contentArrayButton: {
    color?: ColorSchema;
    handleClick: () => void;
    title: string;
    styles?: SxProps<Theme>;
    icon: JSX.Element;
  }[];
  direction?: SpeedDialProps["direction"];
  isBackdrop?: boolean;
  speedDialStyles?: SxProps<Theme>;
}
interface SpeedDialComponentProps extends GroupButtonProps {
  open: boolean;
  theme: Theme;
  toggleAction: () => void;
}

const SpeedDialComponent = forwardRef((props: SpeedDialComponentProps, ref) => {
  const {
    speedDialStyles,
    iconContainerButton,
    open,
    direction,
    contentArrayButton,
    theme,
    toggleAction,
  } = props;
  const [isDrag, setIsDrag] = useState(false);

  return (
    <SpeedDial
      ref={ref}
      ariaLabel="Speedial tooltip"
      sx={{
        position: "fixed",
        bottom: 50,
        right: 50,
        touchAction: "none",
        zIndex: 9999,
        ".MuiSpeedDial-fab": {
          background: createGradient(theme.palette.primary.light, theme.palette.primary.main),
          width: "46px",
          height: "46px",
          cursor: "pointer",
        },
        ...speedDialStyles,
      }}
      icon={<SpeedDialIcon icon={iconContainerButton} />}
      open={open}
      direction={direction || "left"}
      id="productGroupButton"
      onMouseDown={() => setIsDrag(false)}
      onMouseMove={() => setIsDrag(true)}
      onMouseUp={() => {
        !isDrag && toggleAction();
      }}
    >
      {map(contentArrayButton, (content) => (
        <SpeedDialAction
          key={content.title}
          icon={content.icon}
          tooltipTitle={content.title}
          tooltipOpen
          onClick={content.handleClick}
          sx={{
            ".MuiSpeedDialAction-fab": {
              boxShadow: theme.customShadows.z12,
              cursor: "pointer",
              ".MuiSvgIcon-root": {
                color: theme.palette.primary.main,
              },
            },
            ".MuiSpeedDialAction-staticTooltipLabel": {
              whiteSpace: "nowrap",
              boxShadow: theme.customShadows.z12,
              background: createGradient(theme.palette.primary.light, theme.palette.primary.main),
              color: "white",
              cursor: "pointer",
              "&: hover": {
                opacity: 0.85,
              },
            },
          }}
        />
      ))}
    </SpeedDial>
  );
});

const AnimatedSpeedDial: AnimatedComponent<React.ElementType<any>> = animated(SpeedDialComponent);

export const GroupButtons = (props: GroupButtonProps) => {
  const theme = useTheme();
  const { isBackdrop } = props;
  const [open, setOpen] = useState(false);
  const toggleAction = () => setOpen((prev) => !prev);

  return (
    <>
      {isBackdrop && <Backdrop open={open} />}
      <MDraggable
        element={(eleProps: { ref: React.ForwardedRef<unknown>; style: object }) => {
          return (
            <AnimatedSpeedDial
              {...props}
              ref={eleProps.ref}
              open={open}
              theme={theme}
              toggleAction={toggleAction}
              style={eleProps.style}
            />
          );
        }}
      />
    </>
  );
};
