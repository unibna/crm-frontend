import { styled } from "@mui/material";
import LogoImage from "components/Images/LogoImage";
import Loadable from "components/Loadings/Loadable";
import LoadingScreen from "components/Loadings/LoadingScreen";
import useAuth from "hooks/useAuth";
import { Navigate, Outlet, Link as RouterLink, useRoutes } from "react-router-dom";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import useAccountantRouter from "./useAccountantRouter";
import useAirtableRouter from "./useAirtableRouter";
import useAttributeRouter from "./useAttributeRouter";
import { useCDPRouter } from "./useCDPRouter";
import useContentDailyRouter from "./useContentDailyRouter";
import useContentIdRouter from "./useContentIdRouter";
import useDashboarRouter from "./useDashboardRouter";
import useDataFlowRouter from "./useDataFlowRouter";
import useFacebookRouter from "./useFacebookRouter";
import useGoogleRouter from "./useGoogleRouter";
import { usePhoneRoute } from "./useLeadsRouter";
import useManageFileRouter from "./useManageFileRouter";
import useOrderRouter from "./useOrderRouter";
import useProductRouter from "./useProductRouter";
import { usePromotionRouter } from "./usePromoRouter";
import useReportRevenueRouter from "./useReportRevenueRouter";
import useSettingRouter from "./useSettingRouter";
import useShippingRouter from "./useShippingRouter";
import useSkycomTableRouter from "./useSkycomTableRouter";
import useTransportationCareRouter from "./useTransportationCareRouter";
import useWarehouseRouter from "./useWarehouseRouter";
import useZaloRouter from "./useZaloRouter";

// ----------------------------------------------------------------------

const Router = () => {
  const { user } = useAuth();

  let defaultRoute = user?.group_permission?.route
    ? user?.group_permission?.route
    : user?.is_superuser
    ? "/dashboard"
    : "";
  
  return useRoutes([
    {
      path: "login",
      element: <LoginView />,
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          // element: user ? (
          //   user.group_permission?.route ? (
          //     <Navigate to={defaultRoute} replace />
          //   ) : (
          //     <Navigate to={`/login`} replace />
          //   )
          // ) : (
          //   <LoadingScreen />
          // ),
        },
        { path: "version", element: <VersionView /> },
        { path: "profile", element: <ProfileView /> },
        { path: "support", element: <SupportView /> },
        ...useDashboarRouter(),
        useZaloRouter(),
        usePhoneRoute(),
        useSettingRouter(),
        useManageFileRouter(),
        useFacebookRouter(),
        useContentIdRouter(),
        useContentDailyRouter(),
        useGoogleRouter(),
        useCDPRouter(),
        useProductRouter(),
        ...useWarehouseRouter(),
        useAirtableRouter(),
        useReportRevenueRouter(),
        useTransportationCareRouter(),
        useOrderRouter(),
        usePromotionRouter(),
        ...useShippingRouter(),
        useAttributeRouter(),
        useAccountantRouter(),
        useSkycomTableRouter(),
        useDataFlowRouter(),
      ],
    },

    {
      path: "*",
      element: <RedirectLogo />,
      children: [
        { path: "404", element: <NotFoundView /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "terms-of-service",
      element: <TermsOfService />,
    },
    {
      path: "privacy",
      element: <Privacy />,
    },
  ]);
};

// IMPORT COMPONENTS
const NotFoundView = Loadable(lazyWithRetry(() => import("views/NotFoundView")));
const VersionView = Loadable(lazyWithRetry(() => import("views/VersionView")));
const ProfileView = Loadable(lazyWithRetry(() => import("views/ProfileView")));
const LoginView = Loadable(lazyWithRetry(() => import("views/AuthView/containers/Login")));
const DashboardLayout = Loadable(lazyWithRetry(() => import("layouts")));
const SupportView = Loadable(lazyWithRetry(() => import("views/UserManual")));

const Privacy = Loadable(lazyWithRetry(() => import("views/PrivacyView")));
const TermsOfService = Loadable(lazyWithRetry(() => import("views/TermOfServiceView")));

export default Router;

function RedirectLogo() {
  return (
    <>
      <HeaderStyle>
        <RouterLink to="/">
          <LogoImage />
        </RouterLink>
      </HeaderStyle>
      <Outlet />
    </>
  );
}

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: "100%",
  position: "absolute",
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(5, 5, 0),
  },
}));
