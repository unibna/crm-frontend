// Libraries
import map from "lodash/map";
import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";

// Components
import Loadable from "components/Loadings/Loadable";

// Hooks
import useAuth from "hooks/useAuth";

// Constants & Utils
import { ROLE_TAB } from "constants/rolesTab";
import { redirectByPermission } from "utils/redirectUrlUtil";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { ACCOUNTANT_PATH, PATH_DASHBOARD, ROOT } from "./paths";
// -------

const useAccountantRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.ACCOUNTANT);
  }, [user]);

  return {
    path: ROLE_TAB.ACCOUNTANT,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.ACCOUNTANT])}
      >
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.ACCOUNTANT]?.[ACCOUNTANT_PATH.REPORT]
            )}
          >
            <Navigate
              to={`/${PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.REPORT][ROOT]}`}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: ACCOUNTANT_PATH.REPORT,
        element: <ReportOrderDetailView />,
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.REPORT][
                    ACCOUNTANT_PATH.REPORT_ORDER
                  ]
                }`}
              />
            ),
          },
          ...map(TAB_HEADER_REPORT_ORDER_DETAIL_ROUTER(user?.group_permission?.data), (item) => ({
            path: item.value,
            element: (
              <ProtectedRoute user={user} hasPermission={item.roles}>
                {item.component}
              </ProtectedRoute>
            ),
          })),
        ],
      },
      {
        path: ACCOUNTANT_PATH.COLLATION,
        element: <CollationView />,
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.COLLATION][
                    ACCOUNTANT_PATH.COLLATION_PAYMENT
                  ]
                }`}
              />
            ),
          },
          ...map(TAB_COLLATION_ROUTER, (item) => ({
            path: item.value,
            element: (
              <ProtectedRoute user={user} hasPermission={item.roles}>
                {item.component}
              </ProtectedRoute>
            ),
          })),
        ],
      },
    ],
  };
};

const ReportOrderDetailView = Loadable(
  lazyWithRetry(() => import("views/AccountantView/containers/ReportOrderDetail"))
);

// report
const ReportOrder = Loadable(
  lazyWithRetry(() => import("views/AccountantView/containers/ReportOrderDetail/tabs/ReportOrder"))
);
const ReportOrderItem = Loadable(
  lazyWithRetry(() => import("views/AccountantView/containers/ReportOrderDetail/tabs/ReportOrderItem"))
);
const ReportOrderKpi = Loadable(
  lazyWithRetry(() => import("views/AccountantView/containers/ReportOrderDetail/tabs/ReportOrderKpi"))
);

// collation
const CollationView = Loadable(lazyWithRetry(() => import("views/AccountantView/containers/Collation")));
const Collation = Loadable(
  lazyWithRetry(() => import("views/AccountantView/containers/Collation/tabs/Collation"))
);
const PushPaymentExcelHistory = Loadable(
  lazyWithRetry(() => import("views/AccountantView/containers/Collation/tabs/PushPaymentExcelHistory"))
);

export default useAccountantRouter;

export const TAB_HEADER_REPORT_ORDER_DETAIL_ROUTER = (roles: any) => [
  {
    value: ACCOUNTANT_PATH.REPORT_ORDER,
    roles: true,
    component: <ReportOrder />,
  },
  {
    value: ACCOUNTANT_PATH.REPORT_ORDER_ITEM,
    roles: true,
    component: <ReportOrderItem />,
  },
  {
    value: ACCOUNTANT_PATH.REPORT_KPI,
    roles: true,
    component: <ReportOrderKpi />,
  },
];

export const TAB_COLLATION_ROUTER = [
  {
    value: ACCOUNTANT_PATH.COLLATION_PAYMENT,
    roles: true,
    component: <Collation />,
  },
  {
    value: ACCOUNTANT_PATH.IMPORT_EXCEL_HISTORY,
    roles: true,
    component: <PushPaymentExcelHistory />,
  },
];
