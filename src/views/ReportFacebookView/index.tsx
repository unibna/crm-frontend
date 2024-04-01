// Libraries
import { useEffect, FunctionComponent, useReducer, useContext, useState } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { reducerReportFacebook, StoreReportFacebook, initialState } from "./contextStore";

// Components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { Page } from "components/Page";
import AdAccount from "views/ReportFacebookView/containers/AdAccount";
import Campaign from "views/ReportFacebookView/containers/Campaign";
import AdSet from "views/ReportFacebookView/containers/AdSet";
import Ad from "views/ReportFacebookView/containers/Ad";
import Fanpage from "views/ReportFacebookView/containers/Fanpage";
import Post from "views/ReportFacebookView/containers/Post";
import Attributes from "views/ReportFacebookView/containers/Attributes";
import EditAttributes from "views/ReportFacebookView/containers/EditAttributes";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import CampaignIcon from "@mui/icons-material/Campaign";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import WebIcon from "@mui/icons-material/Web";
import FeedIcon from "@mui/icons-material/Feed";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";

// Constants
import { tabHeader, actionType } from "views/ReportFacebookView/constants";
import { showToast } from "contexts/ToastContext";
import { BadgeLabel } from "components/Labels";

const TAB_HEADER_REPORT_AD_ACCOUNT = [
  {
    value: "adAccount",
    label: "Tài khoản quảng cáo",
    icon: <AccountBoxIcon />,
    type: tabHeader.AD_ACCOUNT,
    component: <AdAccount />,
  },
  {
    value: "campaign",
    label: "Chiến dịch",
    icon: <CampaignIcon />,
    type: tabHeader.CAMPAIGN,
    component: <Campaign />,
  },
  {
    value: "adSet",
    icon: <GroupIcon />,
    label: "Nhóm quảng cáo",
    type: tabHeader.AD_SET,
    component: <AdSet />,
  },
  {
    value: "ad",
    label: "Quảng cáo",
    icon: <NewspaperIcon />,
    type: tabHeader.AD,
    component: <Ad />,
  },
  {
    value: "fanpage",
    label: "Fanpage",
    icon: <WebIcon />,
    type: tabHeader.FANPAGE,
    component: <Fanpage />,
  },
  {
    value: "post",
    label: "Bài viết",
    icon: <FeedIcon />,
    type: tabHeader.POST,
    component: <Post />,
  },
  {
    value: "attributes",
    label: "Thuộc tính",
    icon: <ListAltIcon />,
    type: tabHeader.ATTIBUTES,
    component: <Attributes />,
  },
  {
    value: "editAttributes",
    icon: <SettingsIcon />,
    label: "Chỉnh sửa thuộc tính",
    component: <EditAttributes />,
  },
];

const ReportFacebook: FunctionComponent = () => {
  const { state, dispatch } = useContext(StoreReportFacebook);
  const [currentTab, setCurrentTab] = useState("adAccount");
  const [header, setHeader] = useState(TAB_HEADER_REPORT_AD_ACCOUNT);
  const { adAccount, campaign, adset, ad, fanpage, notifications } = state;

  useEffect(() => {
    getListAttributeValue();
  }, []);

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    const newHeader = header.map((item: any) => {
      return {
        ...item,
        number: switchCaseTab(item.type),
      };
    });

    setHeader(newHeader);
  }, [adAccount.columnSelected, campaign.columnSelected, adset.columnSelected, ad.columnSelected]);

  const switchCaseTab = (tab: string) => {
    const checkValue = (value: any) => {
      if (Array.isArray(value) && value.length) {
        return value.length;
      }
      return 0;
    };

    switch (tab) {
      case tabHeader.AD_ACCOUNT: {
        return checkValue(adAccount.columnSelected);
      }
      case tabHeader.CAMPAIGN: {
        return checkValue(campaign.columnSelected);
      }
      case tabHeader.AD_SET: {
        return checkValue(adset.columnSelected);
      }
      case tabHeader.AD: {
        return checkValue(ad.columnSelected);
      }
      case tabHeader.FANPAGE: {
        return checkValue(fanpage.columnSelected);
      }
      default: {
        return 0;
      }
    }
  };

  const getListAttributeValue = async () => {
    const params = {
      limit: 1000,
    };

    const result: any = await facebookApi.get(params, "attribute-value/");

    if (result && result.data) {
      const { data = [] } = result;
      const newData = data.map((item: any) => {
        const { attribute_id, attribute_name, values } = item;

        const newValues = values.map((value: any) => {
          return {
            id: value.value_id,
            name: value.value_name,
          };
        });

        return {
          id: attribute_id,
          name: attribute_name,
          data: newValues,
        };
      });

      dispatch({
        type: actionType.UPDATE_LIST_ATTRIBUTES,
        payload: {
          listAttributes: newData,
        },
      });
    }
  };

  return (
    <Page title="Báo cáo quảng cáo Facebook">
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {header.map((tab: any) => (
          <Tab
            disableRipple
            key={tab.value}
            label={<BadgeLabel label={tab.label} number={tab.number || 0} />}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_REPORT_AD_ACCOUNT.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerReportFacebook, initialState);

  return (
    <StoreReportFacebook.Provider value={{ state, dispatch }}>
      <Box mb={3}>
        <ReportFacebook {...props} />
      </Box>
    </StoreReportFacebook.Provider>
  );
};

export default Components;
