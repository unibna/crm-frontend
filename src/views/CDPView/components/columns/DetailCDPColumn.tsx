import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Button from "@mui/material/Button";
import vi from "locales/vi.json";
import { CustomerType } from "_types_/CustomerType";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  pickCustomer?: (customer: CustomerType) => void;
}

const DetailCDPColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: any; row?: any }) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => row?.phone && props.pickCustomer && props.pickCustomer(row)}
        sx={{ padding: 0.3, fontWeight: "400", fontSize: 13 }}
      >
        {vi.button.detail}
      </Button>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default DetailCDPColumn;
