//date
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { MTextLine } from "components/Labels";
import { PhoneCDPDrawer } from "components/Drawers";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { OrderType } from "_types_/OrderType";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export function CustomerColumn(props: Props) {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const theme = useTheme();

    const styles = {
      mainText: {
        fontWeight: 600,
        fontSize: 13,
        // color: theme.palette.primary.main,
      },
      labelInfo: {
        fontWeight: 400,
        fontSize: 13,
        display: "inline",
      },
      info: {
        fontWeight: 600,
        fontSize: 13,
        display: "inline",
      },
      createAt: {
        fontWeight: 400,
        fontSize: "0.775rem",
      },
      handler: {
        fontWeight: 600,
        fontSize: 13,

        color: theme.palette.primary.main,
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    };
    return (
      <Stack direction="column" sx={{ width: 240 }} spacing={1}>
        <MTextLine
          label={
            <Typography sx={styles.labelInfo} component="div">
              {`SĐT: `}
            </Typography>
          }
          value={<PhoneCDPDrawer phone={row?.customer_phone} />}
          xsLabel={2}
          xsValue={10}
        />
        <MTextLine
          label={
            <Typography sx={styles.labelInfo} component="div">
              {`Tên: `}
            </Typography>
          }
          value={<Typography sx={{ ...styles.mainText }}>{row?.customer_name}</Typography>}
          xsLabel={2}
          xsValue={10}
        />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={props.for || []} />;
}
