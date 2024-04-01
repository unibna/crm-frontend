//icons
import DeleteIcon from "@mui/icons-material/Delete";

//components
import { SxProps, Theme, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Span } from "components/Labels";
import { InputNumber } from "components/Fields";
import MImage from "components/Images/MImage";
import { PromotionPopover } from ".";
import vi from "locales/vi.json";

//utils
import { ROLE_TAB } from "constants/rolesTab";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { fNumber, fShortenNumber } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

//types
import { AttributeVariant, STATUS_PRODUCT } from "_types_/ProductType";
import { PromotionType } from "_types_/PromotionType";
import { FieldErrors, FieldValues } from "react-hook-form";

//hooks
import useMediaQuery from "@mui/material/useMediaQuery";

export type ProductItemColumnName =
  | "price"
  | "quantity"
  | "total"
  | "product"
  | "cross_sale"
  | "listed_price";

interface Props<T extends FieldValues> {
  product: AttributeVariant;
  parentProduct?: AttributeVariant;
  onUpdateProduct?: (product: AttributeVariant & { index: number }) => void;
  onDeleteProduct?: (idx: number) => void;
  onCheckedProduct?: (params: { product: AttributeVariant; index?: number }) => void;
  index?: number;
  isShowPromotion?: boolean;
  error?: FieldErrors<T>;
  style?: React.CSSProperties;
  disabled?: boolean;
  isShowSKU?: boolean;
  isShowActualInventory?: boolean;
  isShowInventoryForOrderConfirm?: boolean;
  hiddenColumns?: ProductItemColumnName[];
  bundleHiddenColumns?: ProductItemColumnName[];
  imageHeight?: number;
  isShowBundle?: boolean;
  isShowImage?: boolean;
  sx?: SxProps<Theme>;
  isShowStatus?: boolean;
}

/**
 * @param isShowPromotion default false
 */
