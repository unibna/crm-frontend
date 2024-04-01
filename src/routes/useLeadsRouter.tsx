import Loadable from "components/Loadings/Loadable";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { lazyWithRetry } from "utils/retryLazyLoadUtil";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRoute from "./ProtectedRoute";
import { PATH_DASHBOARD, PHONE_LEAD_PATH, ROOT } from "./paths";
import map from "lodash/map";

const LEAD_SPAM_ROUTERS = () => [
  { component: <IP />, roles: true, path: PHONE_LEAD_PATH.SPAM_IP },
  { component: <PhoneNumber />, roles: true, path: PHONE_LEAD_PATH.SPAM_PHONE },
  { component: <Character />, roles: true, path: PHONE_LEAD_PATH.SPAM_KEYWORD },
];

export const usePhoneRoute = () => {
  const { user } = useAuth();

  return {
    path: ROLE_TAB.LEAD,
    element: (
      <ProtectedRoute
        user={user}
        hasPermission={isMatchRoles(
          user?.is_superuser,
          user?.group_permission?.data?.[ROLE_TAB.LEAD]
        )}
      >
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Navigate to={`/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][ROOT]}`} />
        ),
      },
      {
        path: PHONE_LEAD_PATH.STATUS,
        element: <PhoneLeadView />,
        children: [
          {
            path: ``,
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.NEW]
                }`}
              />
            ),
          },
          {
            path: PHONE_LEAD_PATH.NEW,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <NewPhoneLeadTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.WAITING,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <WaitingTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.HANDLING,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <HandlingTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.NO_ORDER,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <NoOrderTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.ORDER,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <HasOrderTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.BAD_DATA,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <BadDataTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.SPAM,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <SpamTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.ALL,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
                )}
              >
                <AllPhoneLeadTab />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: PHONE_LEAD_PATH.VOIP,
        element: <VoipView />,
        children: [
          {
            path: ``,
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.VOIP][PHONE_LEAD_PATH.VOIP_INBOUND]
                }`}
              />
            ),
          },
          {
            path: PHONE_LEAD_PATH.VOIP_INBOUND,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]
                )}
              >
                <Inbound />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.VOIP_OUTBOUND,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]
                )}
              >
                <Outbound />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.VOIP_MISSED,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]
                )}
              >
                <Missed />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.ALL,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]
                )}
              >
                <AllVoipTab />
              </ProtectedRoute>
            ),
          },
        ],
      },

      {
        path: PHONE_LEAD_PATH.REPORT,
        element: <ReportPhoneLeadView />,
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.REPORT_V2]
                }`}
              />
            ),
          },
          {
            path: PHONE_LEAD_PATH.REPORT_V2,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]
                )}
              >
                <ReportV2Tab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.REPORT_V1,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]
                )}
              >
                <ReportV1Tab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.REPORT_HANDLE_ITEM_BY_PRODUCT,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]
                )}
              >
                <ReportHandleLeadByProductTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.USER,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ACCOUNTS]
                )}
              >
                <UserTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.VOIP,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]
                )}
              >
                <VoipTab />
              </ProtectedRoute>
            ),
          },
          {
            path: PHONE_LEAD_PATH.REPORT_CRM,
            element: (
              <ProtectedRoute
                user={user}
                hasPermission={isMatchRoles(
                  user?.is_superuser,
                  user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT_CRM]
                )}
              >
                <ReportCRMTab />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: PHONE_LEAD_PATH.SPAM_CHECK,
        element: <InterceptView />,
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${
                  PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.SPAM_CHECK][PHONE_LEAD_PATH.SPAM_IP]
                }`}
              />
            ),
          },
          ...map(LEAD_SPAM_ROUTERS(), (item) => ({
            path: item.path,
            element: item.component,
          })),
        ],
      },
    ],
  };
};

// Lead
const PhoneLeadView = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status"))
);
const AllPhoneLeadTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/AllPhoneLeadTab"))
);
const HandlingTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/HandlingTab"))
);
const HasOrderTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/HasOrderTab"))
);
const NewPhoneLeadTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/NewPhoneLeadTab"))
);
const NoOrderTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/NoOrderTab"))
);
const WaitingTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/WaitingTab"))
);
const BadDataTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/BadDataTab"))
);
const SpamTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Status/tabs/SpamTab"))
);

const VoipView = Loadable(lazyWithRetry(() => import("views/LeadCenterView/containers/Voip")));
const Inbound = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Voip/tabs/Inbound"))
);
const Outbound = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Voip/tabs/Outbound"))
);
const Missed = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Voip/tabs/Missed"))
);
const AllVoipTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Voip/tabs/All"))
);

// Report Lead
const ReportV1Tab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Report/tabs/ReportV1Tab"))
);

const ReportPhoneLeadView = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Report"))
);
const ReportV2Tab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Report/tabs/ReportV2Tab"))
);
const ReportHandleLeadByProductTab = Loadable(
  lazyWithRetry(
    () => import("views/LeadCenterView/containers/Report/tabs/ReportHandleLeadByProductTab")
  )
);
const UserTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Report/tabs/UserTab"))
);
const VoipTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Report/tabs/Voip"))
);
const ReportCRMTab = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Report/tabs/ReportCRM"))
);

// Spam Check
const InterceptView = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Intercept"))
);
const IP = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Intercept/tabs/IP"))
);
const PhoneNumber = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Intercept/tabs/PhoneNumber"))
);
const Character = Loadable(
  lazyWithRetry(() => import("views/LeadCenterView/containers/Intercept/tabs/Character"))
);
