// Libraries
import { useEffect, FunctionComponent, useReducer, useContext, useState } from "react";

// Context
import { reducerFacebook, StoreFacebook, initialState } from "./contextStore";

// Components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { Page } from "components/Page";
import AdInsight from "views/AdFacebookView/containers/AdInsight";
import Campaign from "views/AdFacebookView/containers/Campaign";
import AdSet from "views/AdFacebookView/containers/AdSet";
import Ad from "views/AdFacebookView/containers/Ad";
import { showToast } from "contexts/ToastContext";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";

const TAB_HEADER_AD_FACEBOOK = [
  {
    value: "campaign",
    label: "Chiến dịch",
    icon: <CampaignIcon />,
    component: <Campaign />,
  },
  {
    value: "adSet",
    label: "Nhóm quảng cáo",
    icon: <GroupsIcon />,
    component: <AdSet />,
  },
  {
    value: "ad",
    label: "Quảng cáo",
    icon: <NewspaperIcon />,
    component: <Ad />,
  },
  {
    value: "adInSight",
    icon: <ImportContactsIcon />,
    label: "Thông tin quảng cáo",
    component: <AdInsight />,
  },
];

const AdFacebookView: FunctionComponent = () => {
  const { state } = useContext(StoreFacebook);
  const { notifications } = state;
  const [currentTab, setCurrentTab] = useState("campaign");

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  return (
    <Page title="Thông tin quảng cáo Facebook">
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {TAB_HEADER_AD_FACEBOOK.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} icon={tab.icon} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_AD_FACEBOOK.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerFacebook, initialState);

  return (
    <StoreFacebook.Provider value={{ state, dispatch }}>
      <Box mb={3}>
        <AdFacebookView {...props} />
      </Box>
    </StoreFacebook.Provider>
  );
};

export default Components;
