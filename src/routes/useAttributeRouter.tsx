import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";

// Components
import Loadable from "components/Loadings/Loadable";

// Constants
import { ROLE_TAB, STATUS_ROLE_ATTRIBUTE, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { redirectByPermission } from "utils/redirectUrlUtil";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

// --------

export const TAB_HEADER_ATTRIBUTE = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_ATTRIBUTE.SETTING,
    component: <SettingAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.SETTING]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.LEADS,
    component: <LeadCenterAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.TRANSPORTATION,
    component: <TransportationCarePage tabValue={STATUS_ROLE_TRANSPORTATION.ATTRIBUTE} />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.TRANSPORTATION]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.CDP,
    component: <CDPAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.CDP]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.ORDER,
    component: <OrderAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.ORDER]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.SHIPPING,
    component: <ShippingAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.SHIPPING]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.PRODUCT,
    component: <ProductAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.PRODUCT]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.WAREHOUSE,
    component: <WarehouseAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.WAREHOUSE]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.AIRTABLE,
    component: <AirtableAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.AIRTABLE]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.MANAGE_FILE,
    component: <FileManageAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.MANAGE_FILE]
    ),
  },
  {
    value: STATUS_ROLE_ATTRIBUTE.DATA_FLOW,
    component: <DataFlowAttribute />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.DATA_FLOW]
    ),
  },
];

const useAttributeRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.ATTRIBUTE);
  }, [user]);

  return {
    path: ROLE_TAB.ATTRIBUTE,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.ATTRIBUTE]
        )}
      >
        <AttributeView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={routeDefault} />,
      },
      ...map(TAB_HEADER_ATTRIBUTE(user, user?.group_permission?.data), (item) => ({
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

export default useAttributeRouter;

const AttributeView = Loadable(lazyWithRetry(() => import("views/AttributeView")));

// Attribute
const LeadCenterAttribute = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/AttributeTab"))
);

const CDPAttribute = Loadable(lazyWithRetry(() => import("views/CDPView/tabs/Attribute")));
const OrderAttribute = Loadable(lazyWithRetry(() => import("views/OrderView/tabs/Attribute")));
const ShippingAttribute = Loadable(
  lazyWithRetry(() => import("views/ShippingView/containers/Attributes"))
);
const ProductAttribute = Loadable(
  lazyWithRetry(() => import("views/ProductView/containers/AttributeTab"))
);
const WarehouseAttribute = Loadable(
  lazyWithRetry(() => import("views/WarehouseView/containers/Attributes"))
);
const AirtableAttribute = Loadable(
  lazyWithRetry(() => import("views/CskhView/containers/Attribute"))
);
const FileManageAttribute = Loadable(
  lazyWithRetry(() => import("views/ManageFileView/containers/Attributes"))
);
const SettingAttribute = Loadable(
  lazyWithRetry(() => import("views/SettingsView/containers/Attributes"))
);
const DataFlowAttribute = Loadable(
  lazyWithRetry(() => import("views/DataFlow/containers/Attributes"))
);

// Transportation V2
const TransportationCarePage = Loadable(
  lazyWithRetry(() => import("views/TransportationCareView/components/tabs/TransportationCareTab"))
);
