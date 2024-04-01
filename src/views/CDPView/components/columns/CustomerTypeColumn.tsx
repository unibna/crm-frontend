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

const CustomerTypeColumn = (props: Props) => {
  const Formatter = ({ value }: { value: "SCN" | "LEN" | "VON" }) => {
    let result = "";
    switch (value) {
      case "VON":
        result = "Voip";
        break;

      case "LEN":
        result = "Lead";
        break;

      default:
        result = "CDP";
        break;
    }
    return <>{result}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default CustomerTypeColumn;
