import AppBlockingIcon from "@mui/icons-material/AppBlocking";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import FontDownloadOffIcon from "@mui/icons-material/FontDownloadOff";
import { DGridType } from "_types_/DGridType";
import { RouteType, TabRouteWrap } from "components/Tabs";
import { ROLE_TAB } from "constants/rolesTab";
import useTable from "hooks/useTable";
import { createContext } from "react";
import { PATH_DASHBOARD, PHONE_LEAD_PATH } from "routes/paths";
import {
  SPAM_CHECK_COLUMNS,
  SPAM_CHECK_COLUMN_ORDERS,
  SPAM_CHECK_COLUMN_WIDTHS,
} from "views/LeadCenterView/constants/columns";

const LEAD_SPAM_TABS: RouteType[] = [
  {
    label: "IP",
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.SPAM_CHECK][PHONE_LEAD_PATH.SPAM_IP]}`,
    roles: true,
    icon: <DeviceUnknownIcon />,
  },
  {
    label: "Số điện thoại",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.SPAM_CHECK][PHONE_LEAD_PATH.SPAM_PHONE]
    }`,
    roles: true,
    icon: <AppBlockingIcon />,
  },
  {
    label: "Từ Khóa",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.SPAM_CHECK][PHONE_LEAD_PATH.SPAM_KEYWORD]
    }`,
    roles: true,
    icon: <FontDownloadOffIcon />,
  },
];

export const LeadSpamContext = createContext<Partial<DGridType<any, any, any>> | null>(null);

type Props = {};

const LeadSpam = (props: Props) => {
  const tableProps = useTable({
    columns: SPAM_CHECK_COLUMNS,
    columnWidths: SPAM_CHECK_COLUMN_WIDTHS,
    columnOrders: SPAM_CHECK_COLUMN_ORDERS,
    hiddenColumnNames: [],
    isFullRow: false,
  });

  return (
    <LeadSpamContext.Provider value={tableProps}>
      <TabRouteWrap routes={LEAD_SPAM_TABS} title={"Lead Center - Spam"} />
    </LeadSpamContext.Provider>
  );
};

export default LeadSpam;
