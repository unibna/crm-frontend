//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { CopyIconButton } from "components/Buttons";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["landing_page_url"];

const LandingPageColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: string }) => {
    return value ? (
      <div>
        <CopyIconButton value={value || ""} sx={{ svg: { width: 15, height: 15 } }} />
      </div>
    ) : null;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default LandingPageColumn;
