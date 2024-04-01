// Libraries
import React, { useEffect, useState, FunctionComponent, useReducer, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { styled, Theme } from "@mui/material/styles";
import { RangeInput } from "@mui/lab/DateRangePicker/RangeTypes";

// Context
import { reducerDashboard, StoreDashboard, initialState } from "../context";

// Hooks
import useSettings from "hooks/useSettings";

// Components
import { Icon } from "@iconify/react";
import refreshFill from "@iconify/icons-eva/refresh-fill";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import MHidden from "components/MHidden";
import { Box } from "@mui/material";
import MotionInView from "components/Motions/MotionInView";
import TableRanking from "../components/TableRanking";
import AppFeatured from "components/MCarousel/AppFeatured";
import TableCompareTotalRevenue from "../components/TableCompareTotalRevenue";
import TableTotalReport from "../components/TableTotalReport";
import ChartReportTotalByDate from "../components/ChartReportTotalByDate";
import { Page } from "components/Page";

// Constants & Utils
import useAuth from "hooks/useAuth";
import { yyyy_MM_dd } from "constants/time";
import { USER_ROLE_CODES } from "constants/userRoles";
import { arrayTableRanking, revenueDimensions } from "../constants";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

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
  const [params, setParams] = useState<{
    dateValue: number;
    date_from: string;
    date_to: string;
  }>({
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  });
  const [isRefresh, setRefresh] = useState<boolean>(true);
  const [isInView, setInView] = useState({
    rankingByTotalRevenue: false,
    rankingByCRMRevenue: false,
    rankingByCrossSaleRevenue: false,
    totalRevenue: false,
    totalReport: false,
    chartReportTotalByDate: false,
  });
  const [dimensions, setDimensions] = useState<string[]>([
    ...revenueDimensions.map((dimension) => dimension.value),
  ]);
  const [rangeDates, setRangeDates] = useState<{
    startDuration: RangeInput<Date>;
    endDuration: RangeInput<Date>;
  } | null>(null);

  const theme = useTheme();
  const { user } = useAuth();
  const { themeLayout } = useSettings();

  const verticalLayout = themeLayout === "vertical";
  const isSale = user?.group_permission?.code === USER_ROLE_CODES.ROLE_SALES;
  const isCollapse = themeLayout === "vertical_collapsed";

  useEffect(() => {
    document.title = "Dashboard Sale";
  }, []);

  const handleFilter = (params: any) => {
    setParams(params);
  };

  const handleRefresh = () => {
    setRefresh(!isRefresh);
  };

  const handleSetInView = (key: string, value: boolean) => {
    setInView({
      ...isInView,
      [key]: value,
    });
  };

  const styles = useMemo(() => styleFunc({ theme }), [theme]);
  const renderDateRange = (
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
        alignItems="flex-start"
        justifyContent="flex-end"
        sx={{
          py: 1,
          px: 2,
          ml: "auto",
          backgroundColor: "transparent",
          borderBottomLeftRadius: "8px",
        }}
        spacing={2}
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
          showCompareDate
          handleSubmitCompare={(rangeStart, rangeEnd) => {
            if (rangeStart[0] && rangeStart[1] && rangeEnd[0] && rangeEnd[1]) {
              setRangeDates({
                startDuration: rangeStart,
                endDuration: rangeEnd,
              });
            } else {
              setRangeDates(null);
            }
          }}
        />
        <MHidden width="smDown">
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <Icon icon={refreshFill} width={20} height={20} />
            </IconButton>
          </Tooltip>
        </MHidden>
      </Stack>
    </RootStyle>
  );

  const renderTableRanking = (
    <Box sx={styles.boxWrapper}>
      <AppFeatured
        id="appFeatured"
        sx={{
          mt: "50px",
        }}
        rangeDate={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={styles.wrapRangeDate}
          >
            <RangeDateV2
              isTabComponent
              tabComponentStyles={styles.tabComponent}
              sxProps={styles.rangeDate}
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
            <MHidden width="smDown">
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} sx={{ color: theme.palette.primary.main }}>
                  <Icon icon={refreshFill} width={20} height={20} />
                </IconButton>
              </Tooltip>
            </MHidden>
          </Stack>
        }
        isControlFullScreen
        list={arrayTableRanking.map((table, index) => (
          <React.Fragment key={index}>
            <MotionInView
              key={table.tableName}
              setInView={() => handleSetInView(table.tableName, true)}
            >
              <TableRanking
                isInView={isInView[table.tableName as keyof typeof isInView]}
                isRefresh={isRefresh}
                params={params}
                tableIndex={index}
                {...table}
              />
            </MotionInView>
          </React.Fragment>
        ))}
      />
    </Box>
  );

  const renderTableTotalRevenue = (
    <MotionInView setInView={() => handleSetInView("totalRevenue", true)}>
      <Section>
        <TableCompareTotalRevenue
          isInView={isInView["totalRevenue"]}
          isRefresh={isRefresh}
          params={params}
          dimensions={dimensions}
          rangeDates={rangeDates}
          setRangeDates={setRangeDates}
        />
      </Section>
    </MotionInView>
  );

  const renderTableTotalReport = (
    <MotionInView setInView={() => handleSetInView("totalReport", true)}>
      <Section>
        <TableTotalReport
          isInView={isInView["totalReport"]}
          isRefresh={isRefresh}
          params={params}
          dimensions={dimensions || []}
        />
      </Section>
    </MotionInView>
  );

  const renderChartReportTotalByDate = (
    <MotionInView setInView={() => handleSetInView("chartReportTotalByDate", true)}>
      <Section>
        <ChartReportTotalByDate
          params={params}
          isInView={isInView["chartReportTotalByDate"]}
          isRefresh={isRefresh}
          dimensions={dimensions}
        />
      </Section>
    </MotionInView>
  );

  return (
    <Page title="Dashboard Sale">
      {renderDateRange}
      {renderTableRanking}
      {!isSale && (
        <>
          {renderChartReportTotalByDate}
          {renderTableTotalReport}
          {renderTableTotalRevenue}
        </>
      )}
    </Page>
  );
};

