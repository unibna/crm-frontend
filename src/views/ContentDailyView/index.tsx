// Libraries
import { useEffect, FunctionComponent, useContext } from "react";

// Services
import { airtableMarketingApi } from "_apis_/marketing/airtable.api";

// Context
import useAuth from "hooks/useAuth";
import { ContentDailyProvider, ContentDailyContext } from "views/ContentDailyView/context";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants
import { TAB_HEADER_CONTENT_DAILY } from "views/ContentDailyView/constants";

const ContentDaily: FunctionComponent = () => {
  const { user } = useAuth();

  const { updateDataFilter } = useContext(ContentDailyContext);

  useEffect(() => {
    getListFilterOption();
  }, []);

  const getListFilterOption = async () => {
    const result: any = await airtableMarketingApi.get({}, "options/content-daily/");
    if (result.data) {
      const { status, content, channel, ad_status } = result.data;
      const newDataContent = content.map((item: any) => {
        return {
          label: item,
          value: item,
        };
      });

      const newDataStatus = status.map((item: any) => {
        return {
          label: item,
          value: item,
        };
      });

      const newDataChannel = channel.map((item: any) => {
        return {
          label: item,
          value: item,
        };
      });

      updateDataFilter({
        dataFilterContent:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataContent,
          ] || [],
        dataFilterStatus:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataStatus,
          ] || [],
        dataFilterChannel:
          [
            {
              label: "Tất cả",
              value: "all",
            },
            ...newDataChannel,
          ] || [],
      });
    }
  };

  return (
    <TabRouteWrap
      title="Báo cáo Content Daily"
      routes={TAB_HEADER_CONTENT_DAILY(user, user?.group_permission?.data)}
    />
  );
};

const Components: FunctionComponent = (props) => {
  return (
    <ContentDailyProvider>
      <ContentDaily {...props} />
    </ContentDailyProvider>
  );
};

export default Components;
