// components
import LoadingScreen from "components/Loadings/LoadingScreen";
import useAuth from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { ROLE_TAB, STATUS_ROLE_ZALO } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import Loadable from "components/Loadings/Loadable";
import { PATH_DASHBOARD } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

const useZaloRouter = () => {
  const { user } = useAuth();

  return {
    path: "zalo",
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.ZALO]
        )}
      >
        <ZaloView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.DASHBOARD]}`} />,
      },
      {
        path: STATUS_ROLE_ZALO.DASHBOARD,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.ZALO]?.[STATUS_ROLE_ZALO.DASHBOARD]
            )}
          >
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_ZALO.FOLLOWER_ACCOUNT,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.ZALO]?.[STATUS_ROLE_ZALO.FOLLOWER_ACCOUNT]
            )}
          >
            <FollowerAccount />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_ZALO.NOTIFICATION,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.ZALO]?.[STATUS_ROLE_ZALO.NOTIFICATION]
            )}
          >
            <Notification />
          </ProtectedRoute>
        ),
      },
    ],
  };
};

export default useZaloRouter;

const ZaloView = Loadable(lazyWithRetry(() => import("views/ZaloView")));
const Notification = Loadable(
  lazyWithRetry(() => import("views/ZaloView/containers/Notification"))
);
const FollowerAccount = Loadable(
  lazyWithRetry(() => import("views/ZaloView/containers/FollowerAccount"))
);
const Dashboard = Loadable(lazyWithRetry(() => import("views/ZaloView/containers/Dashboard")));
