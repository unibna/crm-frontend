import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import { phoneLeadApi } from "_apis_/lead.api";
import React, { useEffect } from "react";
import { SaleOnlineDailyType } from "_types_/UserType";
import SearchTable from "./Table";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import useIsMountedRef from "hooks/useIsMountedRef";

const ReportDailyHandleByDrawer = () => {
  const [data, setData] = React.useState<{
    landing_page: SaleOnlineDailyType[];
    pancake: SaleOnlineDailyType[];
    crm: SaleOnlineDailyType[];
    // missed: SaleOnlineDailyType[];
    campaign: SaleOnlineDailyType[];
  }>({ landing_page: [], pancake: [], crm: [], campaign: [] });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isMounted = useIsMountedRef();

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getData = React.useCallback(async () => {
    setLoading(true);
    const result = await phoneLeadApi.getSalerOnlineDaily();
    if (result.data) {
      setData(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    open && isMounted.current && getData();
  }, [isMounted, open, getData]);

  return (
    <>
      <Button variant="contained" onClick={handleDrawerToggle} sx={{ bgcolor: "error.main" }}>
        <RecentActorsIcon style={{ marginRight: 4 }} />
        Báo cáo chia số
      </Button>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => {}}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: {
              xs: 365,
              sm: 365,
              md: 780,
              lg: 780,
              xl: 1550,
            },
            border: "none",
            overflow: "auto",
          },
        }}
      >
        <Stack alignItems="flex-start">
          <IconButton onClick={handleDrawerClose} style={{ padding: 4, margin: 8 }}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Grid container my={2}>
          <SearchTable
            loading={loading}
            data={data?.landing_page || []}
            columns={[
              { name: "name", title: "Tên-Landing page" },
              { name: "total", title: "Tổng SĐT" },
              { name: "qualified", title: "SĐT chất lượng" },
            ]}
          />
          <SearchTable
            loading={loading}
            data={data?.pancake || []}
            columns={[
              { name: "name", title: "Tên-Pancake" },
              { name: "total", title: "Tổng SĐT" },
              { name: "qualified", title: "SĐT chất lượng" },
            ]}
          />
          <SearchTable
            loading={loading}
            data={data?.crm || []}
            columns={[
              { name: "name", title: "Tên-CRM" },
              { name: "total", title: "Tổng SĐT" },
              { name: "qualified", title: "SĐT chất lượng" },
            ]}
          />
          <SearchTable
            loading={loading}
            data={data?.campaign || []}
            columns={[
              { name: "name", title: "Tên-CRM campaign" },
              { name: "total", title: "Tổng SĐT" },
              { name: "qualified", title: "SĐT chất lượng" },
            ]}
          />
        </Grid>
      </SwipeableDrawer>
    </>
  );
};

export default ReportDailyHandleByDrawer;
