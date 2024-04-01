// Libraries
import { useEffect, useState, FunctionComponent, useReducer } from "react";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";

// Context
import { reducerDashboard, StoreDashboard, initialState } from "./contextStore";

// Hooks
import useSettings from "hooks/useSettings";
import useResponsive from "hooks/useResponsive";

// Components
import refreshFill from "@iconify/icons-eva/refresh-fill";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import ReportCards from "views/DashboardView/containers/ReportCards";
import TopContentIdMessageFacebook from "views/DashboardView/containers/TopContentIdMessageFacebook";
import TopContentIdConversationFacebook from "views/DashboardView/containers/TopContentIdConversationFacebook";
import TopContentIdGoogle from "views/DashboardView/containers/TopContentIdGoogle";
import ChartReportByDate from "views/DashboardView/containers/ChartReportByDate";
import TableReportByDate from "views/DashboardView/containers/TableReportByDate";
import BuyRateByChannel from "views/DashboardView/containers/BuyRateByChannel";
import ReportByChannel from "views/DashboardView/containers/ReportByChannel";
import ReportByProduct from "views/DashboardView/containers/ReportByProduct";
import { Page } from "components/Page";

// Constants & Utils
import { yyyy_MM_dd } from "constants/time";
import MotionInView from "components/Motions/MotionInView";
import { useAppSelector } from "hooks/reduxHook";
import { sidebarStore } from "store/redux/sidebar/slice";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import TopContentIdConversationTiktok from "./containers/TopContentIdConversationTiktok";
import TopContentIdMessageTiktok from "./containers/TopContentIdMessageTiktok";

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

const Dashboard: FunctionComponent = () => {
  const [params, setParams] = useState({
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  });
  const [isRefresh, setRefresh] = useState<boolean>(true);
  const [isInView, setInView] = useState({
    isViewOverview: false,
    isViewTopContentIdConversationTikok: false,
    isViewTopContentIdConversationFacebook: false,
    isViewTopContentIdGoogle: false,
    isViewReportByProduct: false,
    isViewBuyRateByChannel: false,
    isViewTopContentIdMessageFacebook: false,
    isViewTopContentIdMessageTiktok: false,
    isViewReportByChannel: false,
    isViewChartReportByDate: false,
    isViewTableReportByDate: false,
  });
  const isMobile = useResponsive("down", "sm");
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const verticalLayout = themeLayout === "vertical";

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

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
            <ReportCards isInView={isInView.isViewOverview} isRefresh={isRefresh} params={params} />
          </MotionInView>
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
        {/* <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() =>
              setInView({
                ...isInView,
                isViewTopContentIdMessageTiktok: true,
              })
            }
          >
            <TopContentIdMessageTiktok
              isInView={isInView.isViewTopContentIdMessageTiktok}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid> */}
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            setInView={() =>
              setInView({
                ...isInView,
                isViewTopContentIdConversationTikok: true,
              })
            }
          >
            <TopContentIdConversationTiktok
              isInView={isInView.isViewTopContentIdConversationTikok}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper setInView={() => setInView({ ...isInView, isViewBuyRateByChannel: true })}>
            <BuyRateByChannel
              isInView={isInView.isViewBuyRateByChannel}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper setInView={() => setInView({ ...isInView, isViewReportByProduct: true })}>
            <ReportByProduct
              isInView={isInView.isViewReportByProduct}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xl={4} lg={6} sm={12} xs={12}>
          <TableWrapper
            sx={{
              "& > .MuiBox-root, & > .MuiPaper-root,": {
                height: "100%",
              },
              ".MuiGrid-root, .MuiGrid-root > div > div,": {
                height: "100%",
              },
            }}
            setInView={() => setInView({ ...isInView, isViewReportByChannel: true })}
          >
            <ReportByChannel
              isInView={isInView.isViewReportByChannel}
              isRefresh={isRefresh}
              params={params}
            />
          </TableWrapper>
        </Grid>
        <Grid item xs={12} md={12}>
          <MotionInView setInView={() => setInView({ ...isInView, isViewChartReportByDate: true })}>
            <ChartReportByDate
              isInView={isInView.isViewChartReportByDate}
              isRefresh={isRefresh}
              params={params}
            />
          </MotionInView>
        </Grid>
        <Grid item xs={12} md={12}>
          <MotionInView setInView={() => setInView({ ...isInView, isViewTableReportByDate: true })}>
            <TableReportByDate
              isInView={isInView.isViewTableReportByDate}
              isRefresh={isRefresh}
              params={params}
            />
          </MotionInView>
        </Grid>
      </Grid>
    );
  };

  return (
    <Page title="Dashboard">
      <RootStyle
        sx={{
          ...(isCollapse &&
            !verticalLayout && {
              width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` },
            }),
          ...(!isCollapse &&
            !verticalLayout && {
              width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
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
            sxProps={{ width: 200, marginTop: 0 }}
            dropdownStyle
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
  const [state, dispatch] = useReducer(reducerDashboard, initialState);

  return (
    <StoreDashboard.Provider value={{ state, dispatch }}>
      <Dashboard {...props} />
    </StoreDashboard.Provider>
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
