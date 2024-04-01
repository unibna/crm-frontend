// Libraries
import map from "lodash/map";
import { Navigate } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import Loadable from "components/Loadings/Loadable";

// Constants & Utils
import { ROLE_TAB, STATUS_ROLE_MANAGE_FILE } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD } from "./paths";
import { UserType } from "_types_/UserType";
// ------

export const TAB_HEADER_MANAGE_FILE_ROUTER = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_MANAGE_FILE.MANAGE,
    component: <Manage />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.MANAGE_FILE]?.[STATUS_ROLE_MANAGE_FILE.MANAGE]
    ),
  },
  {
    value: STATUS_ROLE_MANAGE_FILE.GROUP,
    component: <Group />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.MANAGE_FILE]?.[STATUS_ROLE_MANAGE_FILE.GROUP]
    ),
  },
];

const useManageFileRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.MANAGE_FILE,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.MANAGE_FILE]
        )}
      >
        <ManageFile />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Navigate
            to={`/${PATH_DASHBOARD[ROLE_TAB.MANAGE_FILE][STATUS_ROLE_MANAGE_FILE.MANAGE]}`}
          />
        ),
      },
      ...map(TAB_HEADER_MANAGE_FILE_ROUTER(user, user?.group_permission?.data), (item) => ({
        path: item.value,
        element: (
          <ProtectedRoute user={user} hasPermission={item.roles}>
            {item.component}
          </ProtectedRoute>
        ),
      })),
    ],
  };
};

export default useManageFileRouter;

const ManageFile = Loadable(lazyWithRetry(() => import("views/ManageFileView")));
// Manage File
const Manage = Loadable(lazyWithRetry(() => import("views/ManageFileView/containers/Manage")));
const Group = Loadable(lazyWithRetry(() => import("views/ManageFileView/containers/Group")));