export default Dashboard;
const styleFunc: (props: any) => any = ({ theme }: { theme: Theme }) => ({
  boxWrapper: {
    position: "relative",
    "&:before": {
      content: `""`,
      zIndex: "-1",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: "linear-gradient(-45deg, #45caff 0%, #ff1b6b 100% )",
      transform: "translate3d(0px, 20px, 0) scale(0.95)",
      filter: "blur(20px)",
      opacity: "0.7",
      transition: "opacity 0.3s",
      borderRadius: "inherit",
    },
    "&:after": {
      content: `""`,
      zIndex: "-1",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: "inherit",
      borderRadius: "inherit",
    },
  },
  wrapRangeDate: {
    py: 1,
    width: "auto",
    position: "absolute",
    top: 8,
    left: 80,
    zIndex: 1300,
    justifyContent: "flex-start",
    backdropFilter: "blur(6px)",
    [theme.breakpoints.down("sm")]: {
      width: 140,
      overflow: "hidden",
    },
  },
  rangeDate: {
    width: 180,
    marginTop: 0,
    color: theme.palette.primary.main,
  },
  tabComponent: {
    container: {
      width: "220px",
    },
    tabs: {
      minHeight: "32px",
      ".MuiTabScrollButton-root": {
        color: theme.palette.primary.main,
      },
      ".MuiTabs-indicator": {
        display: "none",
      },
      ".MuiTabs-flexContainer": {
        alignItems: "center",
      },
    },
    tab: {
      "&.Mui-selected": {
        borderRadius: "8px",
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        fontSize: "0.675rem",
      },
      color: theme.palette.primary.main,
      padding: "2px 8px",
      borderRadius: "0",
      fontSize: "0.675rem",
      minHeight: "32px",
      mr: "10px!important",
    },
  },
});

const Section = styled(Box)`
  margin: 32px 0;
`;
