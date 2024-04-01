// Libraries
import { useMemo } from "react";
import useAuth from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import map from "lodash/map";

// Components
import LoadingScreen from "components/Loadings/LoadingScreen";
import Loadable from "components/Loadings/Loadable";

// Utils
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { ROLE_TAB, STATUS_ROLE_GOOGLE } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import { redirectByPermission } from "utils/redirectUrlUtil";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

// ------

export const TAB_HEADER_REPORT_GOOGLE_ROUTER = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_GOOGLE.CUSTOMER_ACCOUNT,
    component: <Customer />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.CUSTOMER_ACCOUNT]
    ),
  },
  {
    value: STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE,
    component: <Campaign />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE]
    ),
  },
  {
    value: STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE,
    component: <AdGroup />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE]
    ),
  },
  {
    value: STATUS_ROLE_GOOGLE.AD_GOOGLE,
    component: <Ad />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.AD_GOOGLE]
    ),
  },
];

const useGoogleRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.GOOGLE);
  }, [user]);

  return {
    path: ROLE_TAB.GOOGLE,
    element: user ? (
      isMatchRoles(user?.is_superuser, user.group_permission?.data?.[ROLE_TAB.GOOGLE]) ? (
        <ReportGoogleView />
      ) : (
        <Navigate to={`*`} />
      )
    ) : (
      <LoadingScreen />
    ),
    children: [
      {
        path: "",
        element: <Navigate to={routeDefault} />,
      },
      ...map(TAB_HEADER_REPORT_GOOGLE_ROUTER(user, user?.group_permission?.data), (item) => ({
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

export default useGoogleRouter;

const ReportGoogleView = Loadable(lazyWithRetry(() => import("views/ReportGoogleView")));

// Google
const Customer = Loadable(
  lazyWithRetry(() => import("views/ReportGoogleView/containers/Customer"))
);
const Campaign = Loadable(
  lazyWithRetry(() => import("views/ReportGoogleView/containers/Campaign"))
);
const AdGroup = Loadable(lazyWithRetry(() => import("views/ReportGoogleView/containers/AdGroup")));
const Ad = Loadable(lazyWithRetry(() => import("views/ReportGoogleView/containers/Ad")));
