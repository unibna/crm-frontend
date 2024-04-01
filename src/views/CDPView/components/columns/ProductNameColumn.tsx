
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ProductNameColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value: undefined; row?: any }) => {
    return <div>{row?.product?.product_name}</div>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ProductNameColumn;
