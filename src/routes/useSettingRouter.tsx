// Libraries
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import map from "lodash/map";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import Loadable from "components/Loadings/Loadable";
import LoadingScreen from "components/Loadings/LoadingScreen";

// Constants
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { ROLE_TAB, STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import { redirectByPermission } from "utils/redirectUrlUtil";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

export const TAB_HEADER_SETTING = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT,
    component: <SkylinkAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT,
    component: <FacebookAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT,
    component: <AdAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT,
    component: <FanpageAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM,
    component: <GoogleAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT,
    component: <CustomerAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT,
    component: <TiktokBmAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT,
    component: <TiktokAdsAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT,
    component: <TiktokAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT,
    component: <LazadaAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT,
    component: <ShopeeAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.ZALO_ACCOUNT,
    component: <ZaloAccount />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_SETTINGS.ROLE,
    component: <AppRole />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.ROLE]
    ),
  },
];

const useSettingRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.SETTINGS);
  }, [user]);

  return {
    path: ROLE_TAB.SETTINGS,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.SETTINGS]
        )}
      >
        <SettingsView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={routeDefault} />,
      },
      ...map(TAB_HEADER_SETTING(user, user?.group_permission?.data), (item) => ({
        path: item.value,
        element: (
          <ProtectedRoute user={user} hasPermission={item.roles}>
            {item.component}
          </ProtectedRoute>
        ),
      })),
    ],
  };
};

export default useSettingRouter;

const SettingsView = Loadable(lazyWithRetry(() => import("views/SettingsView")));

// Settings
const SkylinkAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/SkylinkAccount"))
);
const FacebookAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/FacebookAccount"))
);
const AdAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/AdAccount"))
);
const FanpageAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/FanpageAccount"))
);
const GoogleAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/GoogleAccount"))
);
const CustomerAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/CustomerAccount"))
);
const TiktokAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/TiktokShopAccount"))
);
const TiktokBmAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/TiktokBmAccount"))
);
const TiktokAdsAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/TiktokAdsAccount"))
);
const LazadaAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/LazadaAccount"))
);
const ShopeeAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/ShopeeAccount"))
);
const ZaloAccount = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/ZaloAccount"))
);
const AppRole = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/AppRoleV2"))
);
