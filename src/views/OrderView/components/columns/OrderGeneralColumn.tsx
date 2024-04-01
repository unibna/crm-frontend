//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Typography from "@mui/material/Typography";
import { CopyIconButton, ReadMoreButton } from "components/Buttons";
import { MTextLine } from "components/Labels";

//types
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { OrderType } from "_types_/OrderType";

//utils
import { SxProps, Theme, useTheme } from "@mui/material";
import map from "lodash/map";
import { fNumber } from "utils/formatNumber";
import { matchMarketplaceUrlFromEcommerceCode } from "features/order/matchMarketplaceUrlFromEcommerceCode";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const OrderGeneralColumn = (props: Props) => {
  const Formatter = ({ row }: { row?: OrderType }) => {
    const theme = useTheme();
    const styles = styled(theme);

    const marketUrl = matchMarketplaceUrlFromEcommerceCode(row?.ecommerce_code, row?.source);

    return (
      <Stack
        display="flex"
        justifyContent="center"
        direction="column"
        spacing={1}
        sx={{ width: 240 }}
      >
        {row?.is_cross_sale && (
          <MTextLine
            label="CrossSale:"
            value={fNumber(row?.cross_sale_amount) || "---"}
            xsLabel={4}
            xsValue={8}
          />
        )}

        {row?.ecommerce_code && (
          <MTextLine
            label="Mã TMĐT:"
            value={
              <Stack direction="row" alignItems="center" position="relative">
                <CopyIconButton
                  sx={styles.copyIconStyle}
                  value={row.ecommerce_code}
                  iconStyle={{ fontSize: 12 }}
                />
                <Link href={marketUrl} target="_blank">
                  {row?.ecommerce_code}
                </Link>
              </Stack>
            }
            xsLabel={4}
            xsValue={8}
          />
        )}
        {row?.customer_offline_code && (
          <MTextLine
            label="Mã Offline:"
            value={<Typography fontSize={13}>{row?.customer_offline_code}</Typography>}
            xsLabel={4}
            xsValue={8}
          />
        )}

        <MTextLine
          label="Thẻ:"
          value={
            row?.tags?.length ? (
              <Stack direction="row">
                {map(row?.tags, (item, idx) => (
                  <Chip
                    label={item}
                    key={idx}
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginTop: 4, marginLeft: 4 }}
                  />
                ))}
              </Stack>
            ) : (
              "---"
            )
          }
          xsLabel={4}
          xsValue={8}
        />
        <MTextLine
          label="Ghi chú:"
          value={
            <ReadMoreButton
              text={row?.note || "---"}
              textStyles={{ ...styles.info }}
              isShow
              shortTextLength={70}
            />
          }
          xsLabel={4}
          xsValue={8}
        />
      </Stack>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

const styled = (theme: Theme): { [key: string]: SxProps<Theme> } => {
  return {
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
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
