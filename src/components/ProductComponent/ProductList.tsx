import { SxProps, Theme } from "@mui/material";
import { NoDataPanel } from "components/DDataGrid/components";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import { OrderPaymentType } from "_types_/OrderType";
import { ProductItem, ProductItemColumnName } from "./ProductItem";
import { FieldErrors, FieldValues } from "react-hook-form";
import styled from "@emotion/styled";
import { AttributeVariant } from "_types_/ProductType";
import { paymentTotal } from "features/order/handlePaymentTotal";

interface Props<T extends FieldValues> {
  setSelectedProducts: (products: AttributeVariant[]) => void;
  selectedProducts: AttributeVariant[];
  title?: string;
  helperText?: { message: string } | { id?: { message: string }; quantity?: { message: string } }[];
  titleStyle?: React.CSSProperties;
  isShowPromotion?: boolean;
  setPayment?: (value: Partial<OrderPaymentType>) => void;
  payment?: OrderPaymentType;
  error?: FieldErrors<T>;
  style?: React.CSSProperties;
  listProductSx?: SxProps<Theme>;
  disabled?: boolean;
  isUpdate?: boolean;
  isDelete?: boolean;
  isShowSKU?: boolean;
  isShowInventory?: boolean;
  hiddenColumns?: ProductItemColumnName[];
  bundleHiddenColumns?: ProductItemColumnName[];
}
export const ProductList = ({
  selectedProducts,
  setSelectedProducts,
  title,
  helperText,
  titleStyle,
  isShowPromotion,
  setPayment,
  payment,
  error,
  style,
  listProductSx,
  disabled,
  isDelete = true,
  isUpdate = true,
  isShowInventory,
  isShowSKU,
  hiddenColumns = [],
  bundleHiddenColumns,
}: Props<any>) => {
  const handleUpdateProduct = (product: AttributeVariant & { index: number }) => {
    const {
      index,
      quantity = 0,
      promotion,
      discount = 0,
      total = 0,
      sale_price = 0,
      old_gift_variant_price = 0,
      old_promotion_variant_quantity = 0,
      isDenyConfirm,
      is_cross_sale,
      bundle_variants,
    } = product;
    const selectedProductClone = [...selectedProducts];
    selectedProductClone[index].isDenyConfirm = isDenyConfirm;
    selectedProductClone[index].is_cross_sale = is_cross_sale;
    selectedProductClone[index].bundle_variants = bundle_variants;

    const {
      fee_delivery = 0,
      fee_additional = 0,
      total_variant_quantity = 0,
      total_variant_actual = 0,
      total_variant_all = 0,
      discount_input: discountPayment = 0,
    } = payment || {};
    const {
      new_promotion_variant_quantity = 0,
      new_gift_variant_price = 0,
      gift_variants,
    } = promotion || {};

    // total_variant_quantity = total_variant_quantity cũ + quantity của sản phẩm hiện tại - quantity cũ của sản phẩm -  slkmC + slkmM
    let newQuantity =
      total_variant_quantity +
      quantity -
      (selectedProductClone[index].quantity || 0) -
      old_promotion_variant_quantity +
      new_promotion_variant_quantity;

    // total mói = total cũ - (price product * quantity product) cũ + (price product * quantity product) mới
    let newVariantActual =
      total_variant_actual -
      (selectedProductClone[index].quantity || 0) * (selectedProductClone[index].total || 0) +
      total * quantity;

    // tổng tiền hàng = tổng tiền hàng cũ - giá tiền của sp cũ + giá tiền sp mới - giá KM cũ + giá KM mới
    let newVariantAll =
      total_variant_all -
      (selectedProductClone[index].quantity || 0) * (selectedProductClone[index].sale_price || 0) +
      sale_price * quantity -
      old_gift_variant_price +
      new_gift_variant_price;

    selectedProductClone[index].quantity = quantity;
    selectedProductClone[index].promotion = promotion?.id
      ? { ...promotion, gift_variants }
      : undefined;
    selectedProductClone[index].total = total;
    selectedProductClone[index].discount = discount;

    const newPaymentTotal = paymentTotal({
      total: newVariantActual,
      discount_input: discountPayment,
      fee_additional,
      fee_delivery,
    });

    selectedProductClone[index].old_promotion_variant_quantity = new_promotion_variant_quantity;
    selectedProductClone[index].old_gift_variant_price = new_gift_variant_price;

    setSelectedProducts(selectedProductClone);
    setPayment &&
      setPayment({
        total_variant_quantity: newQuantity,
        cost: newPaymentTotal,
        total_variant_actual: newVariantActual,
        total_variant_all: newVariantAll,
        total_actual: newPaymentTotal,
        // reset payment
        discount_promotion: 0,
      });
  };

  const handleDeleteProduct = (index: number) => {
    const selectedProductClone = [...selectedProducts];
    const {
      fee_delivery = 0,
      discount_input: discountPayment = 0,
      fee_additional = 0,
      total_variant_quantity = 0,
      total_variant_actual = 0,
      total_variant_all = 0,
    } = payment || {};

    const old_promotion_variant_quantity =
      selectedProductClone[index]?.old_promotion_variant_quantity || 0;

    const currentPromotionPrice = selectedProductClone[index]?.old_gift_variant_price || 0;

    // quantity mới = total quantity cũ - quantity product - số lượng sản phẩm khuyến mãi
    let newQuantity =
      total_variant_quantity -
      (selectedProductClone[index].quantity || 0) -
      old_promotion_variant_quantity;

    // total actual mói = total actual cũ - (price product * quantity product) cũ
    let newVariantActual =
      total_variant_actual -
      (selectedProductClone[index].quantity || 0) * (selectedProductClone[index].total || 0);

    // total cost mói = total cost cũ - (price product * quantity product) cũ - cost KM
    let newVariantAll =
      total_variant_all -
      (selectedProductClone[index].quantity || 0) * (selectedProductClone[index].sale_price || 0) -
      currentPromotionPrice;

    selectedProductClone.splice(index, 1);

    setSelectedProducts(selectedProductClone);

    const newPaymentTotal = paymentTotal({
      total: newVariantActual,
      discount_input: discountPayment,
      fee_additional,
      fee_delivery,
    });

    setPayment &&
      setPayment({
        total_variant_quantity: newQuantity,
        cost: newPaymentTotal,
        total_variant_actual: newVariantActual,
        total_variant_all: newVariantAll,
        total_actual: newPaymentTotal,

        //reset discount
        discount_promotion: 0,
      });
  };

  const errorLine = Array.isArray(helperText) ? Object.keys(helperText)[0] : "";

  return (
    <Box style={style}>
      <FormLabel
        style={{ ...titleListProductStyle, ...titleStyle }}
        id="list-product"
        error={!!error}
      >
        {title}
      </FormLabel>
      {/* message */}
      {Array.isArray(helperText) ? (
        <FormHelperText error style={formHelperTextStyle}>
          {helperText?.[parseInt(errorLine)]?.id?.message ||
            helperText?.[parseInt(errorLine)]?.quantity?.message}
          {`: [${parseInt(errorLine) + 1}]`}
        </FormHelperText>
      ) : (
        <FormHelperText error style={formHelperTextStyle}>
          {helperText?.message}
        </FormHelperText>
      )}

      {/* header list */}
      {selectedProducts.length > 0 && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Grid
            container
            columnSpacing={1}
            justifyContent="flex-start"
            alignItems="center"
            sx={{ color: "#637381" }}
          >
            {!hiddenColumns?.includes("product") && (
              <Grid
                item
                xs={
                  5 +
                  (hiddenColumns?.includes("price") ? 1.5 : 0) +
                  (hiddenColumns?.includes("listed_price") ? 1.5 : 0) +
                  (hiddenColumns?.includes("quantity") ? 1.5 : 0) +
                  (hiddenColumns?.includes("total") ? 1.5 : 0) +
                  (disabled || (!isDelete && hiddenColumns?.includes("cross_sale")) ? 1 : 0)
                }
              >
                <TitleHeaderProductList>Sản phẩm</TitleHeaderProductList>
              </Grid>
            )}
            {!hiddenColumns?.includes("listed_price") && (
              <Grid item xs={1.5}>
                <TitleHeaderProductList>Giá niêm yết</TitleHeaderProductList>
              </Grid>
            )}
            {!hiddenColumns?.includes("price") && (
              <Grid item xs={1.5}>
                <TitleHeaderProductList>Giá bán</TitleHeaderProductList>
              </Grid>
            )}
            {!hiddenColumns?.includes("quantity") && (
              <Grid item xs={1.5}>
                <TitleHeaderProductList>Số lượng</TitleHeaderProductList>
              </Grid>
            )}
            {!hiddenColumns?.includes("total") && (
              <Grid item xs={1.5}>
                <TitleHeaderProductList>Thành tiền</TitleHeaderProductList>
              </Grid>
            )}
            {isDelete && <Grid item xs={1}></Grid>}
          </Grid>
        </Paper>
      )}
      {/* ----------------------------- */}

      <Box sx={listProductSx}>
        {selectedProducts.length <= 0 ? (
          <NoDataPanel
            message="Chưa có sản phẩm nào"
            wrapImageStyles={{
              height: "120px",
            }}
            showImage
          />
        ) : (
          <Stack>
            {selectedProducts.map((item, index) => {
              return (
                <ProductItem
                  onDeleteProduct={isDelete ? handleDeleteProduct : undefined}
                  onUpdateProduct={isUpdate ? handleUpdateProduct : undefined}
                  key={index}
                  product={item}
                  index={index}
                  isShowPromotion={isShowPromotion}
                  error={error?.[index]}
                  disabled={disabled}
                  isShowInventoryForOrderConfirm={
                    item.bundle_variants?.length ? false : isShowInventory
                  }
                  isShowSKU={isShowSKU}
                  hiddenColumns={hiddenColumns}
                  bundleHiddenColumns={bundleHiddenColumns}
                />
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

const titleListProductStyle = { marginBottom: 8, marginTop: 16 };
const formHelperTextStyle = { marginTop: 0 };

const TitleHeaderProductList = styled(Typography)(() => ({
  lineHeight: "1.5rem",
  fontSize: "0.875rem",
  fontWeight: 600,
}));
