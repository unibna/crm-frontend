// Libraries
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

// Components
import Grid from "@mui/material/Grid";
import isArray from "lodash/isArray";
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

const ColumnOptional = (props: Props) => {
  const Formatter = ({ value }: { value: any }) => {
    if (isArray(value)) {
      return (
        <Grid container direction="row" alignItems="center" spacing={1}>
          {map(value, (option, index) => {
            return (
              <Grid item key={index}>
                {option.content}
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      return <>{value?.content}</>;
    }
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnOptional;
