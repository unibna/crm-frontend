// Libraries
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";
import reduce from "lodash/reduce";
import compact from "lodash/compact";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

// Components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import { MTabPanel } from "components/Tabs";
import Tab from "@mui/material/Tab";
import TableDetail from "components/DataGrid/components/TableDetail";

// Constants & Utils
import { fDateTime } from "utils/dateUtil";
import {
  columnShowPhoneLead,
  handleDataPhoneLead,
} from "views/ReportContentIdView/constants/phoneLead";
import { propsTableDefault, arrColumnShowInfo } from "views/ReportContentIdView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { ROLE_TAB } from "constants/rolesTab";
import { ContentIdType } from "_types_/ContentIdType";
import { skycallApi } from "_apis_/skycall.api";

interface Props {
  params?: Partial<any>;
  handleDataApi?: (item: ContentIdType) => {};
  tabHeaderDetail?: { label: string; value: string }[];
}

export const TableDetailByPhone = (props: Props) => {
  const theme = useTheme();
  const { dataAttributeRule } = useAppSelector((state) => getAllFilterContentId(state.attributes));

  const handleDataApi = (item: any) => {
    return {
      phone_order_number: {
        value: getObjectPropSafely(() => item.phone_order_number),
        props: {
          domain: `/${ROLE_TAB.ORDERS}/`,
          variant: "body2",
          color: theme.palette.info.main,
          isCallApi: true,
        },
      },
      phone_reason:
        getObjectPropSafely(() => item.phone_reason.bad_data_reason) ||
        getObjectPropSafely(() => item.phone_reason.fail_reason) ||
        getObjectPropSafely(() => item.phone_reason.handle_reason),
      ...(props.handleDataApi && props.handleDataApi(item)),
      ...handleDataPhoneLead(item, { dataAttributeRule }),
    };
  };

  const handleAsyncFormatData = async (data: any) => {
    let dataClone = [...data];
    const phones = reduce(
      dataClone,
      (prev, cur) => {
        return [...prev, cur.phone];
      },
      []
    );

    const compactPhones = compact(phones);
    if (compactPhones.length) {
      const callCount = await skycallApi.get({
        endpoint: "sky-calls/count/",
        params: { phone: compactPhones },
      });
      if (callCount.data) {
        const { results = [] } = callCount.data;
        dataClone = reduce(
          dataClone,
          (prev, cur) => {
            const phoneCount = results.find(
              (item: { phone: string; count: number }) => item.phone === cur.phone
            ) as { phone: string; count: number } | undefined;
            return [...prev, { ...cur, phone_count: phoneCount?.count || 0 }];
          },
          []
        );
      }
    }
    return dataClone;
  };

  return (
    <TableDetail
      {...propsTableDefault}
      host={reportMarketing}
      handleDataApi={handleDataApi}
      handleAsyncFormatData={handleAsyncFormatData}
      columnShowDetail={columnShowPhoneLead}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columnShowPhoneLead.columnShowTable,
      }}
      isShowCalltime
      endpoint="phonelead/"
      {...props}
    />
  );
};

const TabDetailByPhone = (props: Props) => {
  const { params, tabHeaderDetail = [] } = props;
  const [value, setValue] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");

  useEffect(() => {
    getTrackingTime(value);
  }, [value]);

  const getTrackingTime = async (value: any) => {
    const result: any = await dashboardMkt.get(
      {
        task: value !== 3 ? "fb_phone_lead" : "gg_phone_lead",
      },
      "tracking/time/"
    );

    if (result && result.data) {
      const { last_update_at } = result.data;
      setLastUpdatedAt(last_update_at);
    }
  };

  const handleChangeTab = (_: any, newValue: any) => {
    setValue(newValue);
  };

  const arrRenderTableDetail = useMemo(() => ["COMMENT", "INBOX", "FBLADI", "GGLADI"], []);

  return (
    <Card sx={{ maxWidth: "1280px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", p: 2 }}>
        <Tabs
          value={value}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
        >
          {tabHeaderDetail.map((tab: any) => (
            <Tab disableRipple key={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <Typography sx={{ fontWeight: 600, fontSize: "0.8125rem", mt: 2 }}>{`Cập nhật lần cuối: ${
          lastUpdatedAt ? fDateTime(lastUpdatedAt) : "---"
        }`}</Typography>
      </Box>

      {map(arrRenderTableDetail, (item, index) => (
        <MTabPanel value={value} index={index}>
          <TableDetailByPhone
            {...props}
            params={{ ...params, type: item, ordering: "-phone_created" }}
          />
        </MTabPanel>
      ))}
    </Card>
  );
};

export default TabDetailByPhone;
