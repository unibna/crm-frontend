//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import { TransportationHandleStatusType } from "_types_/TransportationType";
import { TRANSPORTATION_STATUS } from "views/TransportationCareView/constant";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const HandleStatusColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: TransportationHandleStatusType }) => {
    const status = TRANSPORTATION_STATUS.find((item) => item?.value === value);
    return <Chip label={status?.label} size="small" color={status?.color} />;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["status"]} />;
};

export default HandleStatusColumn;
