// Libraries
import { useState } from "react";

// Components
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import OverviewByContentDaily from "views/ContentDailyView/containers/Overview/ByContentDaily";
import OverviewByCampaign from "views/ContentDailyView/containers/Overview/ByCampaign";

// -------------------------------------------------------------

const TAB_HEADER_FACEBOOK = [
  {
    value: "byContentDaily",
    label: "Theo Content Daily",
    component: <OverviewByContentDaily />,
  },
  {
    value: "byCampaign",
    label: "Theo chiến dịch",
    component: <OverviewByCampaign />,
  },
];

const Facebook = () => {
  const [currentTab, setCurrentTab] = useState("byContentDaily");

  return (
    <>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
        sx={{ px: 2, bgcolor: "background.neutral" }}
      >
        {TAB_HEADER_FACEBOOK.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_FACEBOOK.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
};

export default Facebook;
