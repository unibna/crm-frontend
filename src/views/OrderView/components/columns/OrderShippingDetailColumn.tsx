//component
import { MTextLine, Span } from "components/Labels";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Theme, useTheme, SxProps } from "@mui/material";
import Stack from "@mui/material/Stack";
//types
import { OrderShippingType, OrderType } from "_types_/OrderType";

//utils
import find from "lodash/find";
import { fDateTime } from "utils/dateUtil";
import { optionStatusShipping } from "views/ShippingView/constants";
import { addDays } from "date-fns";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

export interface OrderShippingDetailColumnProps {
  shipping_isShowCreateBy?: boolean;
  shipping_isShowExpectedDate?: boolean;
  shipping_isShowFromAddress?: boolean;
  shipping_isShowToAddress?: boolean;
}
interface Props extends OrderShippingDetailColumnProps {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["expected_delivery_time"];

export const OrderShippingDetailColumn = ({ for: columnNames = [], ...props }: Props) => {
  const {
    shipping_isShowExpectedDate = true,
    shipping_isShowFromAddress = true,
    shipping_isShowToAddress = true,
  } = props;
  const Formatter = ({ value, row }: { value: OrderShippingType; row?: OrderType }) => {
    const shipping = row?.shipping;
    const result = find(optionStatusShipping, (item) => item.value === shipping?.carrier_status);
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

    const isRedAlert =
      Boolean(row?.status !== "cancel") &&
      !Boolean(shipping?.tracking_number) &&
      Boolean(row?.modified) &&
      Boolean(differenceInCalendarDays(new Date(), addDays(new Date(row?.modified || ""), 4)) >= 0);

    if (isRedAlert)
      return (
        <Span color={"error"} sx={styles.chip}>
          Chưa có mã vận đơn
        </Span>
      );

    return result?.label ? (
      <Stack direction="column" spacing={1} sx={{ width: 260 }}>
        {shipping_isShowExpectedDate && (
          <MTextLine
            label="Ngày giao dự kiến:"
            value={
              shipping?.expected_delivery_time ? fDateTime(shipping?.expected_delivery_time) : "---"
            }
            xsLabel={6}
            xsValue={6}
          />
        )}

        {shipping_isShowFromAddress && (
          <MTextLine
            label="Địa chỉ giao:"
            value={shipping?.return_full_address || "---"}
            xsLabel={6}
            xsValue={6}
          />
        )}
        {shipping_isShowToAddress && (
          <MTextLine
            label="Địa chỉ nhận:"
            value={shipping?.to_full_address || "---"}
            xsLabel={6}
            xsValue={6}
          />
        )}
        <MTextLine label="Ghi chú:" value={row?.delivery_note || "---"} xsLabel={6} xsValue={6} />
      </Stack>
    ) : (
      <Span color={"default"} sx={styles.chip}>
        Không có dữ liệu
      </Span>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
