// Hooks
import usePopup from "hooks/usePopup";

// Components
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";

// Constants & Utils
import { SxProps, Theme, useTheme } from "@mui/material";
import vi from "locales/vi.json";
import { statusNotification } from "constants/index";
import { forwardRef } from "react";

// ----------------------------------------------

export const CopyIconButton = forwardRef(
  (
    {
      value,
      size = "small",
      sx,
      iconStyle,
    }: {
      value: string;
      size?: "small" | "inherit" | "large" | "medium";
      sx?: SxProps<Theme>;
      iconStyle?: React.CSSProperties;
    },
    ref: React.ForwardedRef<unknown>
  ) => {
    const theme = useTheme();
    const { setNotifications } = usePopup();

    const copyValue = async (e: any) => {
      navigator.clipboard.writeText(value || "");
      setNotifications({
        message: vi.copied,
        variant: statusNotification.SUCCESS,
      });
      e.preventDefault();
    };

    return (
      <Box
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: -12,
          right: -16,

          color: theme.palette.primary.main,
          "&:hover": {
            color: theme.palette.primary.dark,
            transition: "all .15s ease-in-out",
          },
          svg: {
            width: 15,
            height: 15,
          },
          ...sx,
        }}
        onClick={copyValue}
        ref={ref}
      >
        <ContentCopyIcon fontSize={size} style={iconStyle} />
      </Box>
    );
  }
);
