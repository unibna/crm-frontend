// Libraries
import { FunctionComponent, useReducer, useState } from "react";

// Context
import { reducerReportFanpage, StoreReportFanpage, initialState } from "./contextStore";

// Components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { Page } from "components/Page";
import Fanpage from "views/ReportFanpageView/containers/Fanpage";
import Post from "views/ReportFanpageView/containers/Post";

// Icons
import WebIcon from "@mui/icons-material/Web";
import FeedIcon from "@mui/icons-material/Feed";

const TAB_HEADER_REPORT_FANPAGE = [
  {
    value: "fanpage",
    label: "Fanpage",
    icon: <WebIcon />,
    component: <Fanpage />,
  },
  {
    value: "post",
    label: "Bài viết",
    icon: <FeedIcon />,
    component: <Post />,
  },
];

const ReportFanpageView: FunctionComponent = () => {
  const [currentTab, setCurrentTab] = useState("fanpage");

  return (
    <Page title="Báo cáo quảng cáo Fanpage">
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {TAB_HEADER_REPORT_FANPAGE.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_REPORT_FANPAGE.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerReportFanpage, initialState);

  return (
    <StoreReportFanpage.Provider value={{ state, dispatch }}>
      <Box mb={3}>
        <ReportFanpageView {...props} />
      </Box>
    </StoreReportFanpage.Provider>
  );
};

export default Components;
