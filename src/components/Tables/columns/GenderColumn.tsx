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

const GenderColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: number }) => {
    return <>{value === 1 ? "Nam" : "Nữ"}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default GenderColumn;
