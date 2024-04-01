//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

//utils
import { DISCOUNT_METHOD_VALUES } from "views/PromotionView/constants";

//types
import { DISCOUNT_METHOD } from "_types_/PromotionType";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const DiscountMethodColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: DISCOUNT_METHOD }) => {
    return <div style={styles.typeLabelStyle}>{value ? DISCOUNT_METHOD_VALUES[value] : ""}</div>;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};

export default DiscountMethodColumn;

const styles = {
  typeLabelStyle: {
    fontWeight: "bold",
    fontSize: 13,
  },
};
