// Libraries
import { useState } from "react";

// Components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { Page } from "components/Page";
import ManualOanNotification from "views/ZaloView/components/ManualOanNotification";
import ManualZnsNotification from "views/ZaloView/components/ManualZnsNotification";
import AutomaticNotification from "views/ZaloView/components/AutomaticNotification";
import GroupIcon from "@mui/icons-material/Group";
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
// -----------------------------------------------------------------

const TAB_HEADER_NOTIFICATION = [
  {
    value: "manual_oan",
    label: "Gửi theo Follower",
    icon: <GroupIcon />,
    component: <ManualOanNotification />,
  },
  {
    value: "manual_zns",
    label: "Gửi theo ZNS",
    icon: <NotificationsPausedIcon />,
    component: <ManualZnsNotification />,
  },
  {
    value: "automatic",
    label: "Gửi tự động",
    icon: <ScheduleSendIcon />,
    component: <AutomaticNotification />,
  },
];

const Notification = () => {
  const [currentTab, setCurrentTab] = useState("manual_oan");

  return (
    <Page title="Thông báo">
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {TAB_HEADER_NOTIFICATION.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} icon={tab.icon} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_NOTIFICATION.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Page>
  );
};

export default Notification;
