// Libraries
import map from "lodash/map";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import Loadable from "components/Loadings/Loadable";

// Constants & Utils
import { TypeWarehouseSheet } from "_types_/WarehouseType";
import { ROLE_TAB, STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import { redirectByPermission } from "utils/redirectUrlUtil";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

// -------------------------------------------------------------------

export const TAB_WAREHOUSE_ROUTER = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_WAREHOUSE.LIST_WAREHOUSE,
    component: <ListWarehouse />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.LIST_WAREHOUSE]
    ),
  },
  {
    value: STATUS_ROLE_WAREHOUSE.IMPORTS,
    component: <Imports />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.IMPORTS]
    ),
  },
  {
    value: STATUS_ROLE_WAREHOUSE.EXPORTS,
    component: <Exports />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.EXPORTS]
    ),
  },
  {
    value: STATUS_ROLE_WAREHOUSE.TRANSFER,
    component: <Transfer />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.TRANSFER]
    ),
  },
  {
    value: STATUS_ROLE_WAREHOUSE.STOCKTAKING,
    component: <Stocktakings />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.STOCKTAKING]
    ),
  },
  {
    value: STATUS_ROLE_WAREHOUSE.SCAN_LOGS,
    component: <ScanLogs />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.SCAN_LOGS]
    ),
  },
  {
    value: STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS,
    component: <WarehouseLogs />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS]
    ),
  },
];

const useWarehouseRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.WAREHOUSE);
  }, [user]);

  return [
    {
      path: ROLE_TAB.WAREHOUSE,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]
          )}
        >
          <WarehouseView />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Navigate to={routeDefault} />,
        },
        ...map(TAB_WAREHOUSE_ROUTER(user, user?.group_permission?.data), (item) => ({
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
      path: STATUS_ROLE_WAREHOUSE.SCAN_EXPORT,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.SCAN_EXPORT]
          )}
        >
          <ScanOptionV2 type={TypeWarehouseSheet.EXPORTS} />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]?.[
              STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY
            ]
          )}
        >
          <ReportInventory />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_WAREHOUSE.SCAN_LOGS,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.SCAN_LOGS]
          )}
        >
          <ScanLogs />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]?.[
              STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS
            ]
          )}
        >
          <WarehouseLogs />
        </ProtectedRoute>
      ),
    },
    {
      path: `${STATUS_ROLE_WAREHOUSE.SHEET}/new/:type`,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]
          )}
        >
          <SheetOperation />
        </ProtectedRoute>
      ),
    },
    {
      path: `${STATUS_ROLE_WAREHOUSE.SHEET}/:sheetId`,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.SHEET]
          )}
        >
          <DetailSheet />
        </ProtectedRoute>
      ),
    },
    {
      path: STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY_ACTIVITIES,
      element: (
        <ProtectedRoute
          user={user}
          hasPermission={isMatchRoles(
            user?.is_superuser,
            user?.group_permission?.data?.[ROLE_TAB.WAREHOUSE]?.[
              STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY_ACTIVITIES
            ]
          )}
        >
          <ReportInventoryActivitiesView />
        </ProtectedRoute>
      ),
    },
  ];
};

export default useWarehouseRouter;

const WarehouseView = Loadable(lazyWithRetry(() => import("views/WarehouseView")));
const ReportInventory = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/ReportInventory"))
);
const DetailSheet = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/DetailSheet"))
);
const SheetOperation = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/SheetOperation"))
);

const ScanOptionV2 = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/components/ScanModal/ScanOptionV2"))
);
const ScanLogs = Loadable(lazyWithRetry(() => import("views/WarehouseView/containers/ScanLogs")));

// Warehouse
const Imports = Loadable(lazyWithRetry(() => import("views/WarehouseView/containers/Imports")));
const ListWarehouse = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/ListWarehouse"))
);
const Exports = Loadable(lazyWithRetry(() => import("views/WarehouseView/containers/Exports")));
const Transfer = Loadable(lazyWithRetry(() => import("views/WarehouseView/containers/Transfer")));
const Stocktakings = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/Stocktakings"))
);
const WarehouseLogs = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/components/WarehouseLogs"))
);
const ReportInventoryActivitiesView = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/ReportInventoryActivities"))
);
