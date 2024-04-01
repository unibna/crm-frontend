// Contansts & Types
import ListRole from "./ListRole";
import ListFeature from "./ListFeature";
import React from "react";
import { Box, Tab } from "@mui/material";
import { Tabs } from "@mui/material";
import vi from "locales/vi.json";

const TABS = {
  LIST_ROLE: "LIST_ROLE",
  LIST_FEATURE: "LIST_FEATURE",
};

const PermissionContainer = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
        <Tabs value={value} onChange={handleChange}>
          {Object.values(TABS).map((item: keyof typeof vi, index) => (
            <Tab label={vi[item]} key={index} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <ListRole />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListFeature />
      </TabPanel>
    </Box>
  );
};

export default PermissionContainer;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
