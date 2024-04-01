// Libraries
import { useState } from "react";

// Components
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import GoogleByContentID from "views/ReportContentIdView/containers/Google/ByContentId";
import GoogleByCampaign from "views/ReportContentIdView/containers/Google/ByCampaign";

// -------------------------------------------------------------

const TAB_HEADER_GOOGLE = [
  {
    value: "byContentId",
    label: "Theo Content ID",
    component: <GoogleByContentID />,
  },
  {
    value: "byCampaign",
    label: "Theo chiến dịch",
    component: <GoogleByCampaign />,
  },
];

const Google = () => {
  const [currentTab, setCurrentTab] = useState("byContentId");

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
        {TAB_HEADER_GOOGLE.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_GOOGLE.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
};

export default Google;
