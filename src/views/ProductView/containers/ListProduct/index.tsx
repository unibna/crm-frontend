// Libraries
import { FunctionComponent } from "react";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants & Utils
import { TAB_HEADER_LIST_PRODUCT } from "views/ProductView/constants";

// -----------------------------------------------------------------

const Ecommerce: FunctionComponent = () => {
  const { user } = useAuth();

  return (
    <TabRouteWrap
      title="Danh sách sản phẩm"
      routes={TAB_HEADER_LIST_PRODUCT(user, user?.group_permission?.data)}
    />
  );
};

export default Ecommerce;
