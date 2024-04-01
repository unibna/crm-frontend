import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { Navigate, Outlet } from "react-router-dom";

// Constants
import Loadable from "components/Loadings/Loadable";
import LoadingScreen from "components/Loadings/LoadingScreen";
import { ROLE_TAB, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import { PATH_DASHBOARD, ROOT } from "./paths";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";
// -----

export const TRANSPORTATION_TABS_ROUTER = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_TRANSPORTATION.ALL,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.ALL} />,
  },
  {
    value: STATUS_ROLE_TRANSPORTATION.NEW,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.NEW} />,
  },
  {
    value: STATUS_ROLE_TRANSPORTATION.PENDING,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.PENDING} />,
  },
  {
    value: STATUS_ROLE_TRANSPORTATION.PROCESSING,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.PROCESSING} />,
  },
  {
    value: STATUS_ROLE_TRANSPORTATION.HANDLED,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.HANDLED} />,
  },
  {
    value: STATUS_ROLE_TRANSPORTATION.COMPLETED,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.COMPLETED} />,
  },
];

const useTransportationCareRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.TRANSPORTATION,
    element: <Outlet />,
    children: [
      {
        path: "",
        element: (
          <Navigate
            to={`/${
              PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][ROOT]
            }`}
          />
        ),
      },
      {
        path: STATUS_ROLE_TRANSPORTATION.STATUS,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION]?.[
                STATUS_ROLE_TRANSPORTATION.STATUS
              ]
            )}
          >
            <TransportationView />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
                    STATUS_ROLE_TRANSPORTATION.ALL
                  ]
                }`}
              />
            ),
          },
          ...map(TRANSPORTATION_TABS_ROUTER(user, user?.group_permission?.data), (item) => ({
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
        path: STATUS_ROLE_TRANSPORTATION.REPORT_ASSIGNED,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.TRANSPORTATION]?.[
                STATUS_ROLE_TRANSPORTATION.REPORT_ASSIGNED
              ]
            )}
          >
            <TransportationAssignedReport />
          </ProtectedRoute>
        ),
      },
    ],
  };
};

export default useTransportationCareRouter;

const TransportationView = Loadable(lazyWithRetry(() => import("views/TransportationCareView")));
const TransportationCarePage = Loadable(
  lazyWithRetry(() => import("views/TransportationCareView/components/tabs/TransportationCareTab"))
);
const TransportationAssignedReport = Loadable(
  lazyWithRetry(() => import("views/TransportationCareView/components/Report"))
);
