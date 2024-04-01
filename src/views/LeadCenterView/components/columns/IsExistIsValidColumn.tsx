//component
import { Column, DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { styled } from "@mui/material";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["is_existed", "is_valid", "is_duplicated_ip"];

const IsExistIsValidColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ column, value }: { column: Column; value: boolean }) => {
    switch (column.name) {
      case "is_existed": {
        return value ? (
          <ButtonIcon>
            <WarningIcon style={{ color: "#FAB830" }} />
          </ButtonIcon>
        ) : null;
      }
      case "is_valid": {
        return value ? null : (
          <ButtonIcon>
            <ErrorIcon style={{ color: "#e74c3c" }} />
          </ButtonIcon>
        );
      }
      default: {
        return !value ? null : (
          <ButtonIcon>
            <ErrorIcon style={{ color: "#e74c3c" }} />
          </ButtonIcon>
        );
      }
    }
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default IsExistIsValidColumn;

const ButtonIcon = styled("div")({
  svg: {
    fontSize: 18,
    marginLeft: 15,
  },
});
