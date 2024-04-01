import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import map from "lodash/map";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ListChipColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: string[] }) => {
    return (
      <>
        {map(value, (item, idx) => (
          <Chip label={item} key={idx} size="small" style={chipStyle} component="span" />
        ))}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};

export default ListChipColumn;

const chipStyle = { marginRight: 4 };
