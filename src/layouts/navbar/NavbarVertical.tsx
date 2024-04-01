import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { styled, useTheme } from "@mui/material/styles";
import { Box, Stack, Drawer } from "@mui/material";
// hooks
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
// utils
import { cssStyles } from "utils/cssStyles";
// config
import { NAVBAR } from "constants/index";
import sidebarConfig from "layouts/navbar/SidebarConfig";

// components
import Logo from "components/Images/LogoImage";
import Scrollbar from "components/Scrolls/Scrollbar";

//
import NavbarAccount from "./NavbarAccount";
import CollapseButton from "./CollapseButton";
import useAuth from "hooks/useAuth";
import { NavSectionVertical } from "components/Sections";
import { useAppSelector } from "hooks/reduxHook";
import {
  handleHoverEnter,
  handleHoverLeave,
  handleToggleCollapse,
  sidebarStore,
} from "store/redux/sidebar/slice";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }: Props) {
  const { user } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const isDesktop = useResponsive("up", "lg");
  const { click, hover } = useAppSelector(sidebarStore);

  const { isOpenModal, onShowModal } = useSettings();
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": { height: 1, display: "flex", flexDirection: "column" },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2,
          flexShrink: 0,
          ...(isCollapse && { alignItems: "center" }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo isCollapse={isCollapse} isShowDecoration />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={handleToggleCollapse} collapseClick={click} />
          )}
        </Stack>

        <NavbarAccount isCollapse={isCollapse} />
      </Stack>

      <NavSectionVertical
        navConfig={sidebarConfig({
          roles: user?.group_permission?.data,
          userGroupId: user?.group_permission?.id || "",
          pathname,
          handleShowThemeModal: () => onShowModal(!isOpenModal),
        })}
        isCollapse={isCollapse}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(click && {
          position: "absolute",
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: "dashed",
              bgcolor: "background.default",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH - 16,
              }),
              ...(hover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
