// Libraries
import map from "lodash/map";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

// Components
import Loadable from "components/Loadings/Loadable";

// Hooks
import useAuth from "hooks/useAuth";

// Constants & Utils
import { ROLE_TAB, STATUS_ROLE_SHIPPING } from "constants/rolesTab";
import { redirectByPermission } from "utils/redirectUrlUtil";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

const SHIPPING_TAB_ROUTER = (user: Partial<UserType> | null, roles?: any) => [
  {
    value: STATUS_ROLE_SHIPPING.COMPLETED,
    label: "Chưa có mã vận đơn",
    component: <Completed />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.COMPLETED]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.ALL,
    label: "Tất cả phiếu giao hàng",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.ALL} />,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.ALL]),
  },
  {
    value: STATUS_ROLE_SHIPPING.PICKING,
    label: "Chờ lấy hàng",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.PICKING} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.PICKING]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.DELIVERING,
    label: "Đang giao hàng",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.DELIVERING} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.DELIVERING]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.WAIT_DELIVERY,
    label: "Chờ giao lại",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.WAIT_DELIVERY} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.WAIT_DELIVERY]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.RETURNING,
    label: "Đang hoàn",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.RETURNING} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.RETURNING]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.RETURNED,
    label: "Đã hoàn",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.RETURNED} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.RETURNED]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.SUCCESS,
    label: "Giao thành công",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.SUCCESS} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.SUCCESS]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.CANCELLED,
    label: "Đã hủy",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.CANCELLED} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.CANCELLED]
    ),
  },
  {
    value: STATUS_ROLE_SHIPPING.LOST,
    label: "Thất lạc",
    component: <TabContainer status={STATUS_ROLE_SHIPPING.LOST} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.LOST]
    ),
  },
];

const useShippingRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.SHIPPING);
  }, [user]);

  return [
    {
      path: ROLE_TAB.SHIPPING,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.SHIPPING]
          )}
        >
          <ShippingView />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Navigate to={routeDefault} />,
        },
        ...map(SHIPPING_TAB_ROUTER(user, user?.group_permission?.data), (item) => ({
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
      path: STATUS_ROLE_SHIPPING.REPORT,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.REPORT]
          )}
        >
          <Report />
        </ProtectedRoute>
      ),
    },
  ];
};

const ShippingView = Loadable(lazyWithRetry(() => import("views/ShippingView")));
const Report = Loadable(lazyWithRetry(() => import("views/ShippingView/containers/Report")));

// Shipping
const TabContainer = Loadable(
  lazyWithRetry(() => import("views/ShippingView/containers/TabContainer"))
);
const Completed = Loadable(lazyWithRetry(() => import("views/ShippingView/containers/Completed")));

export default useShippingRouter;
