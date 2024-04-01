import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AttachPhoneTab from "./tabs/AttachPhoneTab";
import AdIDTab from "./tabs/AdIDTab";
import { useState } from "react";
import { MTabPanel } from "components/Tabs";

const ATTACH_PHONE_TABS = [
  { component: <AttachPhoneTab />, label: "Tin nhắn", value: 0 },
  { component: <AdIDTab />, label: "Validate LDP", value: 1 },
];

const AttachPhoneTabs = () => {
  const [value, setValue] = useState(0);
  return (
    <Box>
      <Tabs
        value={value}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setValue(value)}
        sx={{ px: 2, bgcolor: "background.neutral" }}
      >
        {ATTACH_PHONE_TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.label} />
        ))}
      </Tabs>
      <Box mt={2}>
        {ATTACH_PHONE_TABS.map((tab, index) => (
          <MTabPanel key={index} index={index} value={value}>
            {tab.component}
          </MTabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default AttachPhoneTabs;
