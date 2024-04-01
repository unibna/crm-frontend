//components
import Loadable from "components/Loadings/Loadable";
import { Page } from "components/Page";
import { Navigate, Outlet } from "react-router-dom";

//hooks
import useAuth from "hooks/useAuth";

//utils
import { ROLE_TAB, STATUS_ROLE_CDP } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD, ROOT } from "./paths";

export const useCDPRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.CDP,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={
          isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.USERS]
          ) ||
          isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.REPORTS]
          )
        }
      >
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: `/${ROLE_TAB.CDP}`,
        element: <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][ROOT]}`} />,
      },
      {
        path: STATUS_ROLE_CDP.USERS,
        element: <CDPWrapper />,
        children: [
          {
            path: ``,
            element: (
              <Navigate
                to={`/${PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][STATUS_ROLE_CDP.LIST]}`}
              />
            ),
          },
          {
            path: STATUS_ROLE_CDP.LIST,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser, [
                  user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.USERS],
                ])}
              >
                <CustomerView />
              </ProtectedRoute>
            ),
          },
          {
            path: STATUS_ROLE_CDP.EXTERNAL_USERS,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser, [
                  user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.USERS],
                ])}
              >
                <ExternalView />
              </ProtectedRoute>
            ),
          },
          {
            path: STATUS_ROLE_CDP.REPORTS,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(user?.is_superuser, [
                  user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.REPORTS],
                ])}
              >
                <ReportView />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: STATUS_ROLE_CDP.DETAIL,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.HANDLE]
            )}
          >
            <Page title="Chi tiết khách hàng" style={{ paddingTop: 8 }}>
              <CustomerDetail
                isMutationNote
                isMutationCustomer
                isShowTimeline
                isShowTableDetail
                overviewLayoutColumns={{
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 2,
                  xl: 3,
                }}
                isSearchCustomer
              />
            </Page>
          </ProtectedRoute>
        ),
      },
    ],
  };
};

const CustomerDetail = Loadable(
  lazyWithRetry(() => import("views/CDPView/components/CustomerDetail"))
);
const CDPWrapper = Loadable(lazyWithRetry(() => import("views/CDPView")));
const ReportView = Loadable(lazyWithRetry(() => import("views/CDPView/tabs/Report")));
const CustomerView = Loadable(lazyWithRetry(() => import("views/CDPView/tabs/Customer")));
const ExternalView = Loadable(lazyWithRetry(() => import("views/CDPView/tabs/External")));
