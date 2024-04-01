//date
import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { fDateTime } from "utils/dateUtil";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { HH_mm_ss_dd_MM_yyyy } from "constants/time";

const COLUMN_NAMES = [
  "created",
  "created_at",
  "modified",
  "modified_at",
  "last_login",
  "payment_date",
  "history_date",
];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  label?: string;
  editColumnNames?: string[];
}

function DateTimeColumn({ for: columnNames = [], ...props }: Props) {
  const Formatter = ({ value, column }: { value: string; column: Column }) => {
    return <>{fDateTime(value)}</>;
  };

  const Editor = (editProps: React.PropsWithChildren<DataTypeProvider.ValueEditorProps>) => {
    let t: NodeJS.Timeout;
    useEffect(() => {
      return () => {
        window.clearInterval(t);
      };
    }, []);

    const handleChangeDateTime = (date: any) => {
      editProps.onValueChange(date || null);
      blurInput();
    };

    const blurInput = () => {
      t = setTimeout(() => {
        editProps.onBlur();
      }, 0);
    };

    return (
      <MobileDateTimePicker
        value={fDateTime(editProps.value) || null}
        open
        onChange={() => {}}
        onAccept={handleChangeDateTime}
        onClose={blurInput}
        label={props.label}
        onError={console.log}
        inputFormat={HH_mm_ss_dd_MM_yyyy}
        disableFuture
        mask="___/__/__ __:__ _M"
        renderInput={(params) => <TextField {...params} size="small" variant="standard" />}
      />
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
      editorComponent={(e) =>
        props.editColumnNames?.includes(e.column.name)
          ? Editor(e)
          : Formatter({ value: e.value, column: e.column })
      }
    />
  );
}

export default DateTimeColumn;
