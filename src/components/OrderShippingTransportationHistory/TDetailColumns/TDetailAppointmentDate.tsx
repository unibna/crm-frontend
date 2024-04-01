//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { fDateTime } from "utils/dateUtil";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const AppointmentDateColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    return <>{fDateTime(row?.appointment_date)}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["appointment_date"]} />;
};

export default AppointmentDateColumn;
