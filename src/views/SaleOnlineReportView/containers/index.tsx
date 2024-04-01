// Libraries
import { useEffect, useState, FunctionComponent } from "react";

import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";

// Hooks
import useAuth from "hooks/useAuth";

// Components
import refreshFill from "@iconify/icons-eva/refresh-fill";
import RangeDateV2 from "components/Pickers/RangeDateV2";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MHidden from "components/MHidden";
import Box from "@mui/material/Box";
import Metrics from "views/SaleOnlineReportView/components/Metrics";
import MotionInView from "components/Motions/MotionInView";

// Constants & Utils
import { yyyy_MM_dd } from "constants/time";
import ChartReportByDate from "views/SaleOnlineReportView/components/ChartReportByDate";
import TableReportSellerByDate from "views/SaleOnlineReportView/components/TableReportSellerByDate";
import TableReportTeamByDate from "views/SaleOnlineReportView/components/TableReportTeamByDate";
import { USER_ROLE_CODES } from "constants/userRoles";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

const Dashboard: FunctionComponent = () => {
  const [params, setParams] = useState({
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  });
  const [isRefresh, setRefresh] = useState<boolean>(true);
  const [isInView, setInView] = useState({
    metrics: false,
    chartReportByDate: false,
    tableReportByDate: false,
    tableReportBySeller: false,
  });

  const { user } = useAuth();

  const isSale = user?.group_permission?.code === USER_ROLE_CODES.ROLE_SALES;

  useEffect(() => {
    document.title = "Sale Online Report";
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

  const renderDateRange = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{ py: 1, width: "100%" }}
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
      <MHidden width="smDown">
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh}>
            <Icon icon={refreshFill} width={20} height={20} />
          </IconButton>
        </Tooltip>
      </MHidden>
    </Stack>
  );

  const renderMetrics = (
    <MotionInView key={"metrics"} setInView={() => handleSetInView("metrics", true)}>
      <Metrics isInView={isInView.metrics} isRefresh={isRefresh} params={params} />
    </MotionInView>
  );

  const renderLineChart = (
    <Section>
      <MotionInView
        key="chartReportByDate"
        setInView={() => handleSetInView("chartReportByDate", true)}
      >
        <ChartReportByDate
          isInView={isInView.chartReportByDate}
          isRefresh={isRefresh}
          params={params}
        />
      </MotionInView>
    </Section>
  );

  const renderReportSellerByDate = (
    <Section>
      <MotionInView
        key="tableReportByDate"
        setInView={() => handleSetInView("tableReportByDate", true)}
      >
        <TableReportSellerByDate
          isInView={isInView.tableReportByDate}
          isRefresh={isRefresh}
          params={params}
        />
      </MotionInView>
    </Section>
  );

  const renderReportTeamByDate = (
    <Section>
      <MotionInView
        key="tableReportBySeller"
        setInView={() => handleSetInView("tableReportBySeller", true)}
      >
        <TableReportTeamByDate
          isInView={isInView.tableReportBySeller}
          isRefresh={isRefresh}
          params={params}
        />
      </MotionInView>
    </Section>
  );

  return (
    <>
      {renderDateRange}
      {renderMetrics}
      {!isSale && renderLineChart}
      {!isSale && renderReportTeamByDate}
      {!isSale && renderReportSellerByDate}
    </>
  );
};

export default Dashboard;

const Section = styled(Box)`
  margin: 32px 0;
`;
