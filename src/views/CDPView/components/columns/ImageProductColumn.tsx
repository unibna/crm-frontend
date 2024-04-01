import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import MImage from "components/Images/MImage";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  keyImageUrl?: string;
}

const ImageProductColumn = ({ keyImageUrl = "thumbnail_url", ...props }: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    let value = row?.product?.[keyImageUrl];
    if (Array.isArray(value)) {
      value = value[0];
    }
    return <MImage src={value} preview height={56} width={56} />;
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ImageProductColumn;
