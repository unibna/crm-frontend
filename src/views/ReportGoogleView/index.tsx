// Libraries
import { useEffect, FunctionComponent, useReducer, useContext, useState } from "react";

// Context
import { reducerReportGoogle, StoreReportGoogle, initialState } from "./contextStore";
import useAuth from "hooks/useAuth";

// Components
import { TabRouteWrap } from "components/Tabs";

// Constants
import { showToast } from "contexts/ToastContext";
import { STATUS_ROLE_GOOGLE } from "constants/rolesTab";
import { BadgeLabel } from "components/Labels";
import { TAB_HEADER_REPORT_GOOGLE } from "./constants";

import Box from "@mui/material/Box";

const ReportGoogle: FunctionComponent = () => {
  const { user } = useAuth();
  const { state } = useContext(StoreReportGoogle);
  const [header, setHeader] = useState(
    TAB_HEADER_REPORT_GOOGLE(user, user?.group_permission?.data)
  );
  const { customer, campaign, adGroup, ad, notifications } = state;

  useEffect(() => {
    if (notifications.message) {
      showToast(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    const newHeader = header.map((item: any) => {
      return {
        ...item,
        number: switchCaseTab(item.value),
      };
    });

    setHeader(newHeader);
  }, [customer.columnSelected, campaign.columnSelected, adGroup.columnSelected, ad.columnSelected]);

  const switchCaseTab = (tab: string) => {
    const checkValue = (value: any) => {
      if (Array.isArray(value) && value.length) {
        return value.length;
      }
      return 0;
    };

    switch (tab) {
      case STATUS_ROLE_GOOGLE.CUSTOMER_ACCOUNT: {
        return checkValue(customer.columnSelected);
      }
      case STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE: {
        return checkValue(campaign.columnSelected);
      }
      case STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE: {
        return checkValue(adGroup.columnSelected);
      }
      case STATUS_ROLE_GOOGLE.AD_GOOGLE: {
        return checkValue(ad.columnSelected);
      }
      default: {
        return 0;
      }
    }
  };

  const renderLabel = (tab: any) => <BadgeLabel label={tab.label} number={tab.number || 0} />;

  return (
    <TabRouteWrap title="Báo cáo quảng cáo Google" routes={header} renderLabel={renderLabel} />
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerReportGoogle, initialState);

  return (
    <StoreReportGoogle.Provider value={{ state, dispatch }}>
      <Box mb={3}>
        <ReportGoogle {...props} />
      </Box>
    </StoreReportGoogle.Provider>
  );
};

export default Components;
