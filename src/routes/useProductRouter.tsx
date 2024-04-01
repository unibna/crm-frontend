// Libraries
import map from "lodash/map";
import { Navigate } from "react-router-dom";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import Loadable from "components/Loadings/Loadable";

// Constants & Utils
import {
  ROLE_TAB,
  STATUS_ROLE_ECOMMERCE,
  STATUS_ROLE_LIST_PRODUCT,
  STATUS_ROLE_PRODUCT,
} from "constants/rolesTab";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD, ROOT } from "./paths";
import { UserType } from "_types_/UserType";

//-----

export const TAB_HEADER_ECOMMERCE_ROUTER = (user: Partial<UserType> | null, roles?: any) => [
  {
    value: STATUS_ROLE_ECOMMERCE.ALL,
    component: <TabContainerEcommerce />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
  {
    value: STATUS_ROLE_ECOMMERCE.LAZADA,
    component: <TabContainerEcommerce />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
  {
    value: STATUS_ROLE_ECOMMERCE.TIKTOK,
    component: <TabContainerEcommerce />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
  {
    value: STATUS_ROLE_ECOMMERCE.SHOPEE,
    component: <TabContainerEcommerce />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
];

export const TAB_HEADER_LIST_PRODUCT_ROUTER = (user: Partial<UserType> | null, roles?: any) => [
  {
    value: STATUS_ROLE_LIST_PRODUCT.ALL,
    component: <TabContainerListProduct />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
    ),
  },
  {
    value: STATUS_ROLE_LIST_PRODUCT.SINGLE,
    component: <TabContainerListProduct />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
    ),
  },
  {
    value: STATUS_ROLE_LIST_PRODUCT.COMBO,
    component: <TabContainerListProduct />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
    ),
  },
];

const useProductRouter = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.PRODUCT,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.PRODUCT]
        )}
      >
        <ProductView />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Navigate
            to={`/${PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.LIST_PRODUCT][ROOT]}`}
          />
        ),
      },
      {
        path: STATUS_ROLE_PRODUCT.LIST_PRODUCT,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
            )}
          >
            <ListProduct />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.LIST_PRODUCT][
                    STATUS_ROLE_LIST_PRODUCT.SINGLE
                  ]
                }`}
              />
            ),
          },
          ...map(TAB_HEADER_LIST_PRODUCT_ROUTER(user, user?.group_permission?.data), (item) => ({
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
        path: STATUS_ROLE_PRODUCT.MAP_ECOMMERCE,
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
            )}
          >
            <Ecommerce />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.MAP_ECOMMERCE][
                    STATUS_ROLE_ECOMMERCE.ALL
                  ]
                }`}
              />
            ),
          },
          ...map(TAB_HEADER_ECOMMERCE_ROUTER(user, user?.group_permission?.data), (item) => ({
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
        path: ":variantId",
        element: (
          <ProtectedRoute
            user={user}
            hasPermission={isMatchRoles(
              user?.is_superuser,
              user?.group_permission?.data?.[ROLE_TAB.PRODUCT]
            )}
          >
            <DetailVariant />
          </ProtectedRoute>
        ),
      },
    ],
  };
};

export default useProductRouter;

const ListProduct = Loadable(
  lazyWithRetry(() => import("views/ProductView/containers/ListProduct"))
);
const Ecommerce = Loadable(lazyWithRetry(() => import("views/ProductView/containers/Ecommerce")));
const ProductView = Loadable(lazyWithRetry(() => import("views/ProductView")));
// Ecommerce
const TabContainerEcommerce = Loadable(
  lazyWithRetry(() => import("views/ProductView/containers/Ecommerce/TabContainer"))
);

const DetailVariant = Loadable(
  lazyWithRetry(() => import("views/ProductView/containers/DetailVariant"))
);

const TabContainerListProduct = Loadable(
  lazyWithRetry(() => import("views/ProductView/containers/ListProduct/TabContainer"))
);
