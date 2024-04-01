import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { fNumber } from "utils/formatNumber";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const BillSecColumn = (props: Props) => {
  const Formatter = ({ value = "0" }: { value?: string }) => {
    const result =
      value === "0" || !value ? 0 : fNumber(parseFloat(`${parseInt(value) / 60}`).toFixed(2));
    return (
      <>
        {`${result} `}
        {value === "0" || !value ? (
          ""
        ) : (
          <span style={{ fontSize: 13 }}>{`(${fNumber(value)}s)`}</span>
        )}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default BillSecColumn;
