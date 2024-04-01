//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

//types
import { PromotionType } from "_types_/PromotionType";

//utils
import { Span } from "components/Labels";
import { PROMOTION_STATUS_VALUES } from "views/PromotionView/constants";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionStatusColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: PromotionType }) => {
    return (
      <Span color={PROMOTION_STATUS_VALUES.find((item) => item.value === value)?.color}>
        {PROMOTION_STATUS_VALUES.find((item) => item.value === value)?.label}
      </Span>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={["status"]} />;
};

export default PromotionStatusColumn;
