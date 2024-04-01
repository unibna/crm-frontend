// Libraries
import { useState } from "react";

// Components
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TotalByProduct from "views/ReportContentIdView/containers/Total/ByProduct";
import TotalByContentId from "./ByContentID";

// -------------------------------------------------------------

const TAB_HEADER_TOTAL = [
  {
    value: "byContentId",
    label: "Theo Content ID",
    component: <TotalByContentId />,
  },
  {
    value: "byProduct",
    label: "Theo sản phẩm",
    component: <TotalByProduct />,
  },
];

const Total = () => {
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
        {TAB_HEADER_TOTAL.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_TOTAL.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
};

export default Total;
