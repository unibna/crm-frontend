// Libraries
import { FunctionComponent } from "react";

// Contexts
import useAuth from "hooks/useAuth";
import { ReportProvider } from "./context";

// Components
import ReportContainer from "./containers";
import { Page } from "components/Page";


const ReportView: FunctionComponent = () => {
  const {
    user: { group_permission: { data = {} } = {} },
  }: any = useAuth();

  return (
    <Page title="Báo cáo kho">
      <ReportContainer />
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <ReportProvider>
      <ReportView {...props} />
    </ReportProvider>
  );
};

export default Components;
