import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { fNumber } from "utils/formatNumber";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const NumberColumn = (props: Props) => {
  const Formatter = ({ value }: { value: string }) => {
    return <Typography fontSize={13}>{fNumber(value)}</Typography>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};
export default NumberColumn;
