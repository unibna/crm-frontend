import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import RankField from "../CustomerDetail/Overview/RankField";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const RankColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: any }) => {
    return <RankField value={value} />;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default RankColumn;
