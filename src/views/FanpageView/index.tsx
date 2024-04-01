// Libraries
import { useEffect, FunctionComponent, useReducer, useContext, useState } from "react";

// Context
import { reducerFacebookFanpage, StoreFanpage, initialState } from "./contextStore";

// Components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { Page } from "components/Page";
import Post from "views/FanpageView/containers/Post";
import Conversation from "views/FanpageView/containers/Conversation";
import Message from "views/FanpageView/containers/Message";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import GavelIcon from "@mui/icons-material/Gavel";
import FeedIcon from "@mui/icons-material/Feed";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SmsIcon from "@mui/icons-material/Sms";
import { showToast } from "contexts/ToastContext";

const TAB_HEADER_AD_FANPAGE = [
  {
    value: "post",
    label: "Bài viết",
    icon: <FeedIcon />,
    component: <Post />,
  },
  {
    value: "conversation",
    label: "Cuộc hội thoại",
    icon: <QuestionAnswerIcon />,
    component: <Conversation />,
  },
  {
    value: "message",
    label: "Tin nhắn",
    icon: <SmsIcon />,
    component: <Message />,
  },
];

const FanpageView: FunctionComponent = () => {
  const { state } = useContext(StoreFanpage);
  const { notifications } = state;
  const [currentTab, setCurrentTab] = useState("post");

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  return (
    <Page title="Thông tin quảng cáo Fanpage">
      {/* <Container maxWidth={themeStretch ? false : 'lg'}> */}
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {TAB_HEADER_AD_FANPAGE.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} icon={tab.icon} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_AD_FANPAGE.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
      {/* </Container> */}
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerFacebookFanpage, initialState);

  return (
    <StoreFanpage.Provider value={{ state, dispatch }}>
      <Box mb={3}>
        <FanpageView {...props} />
      </Box>
    </StoreFanpage.Provider>
  );
};

export default Components;
