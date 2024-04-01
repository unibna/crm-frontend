//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

//types
import { OrderType } from "_types_/OrderType";

//utils
import { fDateTime } from "utils/dateUtil";
import { UserTooltip } from "components/Tooltips";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const PrintInfoColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const theme = useTheme();

    const styles = {
      labelInfo: {
        fontWeight: 400,
        fontSize: "0.8125rem",
        display: "inline",
      },
      info: {
        fontWeight: 600,
        fontSize: "0.8125rem",
        display: "inline",
      },
      handler: {
        fontWeight: 600,
        fontSize: "0.8125rem",

        color: theme.palette.primary.main,
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    };
    const { email, name, image } = row?.printed_by || {};

    return (
      <>
        <Grid container rowSpacing={1} sx={{ minWidth: 220 }}>
          <Grid item xs={4}>
            <Typography sx={styles.labelInfo} component="div">
              {`In đơn lúc: `}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={styles.info}>{`${
              row?.printed_at ? fDateTime(row?.printed_at) : "---"
            }`}</Typography>
          </Grid>
        </Grid>
        <Grid container rowSpacing={1} sx={{ minWidth: 220 }}>
          <Grid item xs={4}>
            <Typography sx={styles.labelInfo} component="div">
              {`Người in: `}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <UserTooltip user={{ name, image, email }} />
          </Grid>
        </Grid>
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={props.for || []} />;
};
