// Libraries
import { useEffect, useState, FunctionComponent, useReducer, useContext } from "react";

import { styled, useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";

// Context
import { reducerDashboardMkt, StoreDashboardMkt, initialState } from "./contextStore";

// Hooks
import useSettings from "hooks/useSettings";

// Components
import refreshFill from "@iconify/icons-eva/refresh-fill";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AppBar from "@mui/material/AppBar";
import Overview from "views/DashboardMKTView/containers/ReportCards";
import TopContentIdConversationFacebook from "views/DashboardMKTView/containers/TopContentIdConversationFacebook";
import TopContentIdMessageFacebook from "views/DashboardMKTView/containers/TopContentIdMessageFacebook";
import TopContentIdGoogle from "views/DashboardMKTView/containers/TopContentIdGoogle";
import ChartCompareCostRevenue from "views/DashboardMKTView/containers/ChartCompareCostRevenue";
import ObjectiveRevenue from "views/DashboardMKTView/containers/ObjectiveRevenue";
import BuyRateByChannel from "views/DashboardMKTView/containers/BuyRateByChannel";
import PerformanceMarketer from "views/DashboardMKTView/containers/PerformanceMarketer";
import TopLivestreamGood from "views/DashboardMKTView/containers/TopLivestreamGood";
import FacebookProduct from "views/DashboardMKTView/containers/FacebookProduct";
import GoogleProduct from "views/DashboardMKTView/containers/GoogleProduct";
import TableReportByDate from "views/DashboardMKTView/containers/TableReportByDate";
import MHidden from "components/MHidden";
import { Page } from "components/Page";

// Constants
import { yyyy_MM_dd } from "constants/time";
import MotionInView from "components/Motions/MotionInView";
import { useAppSelector } from "hooks/reduxHook";
import { sidebarStore } from "store/redux/sidebar/slice";
import useResponsive from "hooks/useResponsive";
import { showToast } from "contexts/ToastContext";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { excludeContentAdsStartWith } from "./constants";
import TopContentIdMessageTiktok from "views/DashboardView/containers/TopContentIdMessageTiktok";
import TopContentIdConversationTiktok from "views/DashboardView/containers/TopContentIdConversationTiktok";

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 70;

type RootStyleProps = {
  verticalLayout: string;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (props) => props !== "verticalLayout",
})<RootStyleProps>(({ theme, verticalLayout }: any) => ({
  boxShadow: "none",
  backgroundColor: "transparent",
  minHeight: "60px",
  [theme.breakpoints.up("lg")]: {
    ...(verticalLayout === "true"
      ? {
          width: "60% !important",
        }
      : {
          width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
        }),
  },
  [theme.breakpoints.up("xs")]: {
    minHeight: 0,
    width: "80%",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  color: theme.palette.text.primary,
  zIndex: 1102,
  width: "fit-content!important",
}));

const DashboardMKT: FunctionComponent = () => {
  const { state } = useContext(StoreDashboardMkt);
  const [params, setParams] = useState({
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    exclude_content_ads_start_with: excludeContentAdsStartWith,
  });
  const [isRefresh, setRefresh] = useState<boolean>(true);
  const [isInView, setInView] = useState({
    isViewOverview: false,
    isViewTopLivestreamGood: false,
    isViewTopContentIdGoogle: false,
    isViewTopContentIdConversationFacebook: false,
    isViewTopContentIdConversationTiktok: false,
    isViewTopContentIdMessageTiktok: false,
    isViewTopContentIdMessageFacebook: false,
    isViewChartCompareCostRevenue: false,
    isViewObjectiveRevenue: false,
    isViewPerformanceMarker: false,
    isViewBuyRateByChannel: false,
    isViewFacebookProduct: false,
    isViewGoogleProduct: false,
    isViewReportByDate: false,
  });
  const { click, hover } = useAppSelector(sidebarStore);

  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const verticalLayout = themeLayout === "vertical";
  const { notifications } = state;
  const isMobile = useResponsive("down", "sm");
  const theme = useTheme();

  useEffect(() => {
    document.title = "Dashboard Marketing";
  }, []);

  useEffect(() => {
    if (notifications?.message) {
      showToast(notifications);
    }
  }, [notifications]);

  const handleFilter = (params: any) => {
    setParams(params);
  };

  const handleRefresh = () => {
    setRefresh(!isRefresh);
  };

  const renderHtml = () => {
    return (
      <Grid container spacing={3} sx={{ mt: 1, p: 1 }}>
        <Grid item xs={12} md={12}>
          <MotionInView setInView={() => setInView({ ...isInView, isViewOverview: true })}>
            <Overview isInView={isInView.isViewOverview} isRefresh={isRefresh} params={params} />
          </MotionInView>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <MotionInView
            setInView={() =>
              setInView({
                ...isInView,
                isViewPerformanceMarker: true,
              })
            }
          >
            <PerformanceMarketer
              isInView={isInView.isViewPerformanceMarker}
              isRefresh={isRefresh}
              params={params}
            />
          </MotionInView>
        </Grid>
        <Grid item xl={8} lg={6} sm={12} xs={12}>
          <MotionInView
            setInView={() => setInView({ ...isInView, isViewChartCompareCostRevenue: true })}
          >
            <ChartCompareCostRevenue
              isInView={isInView.isViewChartCompareCostRevenue}
              isRefresh={isRefresh}
              params={params}
            />
          </MotionInView>
        </Grid>
        {/* <Grid item xl={6} lg={6} sm={12} xs={12}>
          <MotionInView setInView={() => setInView({ ...isInView, isViewObjectiveRevenue: true })}>
            <ObjectiveRevenue isInView={isInView.isViewObjectiveRevenue} isRefresh={isRefresh} />
          </MotionInView>
        </Grid>
        <Grid item xl={6} lg={6} sm={12} xs={12}>
          <MotionInView
            setInView={() => setInView({ ...isInView, isViewBuyRateByChannel: true })}
            sx={{ "& > div, & > div > .MuiPaper-root,": { height: "100%" }, height: "100%" }}
          >
            <BuyRateByChannel
              isInView={isInView.isViewBuyRateByChannel}
              isRefresh={isRefresh}
              params={params}
            />
          </MotionInView>
        </Grid> */}
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() => setInView({ ...isInView, isViewTopContentIdMessageFacebook: true })}
          >
            <TopContentIdMessageFacebook
              isInView={isInView.isViewTopContentIdMessageFacebook}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() =>
              setInView({
                ...isInView,
                isViewTopContentIdConversationFacebook: true,
              })
            }
          >
            <TopContentIdConversationFacebook
              isInView={isInView.isViewTopContentIdConversationFacebook}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() => setInView({ ...isInView, isViewTopContentIdGoogle: true })}
          >
            <TopContentIdGoogle
              isInView={isInView.isViewTopContentIdGoogle}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() => setInView({ ...isInView, isViewTopContentIdMessageTiktok: true })}
          >
            <TopContentIdMessageTiktok
              isInView={isInView.isViewTopContentIdMessageTiktok}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() =>
              setInView({
                ...isInView,
                isViewTopContentIdConversationTiktok: true,
              })
            }
          >
            <TopContentIdConversationTiktok
              isInView={isInView.isViewTopContentIdConversationTiktok}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper setInView={() => setInView({ ...isInView, isViewTopLivestreamGood: true })}>
            <TopLivestreamGood
              isInView={isInView.isViewTopLivestreamGood}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper setInView={() => setInView({ ...isInView, isViewGoogleProduct: true })}>
            <GoogleProduct
              isInView={isInView.isViewGoogleProduct}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper setInView={() => setInView({ ...isInView, isViewFacebookProduct: true })}>
            <FacebookProduct
              isInView={isInView.isViewFacebookProduct}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <MotionInView setInView={() => setInView({ ...isInView, isViewReportByDate: true })}>
            <TableReportByDate
              isInView={isInView.isViewReportByDate}
              isRefresh={isRefresh}
              params={params}
            />
          </MotionInView>
        </Grid>
      </Grid>
    );
  };

  return (
    <Page title="Dashboard Marketing">
      <RootStyle
        sx={{
          ...(isCollapse &&
            !verticalLayout && {
              width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` },
            }),
          pl: 2,
        }}
        verticalLayout={`${verticalLayout}`}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            py: 1,
            px: 2,
            ml: "auto",
            backgroundColor: "transparent",
            borderBottomLeftRadius: "8px",
          }}
        >
          <RangeDateV2
            dropdownStyle
            sxProps={{ width: 200, marginTop: 0 }}
            roadster
            handleSubmit={(
              created_from: string | undefined,
              created_to: string | undefined,
              dateValue: string | undefined | number
            ) =>
              handleFilter({
                date_from: created_from,
                date_to: created_to,
                dateValue: dateValue,
              })
            }
            label="Thời gian"
            defaultDateValue={params?.dateValue}
            created_from={params?.date_from}
            created_to={params?.date_to}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <Icon icon={refreshFill} width={20} height={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </RootStyle>
      {renderHtml()}
    </Page>
  );
};

const Components: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducerDashboardMkt, initialState);

  return (
    <StoreDashboardMkt.Provider value={{ state, dispatch }}>
      <DashboardMKT {...props} />
    </StoreDashboardMkt.Provider>
  );
};

export default Components;

const TableWrapper = styled(MotionInView)(() => ({
  "& > .MuiBox-root, & > .MuiPaper-root,": {
    height: "100%",
  },
  ".MuiGrid-root, .MuiGrid-root > div > div,": {
    height: "100%",
  },
  "& .TableContainer-root": {
    maxHeight: 800,
  },
}));
