import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PhoneCDPDrawer } from "components/Drawers";
import { MTextLine } from "components/Labels";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

function CustomerColumn(props: Props) {
  const Formatter = ({ row }: { row?: any }) => {
    const styles = {
      mainText: {
        fontWeight: 600,
        fontSize: 13,
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
    };
    return (
      <Stack direction="column" sx={{ width: 100 }} spacing={1}>
        <MTextLine
          label={
            <Typography sx={styles.labelInfo} component="div">
              {`Tên: `}
            </Typography>
          }
          value={row?.order?.customer_name}
          displayType="grid"
        />
        <MTextLine
          label={
            <Typography sx={styles.labelInfo} component="div">
              {`SĐT: `}
            </Typography>
          }
          value={<PhoneCDPDrawer phone={row?.order?.customer_phone} />}
          displayType="grid"
        />
      </Stack>
    );
  };
  return (
    <DataTypeProvider formatterComponent={Formatter} {...props} for={props.for || ["customer"]} />
  );
}

export default CustomerColumn;
