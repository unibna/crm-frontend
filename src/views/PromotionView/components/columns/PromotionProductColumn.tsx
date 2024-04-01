import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { PromotionType, PROMOTION_TYPE } from "_types_/PromotionType";
import { ProductItem } from "components/ProductComponent";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionProductColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: any; row?: PromotionType }) => {
    const isVariantPromotion = row?.type === PROMOTION_TYPE.VARIANT;

    return (
      <>
        {value && isVariantPromotion && (
          <ProductItem
            product={value}
            index={0}
            isShowBundle={false}
            sx={{ hr: { display: "none" } }}
            hiddenColumns={["price", "cross_sale", "total", "quantity", "listed_price"]}
          />
        )}
      </>
    );
  };
  return (
    <DataTypeProvider formatterComponent={Formatter} {...props} for={[...(props.for || [])]} />
  );
};

export default PromotionProductColumn;
