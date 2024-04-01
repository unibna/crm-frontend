import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { OrderStatusValue } from "_types_/OrderType";
import Chip from "@mui/material/Chip";
import { ORDER_STATUS_VALUE } from "views/OrderView/constants";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const OrderStatusColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: { status: OrderStatusValue } }) => {
    return (
      <Chip
        size="small"
        color={ORDER_STATUS_VALUE[value?.status || "all"].color}
        label={ORDER_STATUS_VALUE[value?.status || "all"].value}
      />
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default OrderStatusColumn;
