// @mui
import { styled } from "@mui/material/styles";
import { Stack, AppBar, Toolbar, Button } from "@mui/material";

// hooks
import useOffSetTop from "hooks/useOffSetTop";
import useResponsive from "hooks/useResponsive";
// utils
import { HEADER, NAVBAR } from "constants/index";
// components
import Logo from "components/Images/LogoImage";
import Iconify from "components/Icons/Iconify";
import NavbarAccount from "layouts/navbar/NavbarAccount";
import { useLocation } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_DASHBOARD } from "constants/rolesTab";

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  isDashboard: boolean;
  horizontalLayout: string;
  isDesktop: boolean;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" &&
    prop !== "isOffset" &&
    prop !== "horizontalLayout" &&
    prop !== "isDashboard" &&
    prop !== "isDesktop",
})<RootStyleProps>(({ isCollapse, isOffset, horizontalLayout, isDashboard, isDesktop, theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(isDashboard && {
    width: "100%",
    minHeight: "70px",
    left: 0,
  }),
  backgroundColor: getObjectPropSafely(() => theme.palette.background.default),
  [theme.breakpoints.up("lg")]: {
    boxShadow: "none",
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(horizontalLayout === "true" && {
      width: "100%",
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT + 20,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: VoidFunction;
  isCollapse?: boolean;
  horizontalLayout?: boolean;
};

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  horizontalLayout = false,
}: Props) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !horizontalLayout;

  const isDesktop = useResponsive("up", "lg");
  const { pathname } = useLocation();

  return (
    <RootStyle
      isDashboard={
        pathname === PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.DASHBOARD] ||
        pathname === PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.MKT_DASHBOARD] ||
        pathname === PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.SALE_DASHBOARD]
      }
      isCollapse={isCollapse}
      isOffset={isOffset}
      horizontalLayout={`${horizontalLayout}`}
      isDesktop={isDesktop || true}
    >
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 },
        }}
      >
        {isDesktop && horizontalLayout && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", position: "relative" }}
          >
            <Logo isCollapse={false} isShowDecoration />
            <NavbarAccount
              isShowAvatarOnly
              isCollapse={false}
              containerStyles={{
                position: "absolute",
                left: "0px",
              }}
            />
          </Stack>
        )}

        {!isDesktop && (
          <Button onClick={onOpenSidebar} sx={{ mr: 1, color: "text.primary", zIndex: 2000 }}>
            <Iconify icon="eva:menu-2-fill" />
          </Button>
        )}
      </Toolbar>
    </RootStyle>
  );
}
