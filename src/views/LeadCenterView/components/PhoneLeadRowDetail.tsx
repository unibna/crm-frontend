import { styled, useMediaQuery, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { PhoneLeadTabNameType } from "_types_/PhoneLeadType";
import { TabWrap } from "components/Tabs";
import { translate } from "constants/translate";
import map from "lodash/map";
import React, { memo, useMemo } from "react";
import { PHONE_LEAD_DETAIL_HEADER_TAB } from "../constants";
import IPExistedTable from "./tables/IPExistedTable";
import PhoneExistedTable from "./tables/PhoneExistedTable";
import PhoneLeadHistoryTable from "./tables/PhoneLeadHistoryTable";

interface Props {
  id: string;
  phone: string;
  isFullTable: boolean;
  ipAddress?: string;
  tabName?: PhoneLeadTabNameType;
}
const PhoneLeadRowDetail = memo(({ id, phone, isFullTable, ipAddress, tabName }: Props) => {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const tabPanelStyle: React.CSSProperties = useMemo(
    () => ({
      minWidth: isTablet ? 40 : 90,
      width: isTablet ? 40 : 90,
      fontSize: isTablet ? 11 : 13,
    }),
    [isTablet]
  );

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        minHeight: 200,
      }}
    >
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider", overflow: "unset", marginRight: 1 }}
      >
        {map(PHONE_LEAD_DETAIL_HEADER_TAB, (tab: keyof typeof translate, index) => (
          <TabHeader label={translate[tab]} key={index} style={tabPanelStyle} />
        ))}
      </Tabs>

      <TabWrap value={value} index={0}>
        <PhoneLeadHistoryTable id={id} isFullTable={isFullTable} tabName={tabName} />
      </TabWrap>
      <TabWrap value={value} index={1}>
        <PhoneExistedTable phone={phone} />
      </TabWrap>
      <TabWrap value={value} index={2}>
        <IPExistedTable ipAddress={ipAddress} />
      </TabWrap>
    </div>
  );
});

export default PhoneLeadRowDetail;

const TabHeader = styled(Tab)`
  font-size: 13px;
  margin: 5px !important;
`;
