//date
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { fDateTime, formatISOToLocalDateString } from "utils/dateUtil";
import Typography from "@mui/material/Typography";

const COLUMN_NAMES = ["calldate"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

function CallDateColumn(props: Props) {
  const Formatter = ({ value }: { value: string }) => {
    return (
      <Typography fontSize={13}>
        {value ? fDateTime(formatISOToLocalDateString(value)) : ""}
      </Typography>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={COLUMN_NAMES} />;
}

export default CallDateColumn;
