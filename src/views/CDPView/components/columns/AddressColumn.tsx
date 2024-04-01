import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { AddressType } from "_types_/AddressType";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const AddressColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: AddressType[] }) => {
    const address = value?.find((item) => item.is_default) || value?.[0];
    return <>{address?.address}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default AddressColumn;
