import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { MTextLine, Span } from "components/Labels";
import { find } from "lodash";
import { useMemo } from "react";
import { fDateTime } from "utils/dateUtil";
import { TYPE_SHIPPING_COMPANIES } from "views/ShippingView/constants";

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
    const shipping = row?.shipping;

    const deliveryCompany = useMemo(() => {
      return find(
        TYPE_SHIPPING_COMPANIES,
        (item) =>
          item.value === shipping.delivery_company_type ||
          item.value === shipping?.delivery_company?.type
      );
    }, []);

    return (
      <Stack
        spacing={1}
        display="flex"
        direction="column"
        justifyContent="flex-start"
        sx={{ width: 440 }}
      >
        <MTextLine
          label="Đơn vị vận chuyển:"
          value={
            deliveryCompany ? (
              <Span color={deliveryCompany.color}>{deliveryCompany.label}</Span>
            ) : (
              "---"
            )
          }
          {...commonTextLineProps}
        />
        <MTextLine
          label="Ngày GH dự kiến:"
          value={
            shipping.expected_delivery_time ? fDateTime(shipping.expected_delivery_time) : "---"
          }
          {...commonTextLineProps}
        />
        <MTextLine
          label="Ngày GH thành công:"
          value={shipping.finish_date ? fDateTime(shipping.finish_date) : "---"}
          {...commonTextLineProps}
        />
      </Stack>
    );
  };
  return (
    <DataTypeProvider formatterComponent={Formatter} {...shipping} for={["shipping_modified"]} />
  );
}

export default ShippingInfoColumn;
