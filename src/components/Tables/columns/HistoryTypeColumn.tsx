import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import { HISTORY_ACTION_TYPES } from "constants/index";

const COLUMN_NAMES = ["history_type", "change_operation", "action", "history_action", "c_order"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const HistoryTypeColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: string }) => {
    const action = HISTORY_ACTION_TYPES.find((item) => item.value === value);

    return action ? (
      <Chip size="small" variant="outlined" color={action.color as any} label={action?.label} />
    ) : null;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default HistoryTypeColumn;
