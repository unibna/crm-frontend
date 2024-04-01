// Libraries
import { useEffect, useState, useRef, MouseEvent } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";

// MUI
import { alpha, styled } from "@mui/material/styles";
import { Box, Stack, Avatar, Drawer, Typography, Divider, Button, useTheme } from "@mui/material";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";

// Hooks
import useAuth from "hooks/useAuth";
import useIsMountedRef from "hooks/useIsMountedRef";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import useSettings from "hooks/useSettings";

// Components
import Logo from "components/Images/LogoImage";
import Scrollbar from "components/Scrolls/Scrollbar";
import NavSection from "components/NavSection";
import MHidden from "components/MHidden";
import MenuPopover from "components/Popovers/MenuPopover";

// Redux
import { toastError } from "store/redux/toast/slice";

// Utils & Constants
import sidebarConfig from "layouts/navbar/SidebarConfig";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleToggleCollapse, sidebarStore } from "store/redux/sidebar/slice";
import { ROLE_TAB } from "constants/rolesTab";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 90;
const DEFAULT_AVATAR = "/static/mock-images/avatars/avatar_default.jpg";

// ----------------------------------------------------------------------

type IconCollapseProps = {
  onToggleCollapse: VoidFunction;
  collapseClick: boolean;
};

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

const DashboardSidebar = ({ isOpenSidebar, onCloseSidebar }: DashboardSidebarProps) => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { isOpenModal, onShowModal, themeLayout, settings, setSettings } = useSettings();
  const { user, logout } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { click, hover } = useAppSelector(sidebarStore);
  const isCollapse = themeLayout === "vertical_collapsed";

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
      console.error(error);
      dispatch(toastError({ message: "Không thể đăng xuất" }));
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  useEffect(() => {
    if (isCollapse) {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }
    }

    prevOpen.current = open;
  }, [isCollapse, open]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        mb: 4,
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: "center",
          }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            component={RouterLink}
            to={`${getObjectPropSafely(() => user?.group_permission?.route)}`}
            sx={{ display: "inline-flex", width: "100%" }}
          >
            <Logo isCollapse={isCollapse} isShowDecoration />
          </Box>
        </Stack>

        {isCollapse ? (
          <Avatar
            onMouseDown={() => navigate(`/${ROLE_TAB.PROFILE}`)}
            alt="My Avatar"
            src={getObjectPropSafely(() => user?.image?.url) || DEFAULT_AVATAR}
            sx={{ mx: "auto", mb: 2, cursor: 'pointer' }}
          />
        ) : (
          <Stack direction="column" spacing={0.5} sx={{ mt: 1 }}>
            <AccountStyle onClick={() => navigate(`/${ROLE_TAB.PROFILE}`)} ref={anchorRef as any}>
              <Avatar
                alt="My Avatar"
                src={getObjectPropSafely(() => user?.image?.url) || DEFAULT_AVATAR}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {user?.group_permission?.name}
                </Typography>
              </Box>
            </AccountStyle>
          </Stack>
        )}

        <MenuPopover
          open={open}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          sx={{ width: 240 }}
        >
          <Stack direction="row" alignItems="center">
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle1" noWrap>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                {user?.email}
              </Typography>
            </Box>
          </Stack>

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
      </Stack>

      <NavSection
        navConfig={sidebarConfig({
          roles: user?.group_permission?.data,
          userGroupId:  user?.group_permission?.id || "",
          pathname,
          handleShowThemeModal: () => onShowModal(!isOpenModal),
        })}
        isShow={!isCollapse}
      />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH,
        },
      }}
      isCollapse={isCollapse}
    >
      <MHidden width="lgDown">
        <CollapseButton
          onToggleCollapse={() => {
            handleToggleCollapse();
            setSettings &&
              setSettings({
                ...settings,
                themeLayout:
                  themeLayout === "vertical_collapsed" ? "vertical" : "vertical_collapsed",
              });
          }}
          collapseClick={click}
        />
      </MHidden>

      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              transition: theme.transitions.create("width", {
                duration: "0.75s",
                easing: theme.transitions.easing.easeInOut,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          // onMouseEnter={handleHoverEnter}
          // onMouseLeave={handleHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              transition: theme.transitions.create("width", {
                duration: "0.75s",
                easing: theme.transitions.easing.easeInOut,
              }),
              bgcolor: "background.default",
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
              ...(hover && {
                borderRight: 0,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88),
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
};

export default DashboardSidebar;

const CollapseButton = ({ onToggleCollapse, collapseClick }: IconCollapseProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        position: "absolute",
        border: `1px dashed ${theme.palette.grey[400]}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 32,
        right: -15,
        backgroundColor: theme.palette.background.default,
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={onToggleCollapse}
    >
      <KeyboardArrowLeftRoundedIcon
        sx={{
          color: theme.palette.grey[600],
          transition: theme.transitions.create("transform", {
            duration: "0.75s",
            easing: theme.transitions.easing.easeInOut,
          }),
          ...(collapseClick && {
            transform: "rotate(180deg)",
          }),
        }}
      />
    </Box>
  );
};

const RootStyle: any = styled("div", {
  shouldForwardProp: (props) => props !== "isCollapse",
})(({ theme, isCollapse }: any) => ({
  zIndex: 1,
  position: "fixed",
  background: theme.palette.background.default,
  height: "100%",
  ".MuiDrawer-root .MuiPaper-root": {
    borderStyle: "dashed",
    zIndex: 1,
  },
  transition: theme.transitions.create("width", {
    duration: "0.75s",
    easing: theme.transitions.easing.easeInOut,
  }),
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12],
  cursor: "pointer",
}));
