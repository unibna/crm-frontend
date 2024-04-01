import useAuth from "hooks/useAuth";
import { CallAttribute } from "../Status/tabs/AttributeTab/VoipAttribute";
import { createContext, useCallback, useEffect, useState } from "react";
import { TabRouteWrap } from "components/Tabs";
import { Page } from "components/Page";
import useIsMountedRef from "hooks/useIsMountedRef";
import { VOIP_TABS } from "views/LeadCenterView/constants";
import { TITLE_PAGE } from "constants/index";
import { skycallApi } from "_apis_/skycall.api";

// ---------------------------------------------

const VoipTabs = () => {
  const { user } = useAuth();

  return <TabRouteWrap routes={VOIP_TABS(user, user?.group_permission?.data)} />;
};

export const VoipContext = createContext<{
  callAttribute: CallAttribute[];
} | null>(null);

const VoipView = () => {
  const isMounted = useIsMountedRef();

  const [callAttribute, setCallAttribute] = useState<CallAttribute[]>([]);

  const getCallAttribute = useCallback(async () => {
    const result = await skycallApi.get<CallAttribute>({
      params: { limit: 200, page: 1 },
      endpoint: "call-attribute/",
    });
    if (result.data) {
      const { data = [], total = 0 } = result.data;
      setCallAttribute(data);
    }
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      Promise.all([getCallAttribute()]);
    }
  }, [isMounted, getCallAttribute]);

  return (
    <Page title={TITLE_PAGE.LEAD}>
      <VoipContext.Provider
        value={{
          callAttribute,
        }}
      >
        <VoipTabs />
      </VoipContext.Provider>
    </Page>
  );
};

export default VoipView;
