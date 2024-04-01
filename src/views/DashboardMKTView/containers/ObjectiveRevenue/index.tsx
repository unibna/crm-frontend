// Libraries
import { useEffect, useState, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import { Icon } from "@iconify/react";

// Services
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";
import usePopup from "hooks/usePopup";

// Components
import archiveFill from "@iconify/icons-eva/archive-fill";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import RadialBar from "components/Charts/RadialBar";
import PopupObjectiveRevenue from "views/DashboardMKTView/components/PopupObjectiveRevenue";
import MDatePicker from "components/Pickers/MDatePicker";

// Constants
import { chooseParams } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fShortenNumber } from "utils/formatNumber";
import { Button } from "@mui/material";
interface Props {
  isRefresh?: boolean;
  isInView?: boolean;
}

const ObjectiveRevenue = (props: Props) => {
  const { isRefresh, isInView = false } = props;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<number[] | []>([]);
  const [titleChart, setTitleChart] = useState("");
  const [subtitleChart, setSubtitleChart] = useState("");
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const { newCancelToken } = useCancelToken();
  const revenue = useRef({
    ads_revenue: 0,
    crm_revenue: 0,
    ads_target: 0,
    crm_target: 0,
    total: 0,
  });
  const { dataPopup, setDataPopup } = usePopup();

  useEffect(() => {
    if (isInView) {
      const params = {
        month: filterDate?.getMonth() + 1,
        year: filterDate?.getFullYear(),
      };

      const newParams = chooseParams(params, ["month", "year"]);

      getDataChart(newParams);
    }
  }, [filterDate, isRefresh, isInView]);

  const getDataChart = async (params: any) => {
    setLoading(true);
    const result: any = await dashboardMkt.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "monthly-target/"
    );
    if (result && result.data) {
      const { results = [] } = result.data;
      let newData: number[] | [] = [];
      let total = "";
      let newTitleChart = "";
      let newSubtitleChart = "";
      let newRevenue: any = {};

      if (results.length) {
        const valueAds = ((results[0]?.ads_revenue / results[0]?.ads_target) * 100).toFixed(2);
        const valueCrm = ((results[0]?.crm_revenue / results[0]?.crm_target) * 100).toFixed(3);
        const totalTarget = Math.trunc(
          ((results[0]?.ads_revenue + results[0]?.crm_revenue) /
            (results[0]?.ads_target + results[0]?.crm_target)) *
            100
        ).toFixed(0);

        total = `${fShortenNumber(
          results[0]?.ads_revenue + results[0]?.crm_revenue
        )} - ${totalTarget}%`;
        newTitleChart = `ADS Target - CRM Target - TOTAL Target`;
        newSubtitleChart = `${fShortenNumber(results[0]?.ads_target)}  ${fShortenNumber(
          results[0]?.crm_target
        )} ${fShortenNumber(results[0]?.ads_target + results[0]?.crm_target)}`;
        newData = [+valueAds, +valueCrm];
        newRevenue = {
          ads_revenue: results[0]?.ads_revenue,
          crm_revenue: results[0]?.crm_revenue,
          ads_target: results[0]?.ads_target,
          crm_target: results[0]?.crm_target,
          total,
        };
      }

      revenue.current = newRevenue;
      setData(newData);
      setTitleChart(newTitleChart);
      setSubtitleChart(newSubtitleChart);
    }
    setLoading(false);
  };

  const formatterValue = (value: number) => {
    const newValue = value.toString().split(".");
    if (getObjectPropSafely(() => newValue[1].length)) {
      return `${
        newValue[1].length === 2
          ? fShortenNumber(revenue.current.ads_revenue)
          : fShortenNumber(revenue.current.crm_revenue)
      } - ${Math.trunc(value)}%`;
    }
    return value;
  };

  const formatterTotal = (opts: any) => {
    return getObjectPropSafely(() => revenue.current.total);
  };

  const handleOpenPopup = () => {
    const funcContentSchema = (yup: any) => {
      return {
        crm_target: yup.string(),
        ads_target: yup.string(),
        time: yup.date(),
      };
    };
    const newContentRender = (methods: any) => <PopupObjectiveRevenue {...methods} />;
    const defaultData = {
      crm_target: "",
      ads_target: "",
      time: new Date(),
    };

    setDataPopup({
      ...dataPopup,
      buttonText: "Tạo",
      isOpenPopup: true,
      title: "Mục tiêu",
      defaultData,
      type: "",
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter: false,
      maxWidthForm: "lg",
    });
  };

  const renderFilter = () => {
    return (
      <Stack spacing={1} direction="row" alignItems="center">
        <Box>
          <Button onClick={handleOpenPopup}>
            <Icon icon={archiveFill} width={20} height={20} />
          </Button>
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <MDatePicker
            views={["year", "month"]}
            label="Thời gian"
            minDate={new Date("2012-03-01")}
            // maxDate={new Date("2025-06-01")}
            value={filterDate}
            onChangeDate={setFilterDate}
          />
        </Box>
      </Stack>
    );
  };

  return (
    <RadialBar
      title="Mục tiêu doanh thu tháng"
      data={data}
      titleChart={titleChart}
      subtitleChart={subtitleChart}
      labels={["ADS", "CRM"]}
      isLoading={isLoading}
      contentFilter={renderFilter}
      formatterValue={formatterValue}
      formatterTotal={formatterTotal}
    />
  );
};
export default ObjectiveRevenue;
