//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import { MTextLine } from "components/Labels";

//utils 
import { fDateTime } from "utils/dateUtil";

//types
import { PromotionType } from "_types_/PromotionType";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionCreateColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: PromotionType }) => {
    return (
      <Stack>
        <MTextLine label="Ngày tạo:" value={fDateTime(row?.created)} />
        <MTextLine label="Người tạo:" value={row?.created_by?.name || "---"} />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default PromotionCreateColumn;
