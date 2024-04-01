// Libraries
import { memo, useState } from "react";
import isEqual from "lodash/isEqual";

// Context
import { DetailWarehouseProvider } from "views/WarehouseView/contextDetailWarehouse";

// Components
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Inventory from "views/WarehouseView/components/Inventory";
import WarehouseLogs from "views/WarehouseView/components/WarehouseLogs";

// @Types
import { WarehouseType } from "_types_/WarehouseType";
interface Props {
  data: WarehouseType;
}

const TAB_HEADER_DETAIL_WAREHOUSE = [
  {
    value: "inventory",
    label: "Tồn kho",
    component: (data: WarehouseType) => <Inventory data={data} />,
  },
  {
    value: "logs",
    label: "Lịch sử",
    component: (data: WarehouseType) => <WarehouseLogs data={data} />,
  },
];

const DetailWarehouse = (props: Props) => {
  const [currentTab, setCurrentTab] = useState("inventory");

  return (
    <DetailWarehouseProvider>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {TAB_HEADER_DETAIL_WAREHOUSE.map((tab: any) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />

      {TAB_HEADER_DETAIL_WAREHOUSE.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component(props.data)}</Box>;
      })}
    </DetailWarehouseProvider>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (!isEqual(prevProps.data, nextProps.data)) {
    return false;
  }
  return true;
};

export default memo(DetailWarehouse, areEqual);
