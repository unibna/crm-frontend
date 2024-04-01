//component
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { SxProps, Theme, useTheme } from "@mui/material";
import { CopyIconButton } from "components/Buttons";
import { MTextLine } from "components/Labels";

//types
import { OrderStatusValue, OrderType } from "_types_/OrderType";

//utils
import vi from "locales/vi.json";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;

  tabName?: OrderStatusValue | "shipping";

  params?: any;
}

const COLUMN_NAMES = ["order_key"];

export const OrderColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const theme = useTheme();
    const styles = styled(theme);

    return (
      <Stack
        display="flex"
        justifyContent="center"
        direction="column"
        spacing={1}
        sx={{ width: 240 }}
      >
        <Box position="relative" sx={{ width: "min-content", mt: 1.5 }}>
          <Box sx={{ ...styles.mainText, cursor: "pointer" }}>
            {row?.order_key ? (
              <Tooltip title={vi.press_to_copy}>
                <Box>
                  <CopyIconButton
                    sx={styles.copyIconStyle}
                    value={row?.order_key || ""}
                    iconStyle={{ fontSize: 12 }}
                  />
                </Box>
              </Tooltip>
            ) : null}
            {/* <span onMouseDown={navigateToOrderDetail}>{row?.order_key || ""}</span> */}
            <Link
              href={`${window.location.origin}/orders/${row?.id}?sourceName=${row?.source?.name}&ecommerceCode=${row?.ecommerce_code}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 400, fontSize: 14 }}
            >
              {row?.order_key || ""}
            </Link>
          </Box>
        </Box>

        <MTextLine
          label="Kênh:"
          value={
            <Typography
              sx={{ ...styles.info, ...styles.infoChip } as SxProps<Theme>}
            >{`${row?.source?.name}`}</Typography>
          }
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
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

const styled = (theme: Theme): { [key: string]: SxProps<Theme> } => {
  return {
    mainText: {
      fontWeight: 400,
      fontSize: 14,
      color: theme.palette.primary.main,
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
      fontWeight: 400,
      fontSize: 13,

      color: theme.palette.primary.dark,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
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
  };
};
