//component
import Chip from "@mui/material/Chip";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import find from "lodash/find";
import { FULL_LEAD_STATUS_OPTIONS } from "views/LeadCenterView/constants";
import { leadStatusColor } from "features/lead/formatStatusColor";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const LeadStatusColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value: any; row?: any }) => {
    const status = find(FULL_LEAD_STATUS_OPTIONS, (item) => item.value.toString() === value);

    return (
      <>
        {status ? (
          <Chip
            size="small"
            variant="outlined"
            label={`${status.label} ${row?.phone_data_status ? ` - ${row.phone_data_status}` : ""}`}
            style={{
              backgroundColor: leadStatusColor(value, row?.phone_data_status),
              borderColor: leadStatusColor(value, row?.phone_data_status),
              color: "#fff",
            }}
          />
        ) : null}
      </>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default LeadStatusColumn;
