// Libraries
import { DataTypeProvider } from "@devexpress/dx-react-grid";

// MUI
import { Theme, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Components
import { MTextLine } from "components/Labels";

// Utils & Constants
import { fValueVnd } from "utils/formatNumber";

// Types
import { OrderStatusValue } from "_types_/OrderType";

import { fDateTime } from "utils/dateUtil";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;

  tabName?: OrderStatusValue | "shipping";

  params?: any;
}

const OrderColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: any }) => {
    const order = row?.order || {};

    const theme = useTheme();
    const styles = styled(theme);

    return (
      <Stack
        display="flex"
        justifyContent="center"
        direction="column"
        spacing={1}
        sx={{ width: 360 }}
      >
        <MTextLine
          label="Ngày xác nhận:"
          value={<Typography sx={styles.info}>{`${fDateTime(order?.completed_time)}`}</Typography>}
          displayType="grid"
          xsLabel={4}
          xsValue={8}
        />
        <MTextLine
          label="Tổng đơn hàng:"
          value={fValueVnd(order?.total_actual) || "---"}
          displayType="grid"
          xsLabel={4}
          xsValue={8}
        />
      </Stack>
    );
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={["order_modified", ...(props.for || [])]}
    />
  );
};

export default OrderColumn;

const styled = (theme: Theme) => {
  return {
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
    },
  } as { [key: string]: any };
};
