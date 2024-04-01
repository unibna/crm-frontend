import styled from "@emotion/styled";
import { Theme, Tooltip, TooltipProps, Typography, tooltipClasses, useTheme } from "@mui/material";
import UserAvatar from "components/Images/UserAvatar";

export function UserTooltip({
  user,
}: {
  user: { name?: string; image?: any; email?: string; id?: string | number };
}) {
  const theme = useTheme();
  const styles = style(theme);
  return user?.name ? (
    <Typography sx={styles.info}>
      <LightTooltip
        title={
          <UserAvatar
            avatar={user?.image?.url || user?.image}
            name={user?.name}
            email={user?.email}
          />
        }
      >
        <Typography sx={styles.handler} component="span">{`${user?.name}`}</Typography>
      </LightTooltip>
    </Typography>
  ) : (
    <Typography>---</Typography>
  );
}

const style = (theme: Theme) => {
  return {
    info: {
      fontWeight: 600,
      fontSize: "0.875rem",
      display: "inline",
    },

    handler: {
      fontWeight: 600,
      fontSize: "0.875rem",
      //
      color: theme.palette.primary.main,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  };
};

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({}) => {
  const theme = useTheme();
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  };
});
