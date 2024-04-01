// Libraries
import { Navigate } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import Loadable from "components/Loadings/Loadable";

// Constants & Utils
import { ROLE_TAB, STATUS_ROLE_AIRTABLE } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD } from "./paths";

const useAirtableRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.CSKH,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.CSKH])}
      >
        <CustomerCareView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.CSKH][STATUS_ROLE_AIRTABLE.ALL]}`} />,
      },
      {
        path: STATUS_ROLE_AIRTABLE.ALL,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.CSKH])}
          >
            <CustomerCareContainer />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_AIRTABLE.NEW,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.CSKH])}
          >
            <CustomerCareContainer status={STATUS_ROLE_AIRTABLE.NEW} />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_AIRTABLE.HANDLING,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.CSKH])}
          >
            <CustomerCareContainer status={STATUS_ROLE_AIRTABLE.HANDLING} />
          </ProtectedRoute>
        ),
      },
      {
        path: STATUS_ROLE_AIRTABLE.COMPLETED,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.CSKH])}
          >
            <CustomerCareContainer status={STATUS_ROLE_AIRTABLE.COMPLETED} />
          </ProtectedRoute>
        ),
      },
    ],
  };
};

export default useAirtableRouter;

const CustomerCareView = Loadable(
  lazyWithRetry(() => import("views/CskhView/containers/CustomerCare"))
);

const CustomerCareContainer = Loadable(
  lazyWithRetry(() => import("views/CskhView/containers/CustomerCare/CustomerCareContainer"))
);