export const ProductItem = ({
  product,
  parentProduct,
  onDeleteProduct,
  onUpdateProduct,
  onCheckedProduct,
  index = -1,
  isShowPromotion,
  style,
  error,
  disabled,
  isShowActualInventory = false,
  isShowSKU = true,
  hiddenColumns = [],
  bundleHiddenColumns = ["cross_sale", "total", "price"],
  isShowInventoryForOrderConfirm,
  imageHeight = 60,
  isShowBundle = true,
  isShowImage = true,
  isShowStatus,
  sx,
}: Props<any>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { quantity: parentQuantity = 0 } = parentProduct || {};

  const {
    sale_price = 0,
    quantity = 1,
    image,
    selected,
    id,
    SKU_code,
    discount = 0,
    total_inventory = 0,
    inventory_available,
    total = 0,
    is_cross_sale = false,
    default_quantity = 0,
    neo_price = 0,
  } = product;

  //kiếm - tìm - mò cái bundle_variants có variant nào trùng SKU_code với gift_variant không?
  const matchBundleGiftVariant = parentProduct?.bundle_variants?.find(
    (item) => item.variant?.SKU_code === SKU_code
  );

  const totalInventoryForOrderConfirm =
    total_inventory -
    (inventory_available?.quality_confirm || 0) -
    // trừ cho số lượng sp cha đã chọn
    (parentProduct?.SKU_code === SKU_code ? parentProduct?.quantity || 0 : 0) -
    //trừ cho số lượng bunle_variant * số lượng của sp cha
    (matchBundleGiftVariant ? parentQuantity * (matchBundleGiftVariant.quantity || 0) : 0);

  const handleAddVariant = (productSelected: AttributeVariant, isChecked: boolean, idx: number) => {
    onCheckedProduct &&
      onCheckedProduct({
        product: {
          ...productSelected,
          selected: isChecked,
        },
        index: idx,
      });
  };

  const handleDeleteVariant = (product: AttributeVariant, index: number) => {
    onDeleteProduct && onDeleteProduct(index);
  };

  const handleChangePromotion = (promotion?: PromotionType) => {
    let { total = 0, discount = 0 } = product;
    let discount_amount = promotion?.discount_amount || 0;

    if (promotion?.id) {
      total = discount_amount < total + discount ? total + discount - discount_amount : 0;
      //update promotion cho variant
      onUpdateProduct &&
        onUpdateProduct({
          ...product,
          index,
          promotion,
          discount: discount_amount,
          total,
        });
    } else {
      onUpdateProduct &&
        onUpdateProduct({
          ...product,
          index,
          promotion,
          discount: 0,
          total: total + discount,
        });
    }
  };

  const handleChangeQuantity = (value: number) => {
    if (onUpdateProduct) {
      let productClone = { ...product };
      if (productClone.bundle_variants) {
        const bundleVariants = reduce(
          productClone.bundle_variants,
          (pre, cur) => {
            const { quantity: default_quantity = 0 } = cur;
            return [...pre, { ...cur, bundle_item_quantity: default_quantity * value }];
          },
          []
        );
        productClone = { ...product, bundle_variants: bundleVariants };
      }

      onUpdateProduct({
        index,
        ...productClone,
        //nếu thay đổi quantity thì reset promotion
        discount: 0,
        total: sale_price,
        promotion: {
          ...(productClone.promotion || {}),
          // set id = undefined để xoá promotion
          id: undefined,
          new_gift_variant_price: 0,
          new_promotion_variant_quantity: 0,
        },
        quantity: value,
      });
    }
  };

  const handleChangeCrossSale = (value: boolean) => {
    onUpdateProduct &&
      onUpdateProduct({
        index,
        ...product,
        discount: product.discount,
        total: product.total,
        is_cross_sale: value,
      });
  };

  return (
    <Box
      my={onUpdateProduct ? 1 : 0}
      py={onUpdateProduct ? 1 : 0}
      sx={{
        ...sx,
        m: 0,
        p: 0,
        pt: 2,
        width: "100%",
        backgroundColor: selected && disabled ? "action.hover" : "unset",
      }}
      style={style}
      className="product-item-box"
    >
      <Stack
        sx={{ py: 1, px: isMobile ? 0 : 1, ...style }}
        onClick={(e) => handleAddVariant(product, !selected, index)}
      >
        <Stack direction="row" alignItems={"center"} spacing={1}>
          {disabled && is_cross_sale ? (
            <Typography
              style={styles.chip}
              sx={{ backgroundColor: "secondary.main" }}
              fontSize={12}
            >
              Sản phẩm Crosssale
            </Typography>
          ) : null}
          {product.bundle_variants?.length ? (
            <Typography
              style={styles.chip}
              sx={{ backgroundColor: "secondary.main" }}
              fontSize={12}
            >
              Combo
            </Typography>
          ) : null}
        </Stack>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          columnSpacing={1}
          className="product-column"
        >
          {/* ----------- */}
          {!hiddenColumns?.includes("product") && (
            <Grid
              item
              xs={
                5 +
                (hiddenColumns?.includes("listed_price") ? 1.5 : 0) +
                (hiddenColumns?.includes("price") ? 1.5 : 0) +
                (hiddenColumns?.includes("quantity") ? 1.5 : 0) +
                (hiddenColumns?.includes("total") ? (!isShowBundle ? 0 : 1.5) : 0) +
                (disabled || (!Boolean(onDeleteProduct) && hiddenColumns?.includes("cross_sale"))
                  ? 1
                  : 0)
              }
              style={{ paddingLeft: 0 }}
              className="product-image-label-sku-inventory"
            >
              <Stack direction="row" alignItems="center" width="100%">
                {onCheckedProduct && (
                  <ListItemIcon sx={{ m: 0, width: 40, marginLeft: 1 }}>
                    <Checkbox
                      checked={selected || false}
                      style={checkboxVariantStyle}
                      onChange={(e) => handleAddVariant(product, e.target.checked, index)}
                    />
                  </ListItemIcon>
                )}

                {!isMobile && isShowImage && (
                  <Box style={{ position: "relative" }}>
                    {default_quantity ? (
                      <Typography
                        fontSize={12}
                        sx={{ backgroundColor: "secondary.main" }}
                        style={{
                          ...styles.chip,
                          position: "absolute",
                          zIndex: 99,
                          right: 0,
                          top: 8,
                        }}
                      >
                        {default_quantity}
                      </Typography>
                    ) : null}
                    <MImage height={imageHeight} width={imageHeight} src={image?.url} preview />
                  </Box>
                )}

                <Stack sx={{ ml: 1 }}>
                  <Link
                    underline="hover"
                    variant="subtitle2"
                    color="primary.main"
                    sx={{ cursor: "pointer", fontSize: 13 }}
                    href={`/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => product.id)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {product.name}
                  </Link>
                  {!isMobile && isShowSKU && (
                    <Typography fontSize={13} className="sku-label">
                      SKU: {SKU_code}
                    </Typography>
                  )}
                  {!isMobile && isShowActualInventory && (
                    <Typography fontSize={13} className=" total-inventory-label">
                      Tồn thực kho bán hàng: {total_inventory || 0}
                    </Typography>
                  )}
                  {!isMobile && isShowInventoryForOrderConfirm && (
                    <Typography
                      fontSize={13}
                      className=" total-inventory-for-order-confirm-label"
                      color={
                        totalInventoryForOrderConfirm < 0 ||
                        totalInventoryForOrderConfirm < quantity
                          ? "warning.main"
                          : "unset"
                      }
                    >
                      Tồn khả dụng kho bán hàng: {totalInventoryForOrderConfirm}
                    </Typography>
                  )}
                  {isShowStatus && (
                    <Span
                      style={{ width: "fit-content" }}
                      variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                      color={product.status === STATUS_PRODUCT.ACTIVE ? "success" : "error"}
                    >
                      {product.status === STATUS_PRODUCT.ACTIVE
                        ? "Đang kinh doanh"
                        : "Ngừng kinh doanh"}
                    </Span>
                  )}
                </Stack>
              </Stack>
            </Grid>
          )}
          {!hiddenColumns?.includes("listed_price") ? (
            <Grid item xs={1.5} className="listed-price-column">
              <>
                <Typography sx={styles.price}>
                  {isMobile ? fShortenNumber(neo_price) : fNumber(neo_price)} đ
                </Typography>
              </>
            </Grid>
          ) : null}
          {!hiddenColumns?.includes("price") ? (
            <Grid item xs={1.5} className="sale-price-column">
              <>
                <Typography
                  sx={{
                    ...styles.price,
                    textDecoration: discount ? "line-through" : "unset",
                  }}
                >
                  {isMobile ? fShortenNumber(sale_price) : fNumber(sale_price)} đ
                </Typography>
                {discount ? (
                  <Typography sx={{ ...styles.price, color: theme.palette.error.main }}>
                    {isMobile
                      ? fShortenNumber(sale_price - discount)
                      : fNumber(sale_price - discount)}{" "}
                    đ
                  </Typography>
                ) : null}
              </>
            </Grid>
          ) : null}
          {!hiddenColumns?.includes("quantity") && (
            <Grid item xs={1.5} className="quantity-column">
              {disabled ? (
                <Typography sx={styles.price}>{quantity}</Typography>
              ) : onUpdateProduct ? (
                <>
                  {isMobile ? (
                    <TextField
                      disabled={disabled}
                      sx={{
                        width: [50, 60, 60, 70],
                        "& input": { padding: [0.5, 0.5, 0.8], fontSize: 14 },
                      }}
                      fullWidth
                      type="number"
                      size="small"
                      error={!!error?.quantity?.message}
                      InputProps={{
                        inputProps: {
                          min: 1,
                        },
                        autoComplete: "off",
                      }}
                      value={quantity}
                      onChange={(e) => {
                        handleChangeQuantity(parseInt(e.target.value));
                      }}
                    />
                  ) : (
                    <InputNumber
                      disabled={disabled}
                      value={quantity || 0}
                      minQuantity={1}
                      onChange={(value = 0) => {
                        handleChangeQuantity(value);
                      }}
                      containerStyles={{
                        minWidth: "70px",
                        maxWidth: "120px",
                        padding: 0.1,
                        "& > MuiButtonBase-root": {
                          padding: 0.5,
                        },
                      }}
                      error={!!error?.quantity?.message}
                    />
                  )}
                </>
              ) : (
                <Typography sx={styles.price}>{quantity}</Typography>
              )}
            </Grid>
          )}
          {/* ---------------------------------- */}

          {/* giá sau khi tăng số lượng */}
          {!hiddenColumns?.includes("total") ? (
            <Grid item xs={1.5} justifyContent="flex-start" display="flex" className="total-column">
              <Stack>
                <Typography
                  sx={{
                    ...styles.price,
                    textDecoration: discount ? "line-through" : "",
                  }}
                >
                  {isMobile
                    ? fShortenNumber(sale_price * quantity)
                    : fNumber(sale_price * quantity)}{" "}
                  đ
                </Typography>
                {discount ? (
                  <Typography sx={{ ...styles.price, color: theme.palette.error.main }}>
                    {isMobile ? fShortenNumber(total * quantity) : fNumber(total * quantity)} đ
                  </Typography>
                ) : null}
              </Stack>
            </Grid>
          ) : !isShowBundle ? (
            <Grid item xs={1.5}></Grid>
          ) : null}

          {!disabled && (Boolean(onDeleteProduct) || !hiddenColumns?.includes("cross_sale")) && (
            <Grid item xs={1} display="flex" alignItems="center" className="variant-action">
              {!hiddenColumns?.includes("cross_sale") && (
                <Tooltip title={vi.product.cross_sale_product} arrow>
                  <Checkbox
                    disabled={disabled}
                    checked={is_cross_sale}
                    style={{ padding: 2 }}
                    sx={{ svg: { height: "22px !important", width: "22px !important" } }}
                    onChange={(e) => handleChangeCrossSale(e.target.checked)}
                  />
                </Tooltip>
              )}
              {Boolean(onDeleteProduct) && (
                <Button
                  disabled={disabled}
                  style={{ minWidth: 32, padding: 2 }}
                  onClick={() => id && handleDeleteVariant(product, index)}
                >
                  <DeleteIcon style={{ fontSize: isMobile ? 17 : 20 }} />
                </Button>
              )}
            </Grid>
          )}
        </Grid>
        {error?.quantity?.message && (
          <FormHelperText error>{error?.quantity?.message}</FormHelperText>
        )}
        {/* bundle variant */}
        {product.bundle_variants?.length && isShowBundle ? (
          <Box
            style={{
              border: "1px solid",
              borderColor: theme.palette.divider,
              marginTop: 8,
              marginLeft: "4%",
              borderRadius: 3,
              position: "relative",
            }}
          >
            <Typography
              style={{
                position: "absolute",
                fontSize: 12,
                top: -8,
                left: -1,
                padding: "0px 8px 0px 8px",
                color: "#fff",
              }}
              sx={{ backgroundColor: "secondary.main" }}
            >
              Sản phẩm trong combo
            </Typography>
            {map(product.bundle_variants, (item, idx) => {
              const { variant_total, variant, quantity = 0, bundle_item_quantity = 0 } = item;
              return (
                <ProductItem
                  sx={{
                    ".variant-action": { opacity: 0.5, pointerEvents: "none" },
                  }}
                  key={idx}
                  index={idx}
                  product={{
                    ...variant,
                    sale_price: variant_total || variant?.sale_price,
                    quantity: 1, // mặc định 1 để show giá của 1 sản phẩm => nếu tặng nhiều sản phẩm thì sẽ dựa vào default_quantity
                    // nếu có bundle_item_quantity => đơn đang tạo (quantity chính là giá trị default của bundle_variant)
                    // nếu không có bundle_item_quantity => đơn đã được tạo (quantity là giá trị của bundle_variant sau khi * số lượng combo) => default = quantity/ product.quantity
                    default_quantity: bundle_item_quantity
                      ? quantity
                      : quantity / (product.quantity || 1),
                  }}
                  hiddenColumns={bundleHiddenColumns}
                  isShowInventoryForOrderConfirm
                  onDeleteProduct={onDeleteProduct}
                  disabled={disabled}
                  isShowBundle={false}
                />
              );
            })}
          </Box>
        ) : null}
      </Stack>
      <Stack ml={2}>
        {!isShowPromotion ? null : (
          <PromotionPopover
            onChange={handleChangePromotion}
            product={product}
            params={{ applied_variant: id }}
            disabled={disabled}
            error={error?.promotion}
          />
        )}
      </Stack>
      <Divider />
    </Box>
  );
};

const checkboxVariantStyle = { height: 40, width: 40 };

const styles = {
  mainText: {
    lineHeight: "1.57143",
    fontSize: "0.8125rem",
    fontWeight: 700,
    pl: 1,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  } as React.CSSProperties,
  price: {
    lineHeight: "1.57143",
    fontSize: "0.8125rem",
    fontWeight: 500,
  } as React.CSSProperties,
  chip: {
    width: "fit-content",
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    color: "#fff",
  },
};
