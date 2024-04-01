// Libraries
import { useRef, useState, useEffect, MouseEvent } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";

// Redux
import { toastError } from "store/redux/toast/slice";

// Hooks
import useAuth from "hooks/useAuth";
import useIsMountedRef from "hooks/useIsMountedRef";
import { useAppDispatch } from "hooks/reduxHook";

// Components
import { Box, Typography, Divider, Button, SxProps, Theme } from "@mui/material";
import MenuPopover from "components/Popovers/MenuPopover";
import MyAvatar from "components/Images/Avatar";
import { ROLE_TAB } from "constants/rolesTab";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
  cursor: "pointer",
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
  isShowAvatarOnly?: boolean;
  containerStyles?: SxProps<Theme>;
};

export default function NavbarAccount({
  isCollapse,
  isShowAvatarOnly = false,
  containerStyles,
}: Props) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const isMountedRef = useIsMountedRef();
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isCollapse) {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }
    }

    prevOpen.current = open;
  }, [isCollapse, open]);

  const handleClose = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await logout?.();
      if (isMountedRef.current) {
        navigate("/");
        handleClose(event);
      }
    } catch (error) {
      dispatch(toastError({ message: "Không thể đăng xuất" }));
    }
  };

  return (
    <>
      <RootStyle
        sx={{
          position: "relative",
          ...((isCollapse || isShowAvatarOnly) && {
            bgcolor: "transparent",
          }),
          ...containerStyles,
        }}
        onClick={() => navigate(`/${ROLE_TAB.PROFILE}`)}
        ref={anchorRef as any}
      >
        <MyAvatar />

        {!isShowAvatarOnly && (
          <>
            <Box
              sx={{
                ml: 2,
                transition: (theme) =>
                  theme.transitions.create("width", {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && {
                  ml: 0,
                  width: 0,
                }),
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {user?.name}
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
                {user?.email}
              </Typography>
            </Box>
          </>
        )}
      </RootStyle>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 240 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={(e: any) => handleLogout(e)}
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
