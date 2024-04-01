//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { MTextLine, Span } from "components/Labels";
import { SxProps, Theme, useTheme } from "@mui/material";

//types
import { OrderShippingType, OrderType } from "_types_/OrderType";

//utils
import find from "lodash/find";
import { fDateTime } from "utils/dateUtil";
import {
  deliveryCodeUrl,
  optionStatusShipping,
  TYPE_SHIPPING_COMPANIES,
} from "views/ShippingView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { addDays } from "date-fns";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

//hooks
import { useMemo } from "react";
import { OrderShippingDetailColumnProps } from "./OrderShippingDetailColumn";

interface Props extends OrderShippingDetailColumnProps {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["shipping"];

export const OrderShippingColumn = ({ for: columnNames = [], ...props }: Props) => {
  const { shipping_isShowCreateBy = true } = props;
  const Formatter = ({ value, row }: { value: OrderShippingType; row?: OrderType }) => {
    const result = find(optionStatusShipping, (item) => item.value === value?.carrier_status);
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

    const deliveryCompany = useMemo(() => {
      return find(TYPE_SHIPPING_COMPANIES, (item) => item.value === value?.delivery_company_type);
    }, [value?.delivery_company_type]);

    const isRedAlert =
      Boolean(row?.status !== "cancel") &&
      !Boolean(value?.tracking_number) &&
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
        <Span color={result?.color} sx={styles.chip}>
          {result?.label}
        </Span>

        <MTextLine
          label="Mã vận đơn:"
          value={
            value.delivery_company_type ? (
              <Link
                href={deliveryCodeUrl({
                  deliveryType: value.delivery_company_type,
                  trackingNumber: value.tracking_number,
                  source: row?.source,
                })}
                target="_blank"
                rel="noreferrer"
                sx={{ fontSize: 13 }}
              >
                {value?.tracking_number}
              </Link>
            ) : (
              <Typography sx={{ fontSize: 13, ml: 1 }} color="primary">
                {value?.tracking_number}
              </Typography>
            )
          }
          xsLabel={6}
          xsValue={6}
        />
        {shipping_isShowCreateBy && (
          <MTextLine
            label="Người tạo vận đơn:"
            value={getObjectPropSafely(() => value?.created_by?.name)}
            xsLabel={6}
            xsValue={6}
          />
        )}
        <MTextLine
          label="Ngày tạo vận đơn:"
          value={value?.created ? `${fDateTime(value?.created)}` : "---"}
          xsLabel={6}
          xsValue={6}
        />
        <MTextLine
          label="Đơn vị vận chuyển:"
          value={
            <Span sx={styles.chip} color={deliveryCompany?.color || "default"}>
              {deliveryCompany?.label}
            </Span>
          }
          displayType="grid"
          xsLabel={6}
          xsValue={6}
        />
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
