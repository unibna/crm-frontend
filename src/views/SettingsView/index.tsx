// Libraries
import { FunctionComponent } from "react";

// Context
import { SettingProvider } from "views/SettingsView/context";
import useAuth from "hooks/useAuth";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants
import { TAB_HEADER_SETTING } from "./constants";
// -------

const SettingViews: FunctionComponent = () => {
  const { user } = useAuth();

  return (
    <TabRouteWrap
      title="Cấu hình"
      routes={TAB_HEADER_SETTING(user, user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <SettingProvider>
      <SettingViews {...props} />
    </SettingProvider>
  );
};

export default Components;
