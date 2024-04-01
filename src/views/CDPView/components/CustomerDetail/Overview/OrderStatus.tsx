import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import map from "lodash/map";
import vi from "locales/vi.json";
import { LABEL_STATUS_SHIPPING } from "constants/shipping";

export const STATUS_SHIPPING_ORDER_CUSTOMER = {
  no_shipping: "Chưa có mã vận đơn",
  ...LABEL_STATUS_SHIPPING,
};

const OrderStatus = ({ analystData, total }: { analystData: number[]; total: number }) => {
  return (
    <Stack direction="row" flexWrap="wrap" pb={1}>
      <Chip
        label={`${vi.order_total}: ${total}`}
        size="small"
        color="primary"
        style={{ marginTop: 8, marginRight: 4 }}
      />
      {map(
        Object.keys(STATUS_SHIPPING_ORDER_CUSTOMER),
        (item: keyof typeof STATUS_SHIPPING_ORDER_CUSTOMER, idx) => (
          <Chip
            key={idx}
            label={`${STATUS_SHIPPING_ORDER_CUSTOMER[item]}: ${analystData[idx] || 0}`}
            size="small"
            style={{ marginTop: 8, marginRight: 4 }}
          />
        )
      )}
    </Stack>
  );
};

export default OrderStatus;
