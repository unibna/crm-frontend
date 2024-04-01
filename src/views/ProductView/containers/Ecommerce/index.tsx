// Libraries
import { FunctionComponent } from "react";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import { TabRouteWrap } from "components/Tabs";
import { TAB_HEADER_ECOMMERCE } from "views/ProductView/constants";

// Constants & Utils

// -----------------------------------------------------------------

const Ecommerce: FunctionComponent = () => {
  const { user } = useAuth();

  return (
    <TabRouteWrap title="TMDT" routes={TAB_HEADER_ECOMMERCE(user, user?.group_permission?.data)} />
  );
};

export default Ecommerce;
