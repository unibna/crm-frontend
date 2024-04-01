import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
// material
import { styled, Theme, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
// hooks
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
// import DashboardNavbar from "./DashboardNavbar";
import { Box } from "@mui/material";
import { ThemeLayout } from "_types_/SettingType";
import { Page } from "components/Page";
import { HEADER, TITLE_PAGE } from "constants/index";
import { PopupProvider } from "contexts/PopupContext";
import last from "lodash/last";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { BOTTOM_PAGE_HEIGHT } from "utils/tableUtil";
import { COLLAPSE_WIDTH, DRAWER_WIDTH } from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./header";
import NavbarHorizontal from "./navbar/NavbarHorizontal";

import { BaseOptionChartStyle } from "components/Charts/BaseOptionChart";
import { ProgressBarStyle } from "components/Loadings/LoadingScreen";
import ScrollToTop from "components/Scrolls/ScrollToTop";
import Setting from "components/Setting";
import { AttributeProvider } from "contexts/AttributeContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Navigate } from "react-router-dom";
import GlobalStyles from "theme/globalStyles";
import { getStorage } from "utils/asyncStorageUtil";
import { AirtableProvider } from "views/AirtableV2/context";
import PageHeaderBar from "./header/PageHeaderBar";

const RootStyle = styled("div")({
  display: "flex",
  minHeight: `calc(100vh - ${BOTTOM_PAGE_HEIGHT}px)`,
  overflow: "hidden",
  backgroundSize: "contain",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up("lg")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettings();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isDesktop = useResponsive("up", "lg");
  const [open, setOpen] = useState(false);

  const isHorizontalLayout = themeLayout === "horizontal";
  const isCollapse = themeLayout === "vertical_collapsed";

  const horizontalLayout = (
    <>
      <DashboardHeader onOpenSidebar={() => setOpen(true)} horizontalLayout={true} />

      {isDesktop ? (
        <>
          <>
            <NavbarHorizontal />
          </>
        </>
      ) : (
        <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      )}

      <Box
        component="main"
        sx={{
          px: { lg: 2 },
          pt: {
            xs: `${HEADER.MOBILE_HEIGHT + 32}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 100}px`,
          },
          pb: 8,
          // pb: {
          //   xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
          //   lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
          // },
          minHeight: "100vh",
        }}
      >
        <PageHeaderBar />
        <Outlet />
      </Box>
    </>
  );

  const verticalLayout = (
    <RootStyle>
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle
        sx={{
          transition: theme.transitions.create("margin", {
            duration: "0.75s",
            easing: theme.transitions.easing.easeInOut,
          }),
          marginTop: { xs: 7, lg: 0 },
          ...(themeLayout === "vertical" && {
            ml: `${DRAWER_WIDTH}px`,
          }),
          ...(themeLayout === "vertical_collapsed" && {
            ml: `${COLLAPSE_WIDTH + 16}px`,
          }),
          [theme.breakpoints.down("lg")]: {
            ml: "0px",
          },
        }}
      >
        {!isDesktop ? (
          <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />
        ) : (
          <PageHeaderBar />
          // <></>
        )}

        <Outlet />
      </MainStyle>
    </RootStyle>
  );

  const newTitle = useMemo(() => {
    return (
      getObjectPropSafely(
        () => TITLE_PAGE[(last(pathname.split("/")) || "") as keyof typeof TITLE_PAGE]
      ) || "Skycom Enterprise"
    );
  }, [pathname]);

  const token = getStorage("access-token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <GlobalStyles />
      <ProgressBarStyle />
      <BaseOptionChartStyle />
      <Setting />
      <ScrollToTop />
      <Page title={newTitle}>
        <AttributeProvider>
          <AirtableProvider>
            <AirtableProvider>
              <DndProvider backend={HTML5Backend}>
                <PopupProvider>
                  {isHorizontalLayout ? horizontalLayout : verticalLayout}
                  <Footer themeLayout={themeLayout} theme={theme}>
                    Developed by <b>Skycom Enterprise</b>
                  </Footer>
                </PopupProvider>
              </DndProvider>
            </AirtableProvider>
          </AirtableProvider>
        </AttributeProvider>
      </Page>
    </>
  );
}

type FooterProps = {
  theme: Theme;
  themeLayout: ThemeLayout;
};

const Footer = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "themeLayout" && prop !== "theme",
})<FooterProps>(({ theme, themeLayout }) => ({
  textAlign: "center",
  fontSize: 13,
  fontWeight: "400",
  padding: "12px 0",
  backgroundColor: getObjectPropSafely(() => theme.palette.background.default),
  boxShadow: `0px 2px 4px -1px rgb(145 158 171 / 20%), 0px 4px 5px 0px rgb(145 158 171 / 14%), 0px 1px 10px 0px rgb(145 158 171 / 12%)`,
  width: themeLayout === "vertical" ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
  marginLeft:
    themeLayout === "vertical_collapsed"
      ? 0
      : themeLayout === "vertical"
      ? (COLLAPSE_WIDTH / 2) * 8
      : 0,
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    marginLeft: 0,
  },
}));
