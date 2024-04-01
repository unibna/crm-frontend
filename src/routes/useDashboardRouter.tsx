import Loadable from "components/Loadings/Loadable";
import { ROLE_TAB, STATUS_ROLE_DASHBOARD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";

const useDashboarRouter = () => {
  const { user } = useAuth();

  return [
    {
      path: STATUS_ROLE_DASHBOARD.DASHBOARD,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.DASHBOARD]?.[STATUS_ROLE_DASHBOARD.DASHBOARD]
          )}
        >
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_DASHBOARD.MKT_DASHBOARD,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.DASHBOARD]?.[
              STATUS_ROLE_DASHBOARD.MKT_DASHBOARD
            ]
          )}
        >
          <DashboardMKT />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_DASHBOARD.SALE_DASHBOARD,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.DASHBOARD]?.[
              STATUS_ROLE_DASHBOARD.SALE_DASHBOARD
            ]
          )}
        >
          <DashboardSale />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_DASHBOARD.SALE_ONLINE_REPORT,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.SALE_ONLINE_REPORT]?.[
              STATUS_ROLE_DASHBOARD.SALE_ONLINE_REPORT
            ]
          )}
        >
          <SaleOnlineReportView />
        </ProtectedRoute>
      ),
    },
  ];
};

export default useDashboarRouter;

const Dashboard = Loadable(lazyWithRetry(() => import("views/DashboardView")));
const DashboardMKT = Loadable(lazyWithRetry(() => import("views/DashboardMKTView")));
const DashboardSale = Loadable(lazyWithRetry(() => import("views/DashboardSaleView")));
const SaleOnlineReportView = Loadable(lazyWithRetry(() => import("views/SaleOnlineReportView")));
