// Libraries
import map from "lodash/map";
import { Navigate } from "react-router-dom";

// Components
import Loadable from "components/Loadings/Loadable";
import LoadingScreen from "components/Loadings/LoadingScreen";

// Hooks
import useAuth from "hooks/useAuth";

// Constants & Utils
import { ROLE_TAB, STATUS_ROLE_REPORT_REVENUE } from "constants/rolesTab";
import { useMemo } from "react";
import { redirectByPermission } from "utils/redirectUrlUtil";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

// ----------------------

export const TAB_HEADER_REPORT_REVENUE_ROUTER = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_REPORT_REVENUE.BY_DATE,
    component: <TabContainerReportRevenue status={STATUS_ROLE_REPORT_REVENUE.BY_DATE} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_DATE]
    ),
  },
  {
    value: STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL,
    component: <TabContainerReportRevenue status={STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL]
    ),
  },
  {
    value: STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT,
    component: <TabContainerReportRevenue status={STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]
    ),
  },
  {
    value: STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE,
    component: <TabContainerReportRevenue status={STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE]
    ),
  },
  {
    value: STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY,
    component: <TabContainerReportRevenue status={STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY]
    ),
  },
];

const useReportRevenueRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.REPORT_REVENUE);
  }, [user]);

  return {
    path: ROLE_TAB.REPORT_REVENUE,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.REPORT_REVENUE]
        )}
      >
        <ReportRevenueView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={routeDefault} />,
      },
      ...map(TAB_HEADER_REPORT_REVENUE_ROUTER(user, user?.group_permission?.data), (item) => ({
        path: item.value,
        element: user ? <>{item.component}</> : <LoadingScreen />,
      })),
    ],
  };
};

const ReportRevenueView = Loadable(lazyWithRetry(() => import("views/ReportRevenueView")));

// Report Revenue
const TabContainerReportRevenue = Loadable(
  lazyWithRetry(() => import("views/ReportRevenueView/containers/TabContainer"))
);

export default useReportRevenueRouter;
