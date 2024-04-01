import { TabRouteWrap } from "components/Tabs";
import { COLLATION_TABS } from "views/AccountantView/constants";

type Props = {};

const CollationView = (props: Props) => {
  return <TabRouteWrap routes={COLLATION_TABS} title="Đối soát thanh toán" />;
};

export default CollationView;
