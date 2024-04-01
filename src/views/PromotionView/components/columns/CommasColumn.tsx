import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { COMMAS_REGEX } from "constants/index";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  isShowUnit?: boolean;
}

const CommasColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: number }) => {
    const unitString = props.isShowUnit ? " đ" : "";

    const result = `${Math.trunc(value || 0)
      ?.toString()
      .replace(COMMAS_REGEX, ",")}${unitString}`;

    return <>{result}</>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};
export default CommasColumn;
