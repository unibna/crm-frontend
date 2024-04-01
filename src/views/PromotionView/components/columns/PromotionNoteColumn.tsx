import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { Tooltip, Typography } from "@mui/material";

import { PromotionType } from "_types_/PromotionType";
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionNoteColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value, row }: { value?: string; row?: PromotionType }) => {
    return (
      <Tooltip title={value || ""}>
        <Typography sx={styles.note} className="text-max-line">
          {value}
        </Typography>
      </Tooltip>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};

export default PromotionNoteColumn;

const styles: { [key: string]: React.CSSProperties } = {
  note: {
    fontSize: 13,
    whiteSpace: "break-spaces",
    lineClamp: 3,
    WebkitLineClamp: 3,
  },
};
