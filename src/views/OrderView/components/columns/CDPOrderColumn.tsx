//component
import { DataTypeProvider, FilterOperation, Column } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/material";
import { Theme, useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Span } from "components/Labels";

//utils
import find from "lodash/find";
import { domainGhn, domainVnPost, optionStatusShipping } from "views/ShippingView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fNumber } from "utils/formatNumber";

//hooks
import { useMemo } from "react";
import { SHIPPING_COMPANIES } from "_types_/GHNType";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["cdp_order", "cdp_shipping_code", "cdp_payment", "cdp_shipping_status"];

export const CDPOrderColumn = (props: Props) => {
  const Formatter = ({
    value,
    row,
    column,
  }: {
    value: unknown;
    row?: {
      cdp_order?: string;
      cdp_shipping_code?: number;
      cdp_payment?: string;
      cdp_shipping_status?: string;
      delivery_company_type?: SHIPPING_COMPANIES;
      cdp_order_id?: string;
    };
    column: Column;
  }) => {
    const result = find(optionStatusShipping, (item) => item.value === row?.cdp_shipping_status);
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

    const isDeliveryOther = useMemo(() => {
      return row?.delivery_company_type
        ? [
            SHIPPING_COMPANIES.E_COMMERCE,
            SHIPPING_COMPANIES.OTHER,
            SHIPPING_COMPANIES.GRAB,
          ].includes(row?.delivery_company_type)
        : undefined;
    }, [row?.delivery_company_type]);

    let content: JSX.Element = <></>;
    switch (column.name) {
      case "cdp_shipping_code":
        content = isDeliveryOther ? (
          <Typography sx={{ fontSize: 13, ml: 1 }} color="primary">
            {row?.cdp_shipping_code}
          </Typography>
        ) : (
          <Link
            href={
              getObjectPropSafely(() => row?.delivery_company_type) === SHIPPING_COMPANIES.GHN
                ? domainGhn + row?.cdp_shipping_code
                : domainVnPost + row?.cdp_shipping_code
            }
            target="_blank"
            rel="noreferrer"
            sx={{ fontSize: 13 }}
          >
            {row?.cdp_shipping_code}
          </Link>
        );
        break;

      case "cdp_shipping_status":
        content = result?.label ? (
          <Stack direction="column" spacing={1} sx={{ width: 260 }}>
            <Span color={result?.color} sx={styles.chip}>
              {result?.label}
            </Span>
          </Stack>
        ) : (
          <Span color={"default"} sx={styles.chip}>
            Không có dữ liệu
          </Span>
        );
        break;

      case "cdp_payment":
        content = <>{fNumber(value as string)}</>;
        break;
      case "cdp_order":
        content = (
          <Typography sx={{ ...styles.mainText, cursor: "pointer" }} component="p">
            <a
              href={`${window.location.origin}/orders/${row?.cdp_order_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {(value as string) || ""}
            </a>
          </Typography>
        );
        break;

      default:
        break;
    }
    return content;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={COLUMN_NAMES} />;
};
