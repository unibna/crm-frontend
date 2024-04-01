import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { fDate, fDateTime, formatISOToLocalDateString } from "utils/dateUtil";

const COLUMN_NAME_DEFAULT = [
  "updated_time",
  "updated_at",
  "created_time",
  "created_at",
  "start_time",
  "stop_time",
  "tracking_created_at",
  "finish_date",
  "last_handle",
  "history_date",
  "created_time",
  "modified",
  "created",
  "last_order_date",
  "delivered_date",
  "crm_date",
  "latest_delivered_date",
  "cod_receipt_date",
  "prev_order_date",
];
interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  arrTimeColumn?: string[];
  isFormatISO?: boolean;
}

function DateColumn({ for: columnNames = [], ...props }: Props) {
  const Formatter = ({ value, column }: { value: string; column: Column }) => {
    if (!value) {
      return <Typography></Typography>;
    }
    
    let result = value;
    if (props.isFormatISO) {
      result = formatISOToLocalDateString(value);
    }

    const { arrTimeColumn = COLUMN_NAME_DEFAULT } = props;

    return (
      <Typography fontSize={13}>
        {result ? (arrTimeColumn?.includes(column.name) ? fDateTime(result) : fDate(result)) : ""}
      </Typography>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAME_DEFAULT, ...columnNames]}
    />
  );
}

export default DateColumn;
