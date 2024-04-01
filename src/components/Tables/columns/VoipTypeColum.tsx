import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import { SkycallType } from "_types_/SkycallType";
import { LINK_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "assets/color";
import vi from "locales/vi.json";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const VoipTypeColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: SkycallType["call_type"] }) => {
    let backgroundColor = SUCCESS_COLOR;
    switch (value) {
      case "callout":
        backgroundColor = LINK_COLOR;
        break;
      case "internal":
        backgroundColor = WARNING_COLOR;
        break;
      default:
        backgroundColor = SUCCESS_COLOR;
        break;
    }

    return (
      <>
        {value && <Chip size="small" label={vi.skycall_type[value]} style={{ backgroundColor }} />}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default VoipTypeColumn;
