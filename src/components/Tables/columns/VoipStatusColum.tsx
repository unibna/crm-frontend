import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import { SUCCESS_COLOR, ERROR_COLOR, PRIMARY_COLOR, WARNING_COLOR } from "assets/color";
import vi from "locales/vi.json";
import { SkycallType } from "_types_/SkycallType";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const VoipStatusColum = (props: Props) => {
  const Formatter = ({ value }: { value?: SkycallType["call_status"] }) => {
    return <VoidChip value={value} />;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default VoipStatusColum;

export const VoidChip = ({ value }: { value?: SkycallType["call_status"] }) => {
  let backgroundColor = SUCCESS_COLOR;
  switch (value) {
    case "stop_at_IVR":
      backgroundColor = PRIMARY_COLOR;
      break;
    case "miss_call":
      backgroundColor = ERROR_COLOR;
      break;
    case "stop_at_survey_IVR":
      backgroundColor = WARNING_COLOR;
      break;
    default:
      backgroundColor = SUCCESS_COLOR;
      break;
  }

  return (
    <>
      {value && <Chip size="small" label={vi.skycall_status[value]} style={{ backgroundColor }} />}
    </>
  );
};
