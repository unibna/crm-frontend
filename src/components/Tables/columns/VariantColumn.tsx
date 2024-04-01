import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { AttributeVariant } from "_types_/ProductType";
import map from "lodash/map";
import { VariantPromotionItem } from "views/PromotionView/components/VariantPromotionItem";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  hiddenFields?: ["image" | "name" | "SKU_code" | "quantity"];
}

const VariantColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: AttributeVariant[] | AttributeVariant }) => {
    return (
      <>
        {Array.isArray(value) ? (
          map(value, (item, index) => {
            const imageVariant = item.image as { id: string; url: string } | undefined;
            return <VariantPromotionItem image={imageVariant} name={item.name} key={index} />;
          })
        ) : (
          <VariantPromotionItem
            image={value?.image as { url: string; id: string }}
            name={value?.name}
            hiddenFields={props.hiddenFields}
          />
        )}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default VariantColumn;
