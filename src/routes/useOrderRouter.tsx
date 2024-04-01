// Libraries
import { Navigate, Outlet } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

import Loadable from "components/Loadings/Loadable";

// Constant & Utils
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD, ORDER_PATH, ROOT } from "./paths";

const useOrderRouter = () => {
  const { user } = useAuth();
  return {
    path: ROLE_TAB.ORDERS,
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ROOT]}`} />,
      },
      {
        path: `:id`,
        element: <OrderDetailPage />,
      },
      {
        path: ORDER_PATH.LIST,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.ORDERS])}
          >
            <OrderView />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ``,
            element: (
              <Navigate
                to={`/${PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ORDER_PATH.ALL]}`}
              />
            ),
          },
          {
            path: ORDER_PATH.DRAFT,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
                )}
              >
                <Draft />
              </ProtectedRoute>
            ),
          },
          {
            path: ORDER_PATH.COMPLETED,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
                )}
              >
                <Completed />
              </ProtectedRoute>
            ),
          },
          {
            path: ORDER_PATH.CANCEL,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
                )}
              >
                <Canceled />
              </ProtectedRoute>
            ),
          },
          {
            path: ORDER_PATH.ALL,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
                )}
              >
                <All />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  };
};
export default useOrderRouter;

const OrderView = Loadable(lazyWithRetry(() => import("views/OrderView")));
const All = Loadable(lazyWithRetry(() => import("views/OrderView/tabs/All")));
const Draft = Loadable(lazyWithRetry(() => import("views/OrderView/tabs/Draft")));
const Canceled = Loadable(lazyWithRetry(() => import("views/OrderView/tabs/Canceled")));
const Completed = Loadable(lazyWithRetry(() => import("views/OrderView/tabs/Completed")));
const OrderDetailPage = Loadable(
  lazyWithRetry(() => import("views/OrderView/components/OrderDetailPage"))
);
