//components
import { Page } from "components/Page";
import { TabRouteWrap, RouteType } from "components/Tabs";

//icons
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import BallotIcon from "@mui/icons-material/Ballot";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

//utils
import { PATH_DASHBOARD } from "routes/paths";
import { PROMOTION_ROLES, ROLE_TAB } from "constants/rolesTab";

export type CarriesMemberModeType = "table" | "kanban";

export const PROMOTION_TABS: RouteType[] = [
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.PROMOTION][PROMOTION_ROLES.ALL]}`,
    label: "Tất cả",
    roles: true,
    icon: <BallotIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.PROMOTION][PROMOTION_ROLES.ACTIVE]}`,
    label: "Đang hoạt động",
    roles: true,
    icon: <PublicIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.PROMOTION][PROMOTION_ROLES.INACTIVE]}`,
    label: "Chưa hoạt động",
    roles: true,
    icon: <PublicOffIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.PROMOTION][PROMOTION_ROLES.DEACTIVED]}`,
    label: "Ngừng hoạt động",
    roles: true,
    icon: <NotificationImportantIcon />,
  },
];

const TabContainer = () => <TabRouteWrap routes={PROMOTION_TABS} />;

const PromotionView = () => {
  return (
    <Page title={"Khuyến mãi"}>
      <TabContainer />
    </Page>
  );
};
export default PromotionView;
