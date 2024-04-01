import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { CustomerType } from "_types_/CustomerType";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";
import { fDate } from "utils/dateUtil";
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

const LastOrderColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: unknown; row?: CustomerType }) => {
    return (
      <Stack spacing={1}>
        <MTextLine label="ĐH cuối:" value={fDate(row?.last_order_date) || "---"} />
        <MTextLine
          label="Mã ĐH cuối:"
          value={
            <Link
              href={`${window.location.origin}/orders/${row?.last_order_id}`}
              target="_blank"
              rel="noreferrer"
              color="primary.main"
              style={{ textDecoration: "none" }}
            >
              {row?.last_order_name || ""}
            </Link>
          }
        />
        <MTextLine
          label="Giao hàng thành công lúc:"
          value={fDate(row?.last_shipping_completed_date) || "---"}
        />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default LastOrderColumn;
