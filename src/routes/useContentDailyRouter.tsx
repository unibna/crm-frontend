// Libraries
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

// Components
import Loadable from "components/Loadings/Loadable";

// Utils
import { ROLE_TAB, STATUS_ROLE_CONTENT_DAILY } from "constants/rolesTab";
import { redirectByPermission } from "utils/redirectUrlUtil";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

// -------------------

export const TAB_HEADER_REPORT_CONTENT_DAILY_ROUTER = (
  user: Partial<UserType> | null,
  roles: any
) => [
  {
    value: STATUS_ROLE_CONTENT_DAILY.OVERVIEW,
    component: <Overview />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_DAILY]?.[STATUS_ROLE_CONTENT_DAILY.OVERVIEW]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_DAILY.PIVOT,
    component: <PivotTable />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_DAILY]?.[STATUS_ROLE_CONTENT_DAILY.PIVOT]
    ),
  },
];

const useContentDailyRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.CONTENT_DAILY);
  }, [user]);

  return {
    path: ROLE_TAB.CONTENT_DAILY,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.CONTENT_DAILY]
        )}
      >
        <ContentDailyView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={routeDefault} />,
      },
      ...map(
        TAB_HEADER_REPORT_CONTENT_DAILY_ROUTER(user, user?.group_permission?.data),
        (item) => ({
          path: item.value,
          element: (
            <ProtectedRoute user={user} hasPermission={item.roles}>
              {item.component}
            </ProtectedRoute>
          ),
        })
      ),
    ],
  };
};

const ContentDailyView = Loadable(lazyWithRetry(() => import("views/ContentDailyView")));

// Content ID
const Overview = Loadable(
  lazyWithRetry(() => import("views/ContentDailyView/containers/Overview"))
);
const PivotTable = Loadable(
  lazyWithRetry(() => import("views/ContentDailyView/containers/PivotTable"))
);

export default useContentDailyRouter;
