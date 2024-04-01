import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import MImage from "components/Images/MImage";
import map from "lodash/map";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ListImageColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: { id: string; url?: string; image?: string }[] }) => {
    return (
      <Stack direction="row">
        {map(value, (item, index) => (
          <MImage src={item.url || item.image} key={index} preview width={100} height={100} />
        ))}
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ListImageColumn;
