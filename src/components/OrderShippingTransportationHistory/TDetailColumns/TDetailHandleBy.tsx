//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { UserTooltip } from "components/Tooltips";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const HandleByColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    return (row?.handle_by && <UserTooltip user={row?.handle_by} />) || <></>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["handle_by"]} />;
};

export default HandleByColumn;
