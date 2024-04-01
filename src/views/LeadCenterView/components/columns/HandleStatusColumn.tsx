//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import vi from "locales/vi.json";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["handle_status"];

const HandleStatusColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: { id: number; name: string } }) => {
    return <>{value ? vi.call_amount + " " + value : vi.not}</>;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default HandleStatusColumn;
