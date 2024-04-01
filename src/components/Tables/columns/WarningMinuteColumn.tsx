import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { styled } from "@mui/material";

interface Props {
  for?: Array<string>;
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  period?: number;
}

const WarningMinuteColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: number }) => {
    const { period = 10080 } = props;
    const labelStyle = {
      backgroundColor: value && value > period ? "#e74c3c" : undefined,
    };

    return <MinuteLabel style={labelStyle}>{value}</MinuteLabel>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={props.for || []} />;
};
export default WarningMinuteColumn;

const MinuteLabel = styled("div")({
  fontWeight: "bold",
  padding: "2px 8px",
  borderRadius: 15,
});
