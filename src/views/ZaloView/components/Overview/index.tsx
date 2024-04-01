// Libraries
import { useContext, useEffect, useState } from "react";
import map from "lodash/map";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ScoreCard from "components/Charts/ScoreCard";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { chooseParams } from "utils/formatParamsUtil";

// Assets
import CheckInIllustration from "assets/illustrations/illustration_checkin";
import CheckOutIllustration from "assets/illustrations/illustration_checkout";
import BookingIllustration from "assets/illustrations/illustration_booking";

// ------------------------------------------------------------

interface DataType {
  label: string;
  id: string;
  value: number;
  icon?: any;
  isLoading: boolean;
  getValue: (value: any) => {};
}

const data: DataType[] = [
  {
    label: "Người theo dõi",
    id: "follower",
    icon: <BookingIllustration />,
    value: 142267000,
    isLoading: true,
    getValue: (value: any) => getObjectPropSafely(() => value?.total_follower),
  },
  {
    label: "Theo đơn hàng",
    id: "auto_send_notification",
    icon: <CheckInIllustration />,
    value: 142267000,
    isLoading: true,
    getValue: (value: any) => getObjectPropSafely(() => value?.total_send),
  },
  {
    label: "Theo Follower, ZNS",
    id: "send_request_notification",
    icon: <CheckOutIllustration />,
    value: 142267000,
    isLoading: true,
    getValue: (value: any) => getObjectPropSafely(() => value?.total_notification),
  },
];

const Overview = () => {
  const { state: store } = useContext(ZaloContext);
  const [dataOverview, setDataOverview] = useState<DataType[]>(data);
  const { newCancelToken } = useCancelToken();
  const {
    isRefresh,
    inView: { isViewOverview },
    params,
    oaFilter,
  } = store;

  useEffect(() => {
    if (isViewOverview) {
      loadDataTable();
    }
  }, [params, isRefresh, isViewOverview, newCancelToken]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      oa_id: oaFilter.oa_id,
      from_date: params.date_from,
      to_date: params.date_to,
    };

    const newParams = chooseParams(objParams, ["oa_id", "from_date", "to_date"]);

    getDataOverview(newParams);
  };

  const getDataOverview = async (params: any) => {
    const newDataGg = map(dataOverview, (item) => {
      return {
        ...item,
        isLoading: true,
      };
    });

    setDataOverview(newDataGg);

    const result: any = await zaloApi.create(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "report-oa/"
    );

    if (result && result.data) {
      const { data = {} } = result;

      const newData: any = map(dataOverview, (item: DataType) => {
        const { getValue } = item;

        return {
          ...item,
          value: getValue(getObjectPropSafely(() => data[item.id])) || 0,
          isLoading: false,
        };
      });

      setDataOverview(newData);
    } else {
      const newData = map(dataOverview, (item) => {
        return {
          ...item,
          value: 0,
          isLoading: false,
        };
      });

      setDataOverview(newData);
    }
  };

  return (
    <Grid container spacing={3}>
      {map(dataOverview, (item, index) => {
        const { label, value, id, isLoading, icon } = item;

        return (
          <Grid key={id + index} item xs={12} md={4}>
            <ScoreCard
              title={label}
              value={value}
              isLoading={isLoading}
              icon={
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    lineHeight: 0,
                    borderRadius: "50%",
                    bgcolor: "background.neutral",
                  }}
                >
                  {icon}
                </Box>
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Overview;
