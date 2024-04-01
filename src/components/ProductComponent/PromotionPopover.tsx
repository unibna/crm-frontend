//hooks
import { useState } from "react";

//components
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import { Span, MTextLine } from "components/Labels";
import ListRadioPromotion, {
  PromotionParams,
} from "views/PromotionView/components/ListRadioPromotion";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProductItem } from "./ProductItem";

//types
import { DISCOUNT_METHOD, PromotionType } from "_types_/PromotionType";
import { FieldErrors, FieldValues } from "react-hook-form";

//utils
import { fNumber } from "utils/formatNumber";
import { toastWarning } from "store/redux/toast/slice";
import map from "lodash/map";
import { dispatch } from "store";
import { useTheme } from "@mui/material";
import { AttributeVariant } from "_types_/ProductType";

const PROMOTION_POPOVER = "promotion-popover";

export const handleCheckPromotionVariantQuantityByGiftVariant = (
  promotion: Partial<PromotionType>
) => {
  let newPromotionAppliedQuantity = 0;
  let newGiftVariantPrice = 0;
  // tính số lượng sản phẩm khuyến mãi đã được áp dụng
  map(promotion.gift_variants, (item) => {
    newPromotionAppliedQuantity += item.quantity || 0;
    newGiftVariantPrice += (item.quantity || 0) * (item.variant?.sale_price || 0);
  });

  return {
    newPromotionAppliedQuantity,
    newGiftVariantPrice,
  };
};

interface Props<T extends FieldValues> {
  product: AttributeVariant;
  onChange: (promotion?: Partial<PromotionType>) => void;
  params?: PromotionParams;
  disabled?: boolean;
  error?: FieldErrors<T>;
}

export const PromotionPopover = ({
  product,
  onChange,
  params,
  disabled,
  error,
}: Props<PromotionType>) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePromotion = () => {
    onChange({
      ...(product.promotion || {}),
      id: undefined,
      new_gift_variant_price: 0,
      new_promotion_variant_quantity: 0,
    });
  };

  const handleAddPromotion = (value?: PromotionType) => {
    const { newGiftVariantPrice, newPromotionAppliedQuantity } =
      handleCheckPromotionVariantQuantityByGiftVariant(value || {});

    onChange({
      ...value,
      new_gift_variant_price: newGiftVariantPrice,
      new_promotion_variant_quantity: newPromotionAppliedQuantity,
    });
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      {disabled ? null : (
        <MTextLine
          label={`${product.promotion ? "Chỉnh sửa" : "Chọn"} khuyến mãi >>`}
          onClick={handleClick}
          labelStyle={{ mb: 1 }}
        />
      )}
      {product.promotion && (
        <>
          <Tooltip title={product.promotion?.note || ""}>
            <Chip
              label={product.promotion?.name}
              onDelete={disabled ? undefined : () => handleDeletePromotion()}
              deleteIcon={<DeleteIcon />}
              variant="outlined"
              color="success"
              size="small"
              // style={{ marginBottom: 4, display: "inline-flex", maxWidth: "100%" }}
              sx={{
                mb: 1,
                height: "auto",
                ".MuiChip-label": {
                  whiteSpace: "normal",
                },
              }}
            />
          </Tooltip>
          <PromotionApplied
            promotion={product.promotion}
            onChange={onChange}
            disabled={disabled}
            error={error?.gift_variants}
            parentProduct={product}
          />
        </>
      )}
      <Popover
        id={PROMOTION_POPOVER}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ListRadioPromotion
          sx={{ maxHeight: 300, minWidth: 300 }}
          isOpen={true}
          total_variant_actual={0}
          onChangePromotion={(value) => {
            handleAddPromotion(value);
            handleClose();
          }}
          checkFor="variant"
          params={params}
          product={product}
          promotion={product.promotion}
        />
      </Popover>
    </Box>
  );
};

interface PromotionVariantAppliedProps<T extends FieldValues> {
  promotion: Partial<PromotionType>;
  onChange: (value?: Partial<PromotionType>) => void;
  disabled?: boolean;
  error?: FieldErrors<T>;
  parentProduct?: AttributeVariant;
}

