// Libraries
import { useEffect, useContext, useState, useMemo } from "react";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import LoadingModal from "components/Loadings/LoadingModal";

// Constants & Utils
import { fShortenNumber } from "utils/formatNumber";
import { chooseParams } from "utils/formatParamsUtil";
import vi from "locales/vi.json";

// ------------------------------------------------------------------

const ChartFollower = () => {
  const { state: store } = useContext(ZaloContext);
  const {
    oaFilter,
    isRefresh,
    inView: { isViewChartFollower },
    params,
  } = store;
  const [dataFollower, setDataFollower] = useState({
    total_follower: 0,
    total_unfollow: 0,
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isViewChartFollower) {
      loadDataTable();
    }
  }, [params, isRefresh, isViewChartFollower]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      oa_id: oaFilter.oa_id,
      from_date: params.date_from,
      to_date: params.date_to,
    };

    const newParams = chooseParams(objParams, ["oa_id", "from_date", "to_date"]);

    getListTotalFollower(newParams);
  };

  const getListTotalFollower = async (params: any) => {
    setLoading(true);

    const result: any = await zaloApi.create(params, "report-oa/");

    setLoading(false);
    if (result && result.data) {
      const {
        data: { follower },
      } = result;

      setDataFollower(follower);
    }
  };

  const data = useMemo(() => {
    return [
      {
        status: "Follower",
        quantity: dataFollower.total_follower - dataFollower.total_unfollow,
        value:
          ((dataFollower.total_follower - dataFollower.total_unfollow) /
            dataFollower.total_follower) *
          100,
      },
      {
        status: "Unfollow",
        quantity: dataFollower.total_unfollow,
        value: (dataFollower.total_unfollow / dataFollower.total_follower) * 100,
      },
      {
        status: vi.total_follower,
        quantity: dataFollower.total_follower,
        value: (dataFollower.total_follower / dataFollower.total_follower) * 100,
      },
    ];
  }, [dataFollower]);

  return (
    <Card>
      {isLoading && <LoadingModal />}
      <CardHeader title="Theo dõi" />

      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {data.map((progress: any) => (
          <LinearProgress
            variant="determinate"
            key={progress.status}
            value={progress.value}
            color={
              (progress.status === "Follower" && "warning") ||
              (progress.status === "Unfollow" && "error") ||
              "success"
            }
            sx={{ height: 8, bgcolor: "grey.50016" }}
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pb: 3 }}>
        {data.map((progress: any) => (
          <Stack key={progress.status} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: "success.main",
                  ...(progress.status === "Follower" && { bgcolor: "warning.main" }),
                  ...(progress.status === "Unfollow" && { bgcolor: "error.main" }),
                }}
              />

              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {progress.status}
              </Typography>
            </Stack>

            <Typography variant="h6">{fShortenNumber(progress.quantity)}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export default ChartFollower;
