//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
//date
import { styled } from "@mui/material";
import { fDateTime } from "utils/dateUtil";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  // milliseconds
  period?: number;
}
export default function WarningTimeColumn(props: Props) {
  const Formatter = ({ value }: { value?: string }) => {
    const { period = 0 } = props;
    let backgroundColor: string | undefined = undefined;
    if (value) {
      if (new Date(new Date(value)).getTime() - new Date().getTime() <= period) {
        //appointment_date is past
        backgroundColor = "#e74c3c";
      }
    }
    return (
      <Wrap>
        <Content style={{ backgroundColor }}>{value ? fDateTime(value) : null}</Content>
      </Wrap>
    );
  };

  /**
   * Handle attribute belong to date to format
   */
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={props.for || []} />;
}

const Content = styled("div")({
  padding: "3px 5px",
  borderRadius: 20,
  fontSize: 13,
});

const Wrap = styled("div")({
  display: "flex",
});
