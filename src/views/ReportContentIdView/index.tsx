// Libraries
import { useEffect, FunctionComponent, useContext } from "react";

// Context
import useAuth from "hooks/useAuth";
import { ContentIdProvider, ContentIdContext } from "views/ReportContentIdView/context";
import { showToast } from "contexts/ToastContext";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants
import { TAB_HEADER_REPORT_CONTENT_ID } from "views/ReportContentIdView/constants";

const ReportContentId: FunctionComponent = () => {
  const { user } = useAuth();

  const { state } = useContext(ContentIdContext);
  const { notifications } = state;

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  return (
    <TabRouteWrap
      title="Báo cáo Content ID"
      routes={TAB_HEADER_REPORT_CONTENT_ID(user, user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <ContentIdProvider>
      <ReportContentId {...props} />
    </ContentIdProvider>
  );
};

export default Components;
