import Loadable from "components/Loadings/Loadable";
import { PROMOTION_ROLES, ROLE_TAB } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD } from "./paths";

export const usePromotionRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.PROMOTION,
    element: <Outlet />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(user?.is_superuser,user?.group_permission?.data?.[ROLE_TAB.PROMOTION])}
          >
            <PromotionView />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ``,
            element: (
              <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.PROMOTION][PROMOTION_ROLES.ALL]}`} />
            ),
          },
          {
            path: PROMOTION_ROLES.ALL,
            element: <AllPromotionTab />,
          },
          {
            path: PROMOTION_ROLES.ACTIVE,
            element: <ActiveTab />,
          },
          ,
          {
            path: PROMOTION_ROLES.INACTIVE,
            element: <InActiveTab />,
          },
          {
            path: PROMOTION_ROLES.DEACTIVED,
            element: <DeActivedTab />,
          },
        ],
      },
      {
        path: `:id`,
        element: <PromotionDetail />,
      },
    ],
  };
};

const PromotionView = Loadable(lazyWithRetry(() => import("views/PromotionView")));
const AllPromotionTab = Loadable(lazyWithRetry(() => import("views/PromotionView/tabs/AllTab")));
const ActiveTab = Loadable(lazyWithRetry(() => import("views/PromotionView/tabs/ActiveTab")));
const InActiveTab = Loadable(lazyWithRetry(() => import("views/PromotionView/tabs/InActiveTab")));
const DeActivedTab = Loadable(lazyWithRetry(() => import("views/PromotionView/tabs/DeActivedTab")));
const PromotionDetail = Loadable(
  lazyWithRetry(() => import("views/PromotionView/components/PromotionDetailPage"))
);
