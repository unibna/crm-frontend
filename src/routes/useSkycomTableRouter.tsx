// Libraries
import { Navigate, Outlet } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

import Loadable from "components/Loadings/Loadable";
import LoadingScreen from "components/Loadings/LoadingScreen";

// Constant & Utils
import { ROLE_TAB } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";

const useSkycomTableRouter = () => {
  const { user } = useAuth();
  return {
    path: ROLE_TAB.SKYCOM_TABLE,
    element: <Outlet />,
    children: [
      {
        path: `:id`,
        element: <TableView />,
      },
      {
        path: "",
        element: user ? (
          isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.SKYCOM_TABLE]) ? (
            <ListTableView />
          ) : (
            <Navigate to={`*`} />
          )
        ) : (
          <LoadingScreen />
        ),
      },
    ],
  };
};
export default useSkycomTableRouter;

const ListTableView = Loadable(lazyWithRetry(() => import("views/AirtableV2")));
const TableView = Loadable(lazyWithRetry(() => import("views/AirtableV2/containers/Table")));
