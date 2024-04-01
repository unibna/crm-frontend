import { phoneLeadApi } from "_apis_/lead.api";
import { TabRouteWrap } from "components/Tabs";
import useAuth from "hooks/useAuth";
import { createContext, useCallback, useEffect, useState } from "react";
import { REPORT_PHONE_LEAD_TABS } from "views/LeadCenterView/constants";
import { MappingType } from "../Status/tabs/AttributeTab/DomainProductCollapse/DomainProductMapping";
import { CallAttribute } from "../Status/tabs/AttributeTab/VoipAttribute";
import { ReportV1ContextType, useReportV1Context } from "./contexts/ReportContextV1";
import { ReportV2ContextType, useReportV2Context } from "./contexts/ReportContextV2";
import {
  ReportHandleLeadByProductContextType,
  useReportHandleLeadByProductContext,
} from "./contexts/ReportHandleLeadByProductContext";
import { ReportVoipContextType, useReportVoipContext } from "./contexts/ReportVoipContext";
import { skycallApi } from "_apis_/skycall.api";

// ---------------------------------------------

const ReportPhoneLeadContainer = () => {
  const { user } = useAuth();

  return (
    <TabRouteWrap
      routes={REPORT_PHONE_LEAD_TABS(user, user?.group_permission?.data)}
      title="Báo cáo Lead"
    />
  );
};

export const ReportPhoneLeadContext = createContext<
  | (ReportV1ContextType &
      ReportV2ContextType &
      ReportVoipContextType &
      ReportHandleLeadByProductContextType & {
        landingPageDomain: MappingType[];
        callAttribute: CallAttribute[];
        getDomainProduct: () => Promise<void>;
      })
  | null
>(null);

const ReportPhoneLeadView = () => {
  const [landingPageDomain, setLandingPageDomain] = useState<MappingType[]>([]);

  const getDomainProduct = async () => {
    const data = await phoneLeadApi.get<MappingType>({
      params: { limit: 200, page: 1 },
      endpoint: "product-mapping/",
    });
    if (data.data) {
      setLandingPageDomain(data.data.results);
    }
  };
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
    getDomainProduct();
    getCallAttribute();
  }, [getCallAttribute]);

  return (
    <ReportPhoneLeadContext.Provider
      value={{
        landingPageDomain,
        callAttribute,
        getDomainProduct,
        ...useReportV1Context(),
        ...useReportHandleLeadByProductContext(),
        ...useReportV2Context(),
        ...useReportVoipContext(),
      }}
    >
      <ReportPhoneLeadContainer />
    </ReportPhoneLeadContext.Provider>
  );
};
export default ReportPhoneLeadView;
