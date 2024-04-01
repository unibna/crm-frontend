import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Theme, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import vi from "locales/vi.json";
import { MTextLine, Span } from "components/Labels";
import { UserTooltip } from "components/Tooltips";
import { CopyIconButton } from "components/Buttons";
import { find } from "lodash";
import { useMemo } from "react";
import { fDateTime } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { deliveryCodeUrl, optionStatusShipping } from "views/ShippingView/constants";

const commonTextLineProps: any = {
  displayType: "grid",
  xsLabel: 4,
  xsValue: 8,
};

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

function ShippingInfoColumn(shipping: Props) {
  const Formatter = ({ row }: { row?: any }) => {
    const { shipping, order } = row || {};
    const theme = useTheme();
    const styles = styled(theme);

    const objStatusShipping = useMemo(() => {
      return find(optionStatusShipping, (current) => current.value === shipping.carrier_status);
    }, []);

    return (
      <Stack
        spacing={1}
        display="flex"
        direction="column"
        justifyContent="flex-start"
        sx={{ width: 440 }}
      >
        <Box position="relative" sx={{ width: "min-content", mt: 1.5 }}>
          <Typography sx={{ ...styles.mainText, cursor: "pointer" }} component="p">
            {shipping.tracking_number ? (
              <Tooltip title={vi.press_to_copy}>
                <CopyIconButton sx={styles.copyIconStyle} value={shipping.tracking_number || ""} />
              </Tooltip>
            ) : null}
            <a
              href={deliveryCodeUrl({
                deliveryType: shipping.delivery_company_type,
                source: order?.source,
                trackingNumber: shipping.tracking_number,
              })}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.mainText, textDecoration: "none" }}
            >
              #{shipping.tracking_number}
            </a>
          </Typography>
        </Box>
        <MTextLine
          label="Trạng thái vận đơn:"
          value={<Span color={objStatusShipping?.color}>{objStatusShipping?.label}</Span>}
          {...commonTextLineProps}
        />

        <MTextLine
          label="Ngày tạo MVĐ:"
          value={getObjectPropSafely(() => fDateTime(shipping.created))}
          {...commonTextLineProps}
        />
        <MTextLine
          label="Người tạo MVĐ:"
          value={shipping.created_by ? <UserTooltip user={shipping.created_by} /> : "---"}
          {...commonTextLineProps}
        />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...shipping} for={["shipping"]} />;
}

export default ShippingInfoColumn;

const styled = (theme: Theme) => {
  return {
    mainText: {
      fontWeight: 400,
      fontSize: 14,
      color: theme.palette.primary.main,
    },
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
    },
    infoChip: {
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "24px",
      background: theme.palette.primary.main,
      padding: "2px 8px",
      color: theme.palette.primary.contrastText,
    },
    copyIconStyle: {
      position: "absolute",
      top: -12,
      right: -16,
      fontSize: 20,
      cursor: "pointer",
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark,
        transition: "all .15s ease-in-out",
      },
      svg: {
        width: 15,
        height: 15,
      },
    },
  } as { [key: string]: any };
};
