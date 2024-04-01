import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import { RANK_STATUS } from "views/CDPView/constants";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const RankStatusColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: any }) => {
    const rankStatus = RANK_STATUS.find((status) => status.value === value);
    return rankStatus ? (
      <Chip
        label={rankStatus.label}
        size="small"
        style={{
          borderColor: rankStatus.color,
          backgroundColor: rankStatus.color,
          color: "#ffffff",
          fontWeight: "bold",
        }}
        variant="outlined"
      />
    ) : null;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default RankStatusColumn;
