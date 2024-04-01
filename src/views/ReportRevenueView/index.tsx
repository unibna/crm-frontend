// Libraries
import { FunctionComponent } from "react";

// Hooks
import useAuth from "hooks/useAuth";

// Context
import { ReportRevenueProvider } from "views/ReportRevenueView/context";

// Components
import { TabRouteWrap } from "components/Tabs";
import { TAB_HEADER_REPORT_REVENUE } from "./constants";

// -----------------------------------------------------------------

const ReportRevenueView: FunctionComponent = () => {
  const { user } = useAuth();

  return (
    <TabRouteWrap
      title="Báo cáo doanh thu"
      routes={TAB_HEADER_REPORT_REVENUE(user, user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <ReportRevenueProvider>
      <ReportRevenueView {...props} />
    </ReportRevenueProvider>
  );
};

export default Components;
