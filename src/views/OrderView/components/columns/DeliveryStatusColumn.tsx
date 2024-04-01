import { Link, SxProps, Theme, useTheme } from "@mui/material";
import { MTextLine, Span } from "components/Labels";
import find from "lodash/find";
import { optionStatusShipping } from "views/ShippingView/constants";
import Stack from "@mui/material/Stack";

export const DeliveryStatusColumn = ({
  deliveryStatus,
  orderKey,
  orderId,
  shippingUnit,
}: {
  deliveryStatus: string;
  orderKey: string;
  orderId: string;
  shippingUnit?: string;
}) => {
  const result = find(optionStatusShipping, (item) => {
    return item.value === deliveryStatus;
  });
  const theme = useTheme();

  const styles: SxProps<Theme> = {
    mainText: {
      fontWeight: 600,
      fontSize: "0.975rem",
      color: theme.palette.primary.main,
      display: "block",
    },
    chip: {
      width: "fit-content",
      whiteSpace: "break-spaces",
      lineHeight: "150%",
      height: "auto",
      padding: "4px 8px",
    },
  };

  return result?.label ? (
    <Stack direction="column" spacing={1}>
      <Link
        href={`${window.location.origin}/orders/${orderId}`}
        target="_blank"
        rel="noreferrer"
        style={{ fontWeight: 400, fontSize: 14 }}
      >
        {orderKey}
      </Link>
      <MTextLine label="Đơn vị giao hàng:" value={shippingUnit} />
      <MTextLine
        label="Trạng thái vận đơn:"
        value={
          <Span color={result?.color} sx={styles.chip}>
            {result?.label}
          </Span>
        }
      />
    </Stack>
  ) : (
    <Span color={"default"} sx={styles.chip}>
      Không có dữ liệu
    </Span>
  );
};
