//hooks
import { useState } from "react";

//components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormDialog from "components/Dialogs/FormDialog";

//utils
import { fCurrency2 } from "utils/formatNumber";

//types
import { DISCOUNT_METHOD, PromotionType } from "_types_/PromotionType";
import { ProductItem } from "components/ProductComponent";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const PromotionValueColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value?: undefined; row?: PromotionType }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const { AMOUNT, PERCENTAGE } = DISCOUNT_METHOD;

    return (
      <>
        {row?.discount_method === AMOUNT ? (
          <Typography sx={styles.info}>{fCurrency2(row.discount_amount)} vnđ</Typography>
        ) : row?.discount_method === PERCENTAGE ? (
          <Typography sx={styles.info}>{`${row.discount_percent}%`}</Typography>
        ) : (
          <>
            <FormDialog
              enableCloseByDropClick
              open={open}
              onClose={() => setOpen(false)}
              title="Danh sách sản phẩm"
            >
              <Stack direction="column" spacing={1}>
                {row?.available_variants?.map((item, index) => {
                  return (
                    <ProductItem
                      product={{ ...item.variant, quantity: item.quantity }}
                      index={index}
                      key={index}
                      hiddenColumns={["quantity", "price", "cross_sale", "total", "listed_price"]}
                    />
                  );
                })}
              </Stack>
            </FormDialog>
            <Stack direction={"column"}>
              {row?.available_variants?.[0] && (
                <ProductItem
                  product={{
                    ...row?.available_variants?.[0]?.variant,
                    quantity: row?.available_variants?.[0]?.quantity,
                  }}
                  index={0}
                  hiddenColumns={["quantity", "price", "cross_sale", "total", "listed_price"]}
                  sx={{ hr: { display: "none" } }}
                />
              )}
              {row?.available_variants && row?.available_variants.length > 1 && (
                <Typography
                  sx={{ ...styles.seemore, color: theme.palette.primary.main }}
                  onClick={() => setOpen(true)}
                >
                  {"Xem thêm >"}
                </Typography>
              )}
            </Stack>
          </>
        )}
      </>
    );
  };
  return (
    <DataTypeProvider formatterComponent={Formatter} {...props} for={[...(props.for || [])]} />
  );
};

export default PromotionValueColumn;

const styles: any = {
  info: {
    color: "red",
    fontSize: 13,
    fontWeight: 600,
  },
  seemore: {
    textAlign: "right",

    fontSize: 13,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};
