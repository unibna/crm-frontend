import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { CustomerType } from "_types_/CustomerType";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";
import { fDate } from "utils/dateUtil";
import { fNumber } from "utils/formatNumber";
import Link from "@mui/material/Link";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const OrderColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: unknown; row?: CustomerType }) => {
    return (
      <Stack spacing={1}>
        <MTextLine label="Số ĐH giao thành công:" value={row?.shipping_completed_order} />
        <MTextLine label="Tổng đơn hàng:" value={row?.total_order} />
        <MTextLine
          label="Doanh thu ĐH giao thành công:"
          value={fNumber(row?.shipping_completed_spent || 0)}
        />
        {/* <MTextLine label="Tổng doanh thu:" value={fNumber(row?.total_spent) || "--"} /> */}
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default OrderColumn;
