// Libraries
import { Navigate, Outlet } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import Loadable from "components/Loadings/Loadable";

// Constants
import { ROLE_TAB, STATUS_ROLE_FACEBOOK } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD } from "./paths";

const useFacebookRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.FACEBOOK,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.FACEBOOK])}
      >
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Navigate
            to={`/${PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.AD_FACEBOOK]}`}
          />
        ),
      },
      {
        path: STATUS_ROLE_FACEBOOK.AD_FACEBOOK,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.FACEBOOK]?.[STATUS_ROLE_FACEBOOK.AD_FACEBOOK]
            )}
          >
            <AdFacebookView />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_FACEBOOK.AD_FANPAGE,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.FACEBOOK]?.[STATUS_ROLE_FACEBOOK.AD_FANPAGE]
            )}
          >
            <FanpageView />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.FACEBOOK]?.[
                STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK
              ]
            )}
          >
            <ReportFacebookView />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_FACEBOOK.REPORT_AD_FANPAGE,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.FACEBOOK]?.[
                STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK
              ]
            )}
          >
            <ReportFanpageView />
          </ProtectedRoute>
        ),
      },
    ],
  };
};

export default useFacebookRouter;

const ReportFacebookView = Loadable(lazyWithRetry(() => import("views/ReportFacebookView")));
const AdFacebookView = Loadable(lazyWithRetry(() => import("views/AdFacebookView")));
const FanpageView = Loadable(lazyWithRetry(() => import("views/FanpageView")));
const ReportFanpageView = Loadable(lazyWithRetry(() => import("views/ReportFanpageView")));