const PromotionApplied = ({
  promotion,
  onChange,
  disabled,
  error,
  parentProduct,
}: PromotionVariantAppliedProps<PromotionType[]>) => {
  const theme = useTheme();
  const {
    gift_variants = [],
    combo_times = 0,
    discount_method,
    discount_amount = 0,
    discount_percent = 0,
  } = promotion;

  const isComboPromotion = !(
    discount_method === DISCOUNT_METHOD.AMOUNT || discount_method === DISCOUNT_METHOD.PERCENTAGE
  );

  const handleChangeGiftVariant = (prod: AttributeVariant, index: number) => {
    let giftVariants = [...gift_variants];
    const oldQuantity = giftVariants[index].quantity;
    const { quantity: newQuantity = 0 } = prod;

    giftVariants[index].quantity = newQuantity;

    const { newPromotionAppliedQuantity, newGiftVariantPrice } =
      handleCheckPromotionVariantQuantityByGiftVariant({
        ...promotion,
        gift_variants: giftVariants,
      });

    if (combo_times !== undefined && newPromotionAppliedQuantity > (combo_times || 0)) {
      dispatch(toastWarning({ message: "Không thể chọn quá giới hạn lựa chọn" }));
      giftVariants[index].quantity = oldQuantity;
    } else {
      onChange({
        ...promotion,
        gift_variants: giftVariants,
        new_promotion_variant_quantity: newPromotionAppliedQuantity,
        new_gift_variant_price: newGiftVariantPrice,
      });
    }
  };

  const handleDeleteAppliedVariant = (index: number) => {
    let giftVariants = [...(gift_variants || [])];
    giftVariants.splice(index, 1);

    //xoá list applied variant => xoá luôn promotion (id === undefined)
    if (giftVariants.length == 0) {
      onChange({
        ...promotion,
        gift_variants: giftVariants,
        id: undefined,
        new_promotion_variant_quantity: 0,
        new_gift_variant_price: 0,
      });
      return;
    }

    const { newPromotionAppliedQuantity, newGiftVariantPrice } =
      handleCheckPromotionVariantQuantityByGiftVariant({
        ...promotion,
        gift_variants: giftVariants,
      });
    onChange({
      ...promotion,
      gift_variants: giftVariants,
      new_promotion_variant_quantity: newPromotionAppliedQuantity,
      new_gift_variant_price: newGiftVariantPrice,
    });
  };

  return (
    <Box
      sx={{
        ...styles.container,
        border: "1px solid",
        borderColor: theme.palette.divider,
      }}
    >
      <Box sx={styles.bottom}>
        {isComboPromotion ? (
          <Stack direction={"column"} spacing={1}>
            {gift_variants?.map((item, index) => {
              const { quantity = 0, variant, total = 0, variant_total = 0 } = item;
              return (
                <ProductItem
                  onDeleteProduct={() => handleDeleteAppliedVariant(index)}
                  onUpdateProduct={(prod) => {
                    handleChangeGiftVariant(prod, index);
                  }}
                  key={index}
                  product={{
                    ...variant,
                    quantity,
                    discount: variant_total || variant?.sale_price,
                    sale_price: variant_total || variant?.sale_price,
                    total,
                  }}
                  parentProduct={parentProduct}
                  index={index}
                  style={{ padding: 0 }}
                  isShowSKU
                  disabled={disabled}
                  isShowInventoryForOrderConfirm
                  error={error?.[index]}
                  hiddenColumns={["cross_sale"]}
                  bundleHiddenColumns={["listed_price", "price", "quantity"]}
                />
              );
            })}
          </Stack>
        ) : (
          <Span color="success">
            {`Giảm ${
              discount_method === DISCOUNT_METHOD.AMOUNT
                ? fNumber(discount_amount)
                : `${discount_percent}%`
            }`}
          </Span>
        )}
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    borderRadius: "3px",
    overflow: "hidden",
    mb: 1,
    ml: 2,
  },
  top: {
    backgroundColor: "error.lighter",
    p: 1,
    px: 2,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  bottom: {
    p: 2,
  },
  chip: {
    fontSize: "0.675rem",
    borderRadius: "2px",
    height: "24px",
  },
  name: {
    fontSize: "0.8125rem",
    fontWeight: 700,
  },
  remove: {
    fontSize: "0.775rem",
    color: "error.main",
    cursor: "pointer",
    transition: "all .15s ease-in-out",
    "&:hover": {
      color: "error.dark",
    },
  },
};
