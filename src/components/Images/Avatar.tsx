// hooks
import useAuth from "hooks/useAuth";
// utils
import { createAvatar } from "utils/createAvatar";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
//
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import MUIAvatar from "@mui/material/Avatar";
import { AvatarProps } from "@mui/material";

// ----------------------------------------------------------------------

export interface Props extends AvatarProps {
  color?: AvatarColor;
}

export default function MyAvatar({ ...other }: Props) {
  const { user } = useAuth();

  return (
    <Avatar
      src={
        getObjectPropSafely(() => user?.image?.url) ||
        "/static/mock-images/avatars/avatar_default.jpg"
      }
      alt={user?.username}
      color={createAvatar(user?.username || "").color}
      {...other}
    >
      {createAvatar(user?.username || "").name}
    </Avatar>
  );
}

// ----------------------------------------------------------------------

type AvatarColor = "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";

// ----------------------------------------------------------------------

const Avatar = forwardRef<HTMLDivElement, Props>(
  ({ color = "default", children, sx, ...other }, ref) => {
    const theme = useTheme();

    if (color === "default") {
      return (
        <MUIAvatar ref={ref} sx={sx} {...other}>
          {children}
        </MUIAvatar>
      );
    }

    return (
      <MUIAvatar
        ref={ref}
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
          ...sx,
        }}
        {...other}
      >
        {children}
      </MUIAvatar>
    );
  }
);
