import { AirtableProvider } from "views/AirtableV2/context";
import PermissionContainer from "views/SettingsView/containers/AppRoleV2/components/PermissionContainer";

const AppRoleV2 = () => {
  return (
    <AirtableProvider>
      <PermissionContainer />
    </AirtableProvider>
  );
};

export default AppRoleV2;
