import Grid from "@mui/material/Grid";
import { phoneLeadApi } from "_apis_/lead.api";
import { Page } from "components/Page";
import { TabRouteWrap } from "components/Tabs";
import useAuth from "hooks/useAuth";
import { createContext, useState } from "react";
import { STATUS_PHONE_LEAD_TABS } from "views/LeadCenterView/constants";
import { AllPhoneLeadContextType, useAllPhoneContext } from "./contexts/AllPhoneContext";
import { BadDataContextType, useBadDataContext } from "./contexts/BadDataContext";
import { HandlingContextType, useHandlingContext } from "./contexts/HandlingContext";
import { HasOrderContextType, useHasOrderContext } from "./contexts/HasOrderContext";
import { NewPhoneContextType, useNewPhoneContext } from "./contexts/NewPhoneContext";
import { NotOrderContextType, useNotBuyContext } from "./contexts/NotBuyContext";
import { SpamContextType, useSpamContext } from "./contexts/SpamContext";
import { WaitingContextType, useWaitingContext } from "./contexts/WaitingContext";
import { MappingType } from "./tabs/AttributeTab/DomainProductCollapse/DomainProductMapping";
import { TITLE_PAGE } from "constants/index";

// ---------------------------------------------

const PhoneLeadContainer = () => {
  const { user } = useAuth();

  return <TabRouteWrap routes={STATUS_PHONE_LEAD_TABS(user, user?.group_permission?.data)} />;
};

export const PhoneLeadContext = createContext<
  | (AllPhoneLeadContextType &
      HandlingContextType &
      HasOrderContextType &
      NewPhoneContextType &
      NotOrderContextType &
      WaitingContextType &
      SpamContextType &
      BadDataContextType & {
        landingPageDomain: MappingType[];
        getDomainProduct: () => Promise<void>;
      })
  | null
>(null);

const PhoneLeadView = () => {
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

  return (
    <PhoneLeadContext.Provider
      value={{
        ...useAllPhoneContext(),
        ...useHandlingContext(),
        ...useHasOrderContext(),
        ...useNewPhoneContext(),
        ...useNotBuyContext(),
        ...useWaitingContext(),
        ...useBadDataContext(),
        ...useSpamContext(),
        landingPageDomain,
        getDomainProduct,
      }}
    >
      <Grid sx={{ position: "relative" }}>
        <Page title={TITLE_PAGE.LEAD}>
          <PhoneLeadContainer />
        </Page>
      </Grid>
    </PhoneLeadContext.Provider>
  );
};
export default PhoneLeadView;
