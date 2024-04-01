// Libraries
import { useMemo } from "react";
import useAuth from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import map from "lodash/map";

// Components
import Loadable from "components/Loadings/Loadable";
import LoadingScreen from "components/Loadings/LoadingScreen";

// Utils
import { ROLE_TAB, STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { redirectByPermission } from "utils/redirectUrlUtil";
import ProtectedRoute from "./ProtectedRoute";
import { UserType } from "_types_/UserType";

// -------------------------------------------------------------------------------

export const TAB_HEADER_REPORT_CONTENT_ID_ROUTER = (user: Partial<UserType> | null, roles: any) => [
  {
    value: STATUS_ROLE_CONTENT_ID.TOTAL,
    component: <Total />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.TOTAL]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.FACEBOOK,
    component: <Facebook />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.FACEBOOK]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.GOOGLE,
    component: <Google />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.GOOGLE]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.TIKTOK,
    component: <Tiktok />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.TIKTOK]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.PHONE_LEAD,
    component: <PhoneLead />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.PHONE_LEAD]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.ATTACH_PHONE,
    component: <AttachPhoneTabs />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.ATTACH_PHONE]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.PIVOT,
    component: <Pivot />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.PIVOT]
    ),
  },
  {
    value: STATUS_ROLE_CONTENT_ID.ATTRIBUTES,
    component: <Attributes />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.ATTRIBUTES]
    ),
  },
];

const useContentIdRouter = () => {
  const { user } = useAuth();

  const routeDefault = useMemo(() => {
    return redirectByPermission(user, ROLE_TAB.CONTENT_ID);
  }, [user]);

  return {
    path: ROLE_TAB.CONTENT_ID,
    element: user ? (
      isMatchRoles(user?.is_superuser, user.group_permission?.data?.[ROLE_TAB.CONTENT_ID]) ? (
        <ReportContentIdView />
      ) : (
        <Navigate to={`*`} />
      )
    ) : (
      <LoadingScreen />
    ),
    children: [
      {
        path: "",
        element: <Navigate to={routeDefault} />,
      },
      ...map(TAB_HEADER_REPORT_CONTENT_ID_ROUTER(user, user?.group_permission?.data), (item) => ({
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

const ReportContentIdView = Loadable(lazyWithRetry(() => import("views/ReportContentIdView")));

// Content ID
const Total = Loadable(lazyWithRetry(() => import("views/ReportContentIdView/containers/Total")));
const PhoneLead = Loadable(
  lazyWithRetry(() => import("views/ReportContentIdView/containers/PhoneLead"))
);
const AttachPhoneTabs = Loadable(
  lazyWithRetry(() => import("views/ReportContentIdView/containers/AttachPhone"))
);
const Facebook = Loadable(
  lazyWithRetry(() => import("views/ReportContentIdView/containers/Facebook"))
);
const Google = Loadable(lazyWithRetry(() => import("views/ReportContentIdView/containers/Google")));
const Tiktok = Loadable(lazyWithRetry(() => import("views/ReportContentIdView/containers/Tiktok")));
const Attributes = Loadable(
  lazyWithRetry(() => import("views/ReportContentIdView/containers/Attributes"))
);
const Pivot = Loadable(lazyWithRetry(() => import("views/ReportContentIdView/containers/Pivot")));

export default useContentIdRouter;
