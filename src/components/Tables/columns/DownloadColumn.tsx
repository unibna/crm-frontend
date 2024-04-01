import DownloadIcon from "@mui/icons-material/Download";

import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import IconButton from "@mui/material/IconButton";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const DownloadColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: string }) => {
    return (
      <>
        {value && (
          <>
            <IconButton
              sx={{ backgroundColor: "primary.main", color: "text.primary" }}
              style={wrapIconStyle}
              href={value}
            >
              <DownloadIcon style={iconStyle} />
            </IconButton>
          </>
        )}
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};
export default DownloadColumn;

const wrapIconStyle = { borderRadius: 3, padding: 2 };
const iconStyle = { fontSize: 18 };
