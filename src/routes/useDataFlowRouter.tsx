// Libraries
import { Navigate } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

import LoadingScreen from "components/Loadings/LoadingScreen";
import Loadable from "components/Loadings/Loadable";

// Constant & Utils
import { isMatchRoles } from "utils/roleUtils";
import { ROLE_TAB, STATUS_ROLE_DATA_FLOW } from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { PATH_DASHBOARD } from "./paths";

const useDataFlowRouter = () => {
  const { user } = useAuth();
  return {
    path: ROLE_TAB.DATA_FLOW,
    element: user ? (
      isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.DATA_FLOW]) ? (
        <DataFlow />
      ) : (
        <Navigate to="*" />
      )
    ) : (
      <LoadingScreen />
    ),
    children: [
      {
        path: "",
        element: (
          <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.DATA_FLOW][STATUS_ROLE_DATA_FLOW.LIST]}`} />
        ),
      },
      {
        path: STATUS_ROLE_DATA_FLOW.LIST,
        element: user ? (
          isMatchRoles(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.DATA_FLOW]?.[STATUS_ROLE_DATA_FLOW.LIST]
          ) ? (
            <FlowList />
          ) : (
            <Navigate to="*" />
          )
        ) : (
          <LoadingScreen />
        ),
      },
      // {
      //   path: STATUS_ROLE_DATA_FLOW.HANDLE,
      //   element: user ? (
      //     isMatchRoles(user?.is_superuser,
      //       user?.group_permission?.data?.[ROLE_TAB.DATA_FLOW]?.[STATUS_ROLE_DATA_FLOW.HANDLE]
      //     ) ? (
      //       <FlowHandle />
      //     ) : (
      //       <Navigate to="*" />
      //     )
      //   ) : (
      //     <LoadingScreen />
      //   ),
      // },
      {
        path: STATUS_ROLE_DATA_FLOW.ACCOUNT,
        element: user ? (
          isMatchRoles(user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.DATA_FLOW]?.[STATUS_ROLE_DATA_FLOW.ACCOUNT]
          ) ? (
            <Attributes />
          ) : (
            <Navigate to="*" />
          )
        ) : (
          <LoadingScreen />
        ),
      },
      {
        path: ":flowId",
        element: user ? (
          isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.DATA_FLOW]) ? (
            <FlowHandle />
          ) : (
            <Navigate to="*" />
          )
        ) : (
          <LoadingScreen />
        ),
      },
    ],
  };
};
export default useDataFlowRouter;

const DataFlow = Loadable(lazyWithRetry(() => import("views/DataFlow")));
const FlowList = Loadable(lazyWithRetry(() => import("views/DataFlow/containers/FlowList")));
const FlowHandle = Loadable(lazyWithRetry(() => import("views/DataFlow/containers/FlowHandle")));
const Attributes = Loadable(lazyWithRetry(() => import("views/DataFlow/containers/Attributes")));
