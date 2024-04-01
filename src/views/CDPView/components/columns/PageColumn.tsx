
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

const PageColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: { page_id: string; name: string } }) => {
    return <>{value ? value.name : ""}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default PageColumn;
