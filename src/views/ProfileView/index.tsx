// Libraries
import { FunctionComponent, useState } from "react";

// Hooks
import useSettings from "hooks/useSettings";

// Components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Page } from "components/Page";
import General from "views/ProfileView/containers/General";
import ChangePassword from "views/ProfileView/containers/ChangePassword";
import Iconify from "components/Icons/Iconify";

// -------------------------------------------------

const TAB_HEADER_PROFILE = [
  {
    value: "general",
    label: "Chung",
    icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
    component: <General />,
  },
  {
    value: "change_password",
    label: "Đổi mật khẩu",
    icon: <Iconify icon={"ic:round-vpn-key"} width={20} height={20} />,
    component: <ChangePassword />,
  },
];

const ProfileView: FunctionComponent = () => {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState("general");

  return (
    <Page title="Thông tin tài khoản">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => setCurrentTab(value)}
        >
          {TAB_HEADER_PROFILE.map((tab: any) => (
            <Tab
              disableRipple
              key={tab.value}
              label={tab.label}
              value={tab.value}
              icon={tab.icon}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 2 }} />

        {TAB_HEADER_PROFILE.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
};

export default ProfileView;
