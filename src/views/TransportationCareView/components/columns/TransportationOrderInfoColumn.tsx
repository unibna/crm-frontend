// Libraries
import { DataTypeProvider } from "@devexpress/dx-react-grid";

// MUI
import { Theme, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
// Utils & Constants
import { ORDER_STATUS } from "views/OrderView/constants/options";
import vi from "locales/vi.json";

// Types
import { OrderStatusValue } from "_types_/OrderType";

import { fDateTime } from "utils/dateUtil";
import { MTextLine, Span } from "components/Labels";
import { UserTooltip } from "components/Tooltips";
import { CopyIconButton } from "components/Buttons";

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

    const labels: { [key: string]: string } = ORDER_STATUS.reduce(
      (prev, current) => ({ ...prev, [current.value]: current.label }),
      {}
    );
    const colors = ORDER_STATUS.reduce((prev, current) => ({
      ...prev,
      [current.value]: current.color,
    }));

    const colorValue: keyof typeof colors = order?.status || "draft";

    return (
      <Stack
        display="flex"
        justifyContent="center"
        direction="column"
        spacing={1}
        sx={{ width: 360 }}
      >
        <Box position="relative" sx={{ width: "min-content", mt: 1.5 }}>
          <Typography sx={{ ...styles.mainText, cursor: "pointer" }} component="div">
            {order?.order_key ? (
              <Tooltip title={vi.press_to_copy}>
                <CopyIconButton sx={styles.copyIconStyle} value={order?.order_key || ""} />
              </Tooltip>
            ) : null}
            <a
              href={`${window.location.origin}/orders/${order?.id}?tab_name=${props.tabName}`}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.mainText, textDecoration: "none" }}
            >
              {order?.order_key || ""}
            </a>
          </Typography>
        </Box>

        <MTextLine
          label="Trạng thái đơn:"
          value={
            <Span color={colors[colorValue]} sx={styles.chip}>
              {labels[colorValue] || "---"}
            </Span>
          }
          displayType="grid"
          xsLabel={4}
          xsValue={8}
        />

        <MTextLine
          label="Ngày tạo đơn:"
          value={<Typography sx={styles.info}>{`${fDateTime(order?.created)}`}</Typography>}
          displayType="grid"
          xsLabel={4}
          xsValue={8}
        />
        <MTextLine
          label="Người tạo đơn:"
          value={order?.created_by && <UserTooltip user={row?.order?.created_by} />}
          displayType="grid"
          xsLabel={4}
          xsValue={8}
        />
        <MTextLine
          label="Kênh bán hàng:"
          value={
            <Typography
              sx={{ ...styles.info, ...styles.infoChip }}
            >{`${order?.source?.name}`}</Typography>
          }
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
      for={["order", ...(props.for || [])]}
    />
  );
};

export default OrderColumn;

const styled = (theme: Theme) => {
  return {
    mainText: {
      fontWeight: 400,
      fontSize: 14,
      color: theme.palette.primary.main,
    },
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
    },
    infoChip: {
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "24px",
      background: theme.palette.primary.main,
      padding: "2px 8px",
      color: theme.palette.primary.contrastText,
    },
    copyIconStyle: {
      position: "absolute",
      top: -12,
      right: -16,
      fontSize: 20,
      cursor: "pointer",
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark,
        transition: "all .15s ease-in-out",
      },
      svg: {
        width: 15,
        height: 15,
      },
    },
  } as { [key: string]: any };
};
