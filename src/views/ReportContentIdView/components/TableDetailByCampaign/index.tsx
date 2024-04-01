// Libraries
import { useState } from "react";
import map from "lodash/map";
import find from "lodash/find";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";
import { useAppSelector } from "hooks/reduxHook";
import { getAllFilterContentId } from "selectors/attributes";

// Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { MTabPanel } from "components/Tabs";
import TableDetail from "components/DataGrid/components/TableDetail";

// Types
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { ContentIdType } from "_types_/ContentIdType";

// Constants & Utils
import { campaignObjective } from "views/ReportContentIdView/constants";
import { capitalizeFirstLetter } from "utils/stringsUtil";
import {
  propsTableDefault,
  summaryColumnDefault,
  arrColumnShowInfo,
  handleDataQualified,
  arrFormatSummaryOptionalDefault,
  handleFormatSummaryDefault,
} from "views/ReportContentIdView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

interface Props {
  params?: Partial<any>;
  endpoint?: string;
  dimension?: string[];
  columns: ColumnShowDatagrid<ContentIdType>;
  handleDataApi?: (item: ContentIdType) => {};
}

export const TableDetailByCampaign = (props: Props) => {
  const { columns } = props;
  const { dataAttributeRule } = useAppSelector((state) => getAllFilterContentId(state.attributes));

  const handleDataApi = (item: ContentIdType) => {
    const { classification = {} } = item;
    const arrClassification = getObjectPropSafely(() => Object.keys(classification));

    return {
      classification: {
        value: map(arrClassification, (current) => current).join(","),
        content: (
          <Stack spacing={1}>
            {map(arrClassification, (current) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" component="span">
                  {current}
                </Typography>
                <Chip
                  size="small"
                  label={getObjectPropSafely(() => classification[current])}
                  sx={{
                    backgroundColor: find(dataAttributeRule, (option) => option.name === current)
                      ?.colorcode,
                    color: "#fff",
                  }}
                />
              </Stack>
            ))}
          </Stack>
        ),
      },
      ...handleDataQualified(item),
    };
  };

  return (
    <TableDetail
      {...propsTableDefault}
      heightProps={700}
      host={reportMarketing}
      handleDataApi={handleDataApi}
      contentColumnShowInfo={{
        arrColumnShowInfo: arrColumnShowInfo,
        infoCell: columns.columnShowTable,
      }}
      contentSummary={{
        arrFormatSummaryOptional: arrFormatSummaryOptionalDefault,
        handleFormatSummary: (columnName: string | number, totalRow: Partial<any>) =>
          handleFormatSummaryDefault(columnName, totalRow, { dataAttributeRule }),
      }}
      columnShowDetail={columns}
      summaryDataColumns={summaryColumnDefault}
      {...props}
    />
  );
};

const TabDetailByCampaign = (props: Props) => {
  const { params, dimension = ["campaign_objective", "campaign_name"] } = props;
  const [value, setValue] = useState(0);

  const handleChangeTab = (_: any, newValue: any) => {
    setValue(newValue);
  };

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
          {campaignObjective.map((tab: any) => (
            <Tab disableRipple key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {campaignObjective.map((tab: any, index: number) => (
        <MTabPanel value={value} index={index} key={tab.value}>
          <TableDetailByCampaign
            {...props}
            params={{
              ...params,
              campaign_objective: capitalizeFirstLetter(tab.value),
              dimension,
            }}
          />
        </MTabPanel>
      ))}
    </Card>
  );
};

export default TabDetailByCampaign;
