// Components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Checkbox from "@mui/material/Checkbox";

interface Props {
  for: Array<string>;
  scale?: boolean;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onChangeCheckColumn?: any;
}

const ColumnHandleCheckBox = (props: Props) => {
  const { onChangeCheckColumn } = props;
  const Formatter = ({ value, row }: { value?: boolean; row?: any }) => {
    return (
      <Checkbox
        onChange={(e) => onChangeCheckColumn(e.target.checked, row)}
        checked={value}
        name="checkedB"
        color="primary"
        style={checkboxStyle}
        sx={{ ml: 0.7 }}
      />
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnHandleCheckBox;

const checkboxStyle = { paddingLeft: 0 };
