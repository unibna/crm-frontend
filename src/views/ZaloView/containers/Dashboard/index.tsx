// Libraries
import { FunctionComponent, useContext } from "react";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";

// Hooks
import useSettings from "hooks/useSettings";

// Components
import refreshFill from "@iconify/icons-eva/refresh-fill";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import { MultiSelect } from "components/Selectors";
import Template from "views/ZaloView/components/Template";
import Overview from "views/ZaloView/components/Overview";
import ChartZns from "views/ZaloView/components/ChartZns";
import ChartNotification from "views/ZaloView/components/ChartNotification";
import ChartFollower from "views/ZaloView/components/ChartFollower";
import QuanlityZns from "views/ZaloView/components/QuanlityZns";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import MHidden from "components/MHidden";
import MotionInView from "components/Motions/MotionInView";

// Constants & Utils
import { actionType } from "views/ZaloView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import vi from "locales/vi.json";

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 70;

type RootStyleProps = {
  verticalLayout: string;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (props) => props !== "verticalLayout",
})<RootStyleProps>(({ theme, verticalLayout }: any) => ({
  boxShadow: "none",
  // backdropFilter: "blur(6px)",
  // WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  // backgroundColor: alpha(getObjectPropSafely(() => theme.palette.background.default), 0.72),
  minHeight: "60px",
  [theme.breakpoints.up("lg")]: {
    ...(verticalLayout === "true"
      ? {
          width: "60% !important",
          marginRight: 110,
        }
      : {
          width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
        }),
  },
  [theme.breakpoints.up("xs")]: {
    minHeight: 0,
    backgroundColor: "transparent",
    width: "80%",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  color: theme.palette.text.primary,
  zIndex: 1102,
}));

const Dashboard: FunctionComponent = () => {
  const { state: store, dispatch } = useContext(ZaloContext);
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const verticalLayout = themeLayout === "vertical";
  const {
    dataFilter: { dataAccountOaZalo = [] },
    isRefresh,
    params,
  } = store;

  const handleRefresh = () => {
    dispatch({
      type: actionType.REFRESH_DATA,
      payload: {
        isRefresh: !isRefresh,
      },
    });
  };

  const handleChangeInView = (key: string) => {
    dispatch({
      type: actionType.UPDATE_IN_VIEW,
      payload: {
        [key]: true,
      },
    });
  };

  const handleFilterOa = (value: string) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        zalo_oa: value,
      },
    });
  };

  const renderHtml = () => {
    return (
      <Grid container spacing={3} sx={{ mb: 2, mt: 5 }}>
        <Grid item xs={12} md={12}>
          <MotionInView setInView={() => handleChangeInView("isViewOverview")}>
            <Overview />
          </MotionInView>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MotionInView setInView={() => handleChangeInView("isViewChartNotification")}>
            <ChartNotification />
          </MotionInView>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MotionInView setInView={() => handleChangeInView("isViewChartZns")}>
            <ChartZns />
          </MotionInView>
        </Grid>
        <Grid item container xs={12} md={12} lg={4} spacing={3}>
          <Grid item xs={12} md={12}>
            <MotionInView setInView={() => handleChangeInView("isViewChartFollower")}>
              <ChartFollower />
            </MotionInView>
          </Grid>
          <Grid item xs={12} md={12}>
            <MotionInView setInView={() => handleChangeInView("isViewChartQuanlityZns")}>
              <QuanlityZns />
            </MotionInView>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <MotionInView setInView={() => handleChangeInView("isViewTemplate")}>
            <Template />
          </MotionInView>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
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
          spacing={2}
          sx={{ py: 1, width: "100%" }}
        >
          <MultiSelect
            zIndex={1303}
            style={{ width: 200 }}
            title={vi.zalo_oa}
            size="medium"
            options={dataAccountOaZalo}
            onChange={handleFilterOa}
            defaultValue={getObjectPropSafely(() => dataAccountOaZalo[0].value) || ""}
            simpleSelect
            selectorId="zalo-oa"
          />
          <RangeDateV2
            dropdownStyle
            sxProps={{ width: 200, marginTop: 0 }}
            roadster
            handleSubmit={(
              created_from: string | undefined,
              created_to: string | undefined,
              dateValue: string | undefined | number
            ) =>
              dispatch({
                type: actionType.UPDATE_PARAMS,
                payload: {
                  date_from: created_from,
                  date_to: created_to,
                  dateValue: dateValue,
                },
              })
            }
            label="Thời gian"
            defaultDateValue={params?.dateValue}
            created_from={params?.date_from}
            created_to={params?.date_to}
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
      {renderHtml()}
    </>
  );
};

export default Dashboard;
