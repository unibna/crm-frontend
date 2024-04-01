//components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { MTextLine } from "components/Labels";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

//icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

//types
import { OrderPaymentTypeV2, OrderType } from "_types_/OrderType";

//utils
import { fNumber } from "utils/formatNumber";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["payment"];

export const OrderPaymentColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value, row }: { value: Partial<OrderPaymentTypeV2>[]; row?: OrderType }) => {
    return (
      <>
        <Stack direction="column" spacing={1} sx={{ width: 260 }}>
          <MTextLine
            label="Tiền hàng:"
            value={fNumber(row?.total_variant_actual) || "---"}
            xsLabel={5}
            xsValue={7}
          />

          {row?.fee_delivery ? (
            <MTextLine
              label={
                <Stack alignItems="center" direction="row">
                  <AddCircleIcon fontSize="small" color="success" />
                  <Typography fontSize={13}>Phí ship:</Typography>
                </Stack>
              }
              value={fNumber(row?.fee_delivery) || "---"}
              xsLabel={5}
              xsValue={7}
            />
          ) : null}

          {row?.fee_additional ? (
            <MTextLine
              label={
                <Stack alignItems="center" direction="row">
                  <AddCircleIcon fontSize="small" color="success" />
                  <Typography fontSize={13}>Phụ thu:</Typography>
                </Stack>
              }
              value={fNumber(row?.fee_additional) || "---"}
              xsLabel={5}
              xsValue={7}
            />
          ) : null}

          {row?.discount_input ? (
            <MTextLine
              label={
                <Stack alignItems="center" direction="row">
                  <DoDisturbOnIcon fontSize="small" color="error" />
                  <Typography fontSize={13}>Giảm giá:</Typography>
                </Stack>
              }
              value={fNumber(row?.discount_input) || "---"}
              xsLabel={5}
              xsValue={7}
            />
          ) : null}

          {row?.discount_promotion ? (
            <MTextLine
              label={
                <Stack alignItems="center" direction="row">
                  <DoDisturbOnIcon fontSize="small" color="error" />
                  <Typography fontSize={13}>Khuyến mãi:</Typography>
                </Stack>
              }
              value={fNumber(row?.discount_promotion) || "---"}
              xsLabel={5}
              xsValue={7}
            />
          ) : null}

          <MTextLine
            label="Tổng đơn hàng:"
            value={fNumber(row?.total_actual) || "---"}
            xsLabel={5}
            xsValue={7}
          />
        </Stack>
      </>
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
