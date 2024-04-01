//component
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import MImage from "components/Images/MImage";
import { MTextLine } from "components/Labels";
import FormDialog from "components/Dialogs/FormDialog";
import Typography from "@mui/material/Typography";

//utils
import map from "lodash/map";
import { fNumber } from "utils/formatNumber";

//types
import { DISCOUNT_METHOD } from "_types_/PromotionType";
import { SxProps, Theme } from "@mui/material";

//hooks
import { useState } from "react";
import { AttributeVariant } from "_types_/ProductType";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["line_items"];

export const OrderProductColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value: line_items = [] }: { value: AttributeVariant[] }) => {
    const [first, second] = line_items;

    const [open, setOpen] = useState(false);

    return (
      <>
        <FormDialog
          enableCloseByDropClick
          open={open}
          onClose={() => setOpen(false)}
          title="Danh sách sản phẩm"
        >
          <ListProduct
            products={line_items}
            sxItem={{
              my: 3,
              "&:hover": {
                // backgroundColor: "text.primary",
              },
            }}
          />
        </FormDialog>
        <ListProduct products={[first, second]} />
        {line_items.length > 2 && <MTextLine onClick={() => setOpen(true)} label="Xem thêm >>" />}
      </>
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

const ListProduct = ({
  products,
  sxItem,
}: {
  products: AttributeVariant[];
  sxItem?: SxProps<Theme>;
}) => {
  return (
    <>
      {map(products, (orderItem, idx) => {
        if (orderItem) {
          const imageVariant = orderItem.variant?.image as { id: string; url: string } | undefined;

          const promotion =
            orderItem.promotion?.discount_method === DISCOUNT_METHOD.AMOUNT ||
            orderItem.promotion?.discount_method === DISCOUNT_METHOD.PERCENTAGE ? (
              fNumber(orderItem.discount || 0)
            ) : orderItem.promotion?.discount_method === DISCOUNT_METHOD.COMBO ? (
              <Typography fontSize={13} fontWeight="bold" component="span">
                {orderItem.promotion.note}
              </Typography>
            ) : (
              0
            );

          return (
            <Stack key={idx} my={1} sx={sxItem}>
              <Stack direction="row">
                <Badge color="error" badgeContent={orderItem.quantity}>
                  <MImage src={imageVariant?.url} height={80} width={80} preview />
                </Badge>
                <Stack ml={1}>
                  <Tooltip title={orderItem.variant?.name || ""}>
                    <Typography
                      className="ellipsis-label"
                      component="h3"
                      fontSize={14}
                      fontWeight="bold"
                    >
                      {orderItem.variant?.name}
                    </Typography>
                  </Tooltip>
                  <Typography component="h3" fontSize={12}>
                    Giá niêm yết: {fNumber(orderItem.variant_total)}
                  </Typography>

                  <Typography component="h3" fontSize={12}>
                    Khuyến mãi: {promotion}
                  </Typography>

                  <Typography component="h3" fontSize={12}>
                    Số lượng: {fNumber(orderItem.quantity)}
                  </Typography>

                  <Typography component="h3" fontSize={12}>
                    <Tooltip title="Giá khuyến mãi = ( giá niêm yết - khuyến mãi ) * số lượng">
                      <Typography fontSize={13} component="span">
                        Giá khuyến mãi:
                      </Typography>
                    </Tooltip>{" "}
                    <Typography fontWeight="bold" component="span" fontSize={13}>
                      {fNumber((orderItem.total || 0) * (orderItem.quantity || 0))}
                    </Typography>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};
