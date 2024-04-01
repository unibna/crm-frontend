import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const BooleanColumn = ({ for: columnNames = ["boolean_folumn"], ...props }: Props) => {
  const Formatter = ({ value }: { value?: boolean }) => {
    return (
      <>
        {value ? (
          <OfflinePinIcon style={{ marginLeft: 20, fontSize: 20, color: "#389b33" }} />
        ) : (
          <CancelIcon style={{ marginLeft: 20, fontSize: 20, color: "#DC3F34" }} />
        )}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};

export default BooleanColumn;
