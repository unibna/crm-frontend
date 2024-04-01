import { TabRouteWrap } from "components/Tabs";
import useAuth from "hooks/useAuth";
import { TAB_HEADER_CUSTOMER_CARE } from "views/CskhView/constants";

const CustomerCareView = () => {
  const { user } = useAuth();
  return (
    <TabRouteWrap
      title="Chăm sóc khách hàng"
      routes={TAB_HEADER_CUSTOMER_CARE(user, user?.group_permission?.data)}
    />
  );
};

export default CustomerCareView;
