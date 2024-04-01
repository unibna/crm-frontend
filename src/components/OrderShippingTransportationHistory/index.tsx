import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import vi from "locales/vi.json";
import { TabWrap } from "components/Tabs";
import useSettings from "hooks/useSettings";
import map from "lodash/map";
import React, { useEffect, useMemo, useState } from "react";
import { a11yPropsUtil } from "utils/a11yPropsUtil";
import { handleSizeTable } from "utils/tableUtil";
import OrderHistoryTable from "./OrderHistoryTable";
import ShippingHistoryTable from "./ShippingHistoryTable";
import TransportationHistoryTable from "./TransportationHistoryTable";

interface Props {
  row: any;
  isFullTable?: boolean;
  pickCategoriesHistory: string[];
  defaultTab?: string;
}
export const OrderShippingTransportationHistory = ({
  row,
  isFullTable,
  pickCategoriesHistory,
  defaultTab,
}: Props) => {
  const theme = useTheme();
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";

  const [value, setValue] = useState(0);

  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const defaultTabIndex =
    (defaultTab && pickCategoriesHistory.findIndex((item) => item === defaultTab)) || -1;

  const tabPanelStyle: React.CSSProperties = useMemo(
    () => ({ minWidth: 90, width: 90, fontSize: 13 }),
    []
  );

  useEffect(() => {
    setValue((defaultTabIndex !== -1 && defaultTabIndex) || 0);
  }, [defaultTabIndex]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        variant="scrollable"
        orientation={"vertical"}
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mr: 1,
          borderRight: 1,
          borderBottom: 0,
          borderColor: "divider",
          ...tabPanelStyle,
        }}
      >
        {map(pickCategoriesHistory, (tab, index) => (
          <Tab
            label={vi[tab]}
            {...a11yPropsUtil(index)}
            key={index}
            style={{ marginRight: 8, fontSize: 13, ...tabPanelStyle }}
          />
        ))}
      </Tabs>
      {map(pickCategoriesHistory, (tab, idx) => {
        return (
          <TabWrap value={value} index={idx} key={idx}>
            <Box
              style={{ width: handleSizeTable(isTablet, !!(isCollapse && !isTablet)).width }}
              key={idx}
            >
              {tab === "ORDER_HISTORY" ? <OrderHistoryTable orderID={row?.order?.id} /> : null}
              {tab === "SHIPPING_HISTORY" ? (
                <ShippingHistoryTable isFullTable={isFullTable} row={row?.shipping} />
              ) : null}

              {tab === "TRANSPORTATION_HISTORY" ? (
                <TransportationHistoryTable isFullTable={isFullTable} id={row?.order?.id} />
              ) : null}
            </Box>
          </TabWrap>
        );
      })}
    </Box>
  );
};
