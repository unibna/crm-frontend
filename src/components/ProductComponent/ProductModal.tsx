import { SearchField } from "components/Fields";
import { memo, useCallback, useEffect, useState } from "react";
import { ProductItem } from "./ProductItem";
import FormPopup from "components/Popups/FormPopup";
import { productApi } from "_apis_/product";
import map from "lodash/map";
import find from "lodash/find";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { OrderPaymentType } from "_types_/OrderType";
import { NoDataPanel } from "components/DDataGrid/components";
import { styled } from "@mui/material";
import { AttributeVariant } from "_types_/ProductType";
import { useCancelToken } from "hooks/useCancelToken";
import { ErrorName } from "_types_/ResponseApiType";
import { DISCOUNT_METHOD, PromotionType } from "_types_/PromotionType";
import { paymentTotal } from "features/order/handlePaymentTotal";

const sumVariant = ({
  payment,
  checkedProduct,
}: {
  payment?: OrderPaymentType;
  checkedProduct: AttributeVariant[];
}) => {
  let quantity = 0;
  let newVariantActual = 0;
  let newVariantCost = 0;
  const { fee_delivery = 0, fee_additional = 0, discount_input = 0 } = payment || {};
  map(checkedProduct, (item) => {
    const { discount = 0, sale_price = 0, quantity: itemQuantity = 0 } = item;
    const { totalGiftQuantity, totalSalePriceVariants } = summaryGift(itemQuantity, item.promotion);

    quantity += itemQuantity + totalGiftQuantity;

    newVariantActual += itemQuantity * (sale_price - discount);
    newVariantCost += itemQuantity * sale_price + totalSalePriceVariants;
    return;
  });

  const newPaymentTotal = paymentTotal({
    total: newVariantActual,
    discount_input,
    fee_additional,
    fee_delivery,
  });

  return {
    newVariantActual,
    quantity,
    newVariantCost,
    newCost: newPaymentTotal,
    newTotal: newPaymentTotal,
  };
};

const sumPayment = ({
  newPayment,
  payment,
}: {
  newPayment: {
    total_variant_quantity: number;
    total_variant_actual: number;
    total_variant_all: number;
    cost: number;
    total_actual: number;
  };
  payment?: OrderPaymentType;
}) => {
  const { fee_additional = 0, fee_delivery = 0, discount_input = 0 } = payment || {};
  const totalVariantQuantity =
    (payment?.total_variant_quantity || 0) + newPayment.total_variant_quantity;

  const totalVariantAll = (payment?.total_variant_all || 0) + newPayment.total_variant_all;

  const totalVariantActual = (payment?.total_variant_actual || 0) + newPayment.total_variant_actual;

  const newPaymentTotal = paymentTotal({
    total: totalVariantActual,
    discount_input,
    fee_additional,
    fee_delivery,
  });

  const result: OrderPaymentType = {
    total_variant_quantity: totalVariantQuantity,
    total_variant_all: totalVariantAll,
    total_variant_actual: totalVariantActual,
    cost: newPaymentTotal,
    total_actual: newPaymentTotal,
  };

  return {
    ...result,
    total_actual: newPaymentTotal,
    discount_promotion: 0,
  };
};

const summaryGift = (variantQuantity: number, promotion?: Partial<PromotionType>) => {
  let totalGiftQuantity = 0,
    totalSalePriceVariants = 0;

  let giftVariants: PromotionType[] = [];

  if (promotion?.discount_method === DISCOUNT_METHOD.COMBO) {
    // tính số lần apply discount
    const timeGiftFromPromotionRequire = Math.floor(
      variantQuantity / (promotion?.requirements?.[1]?.requirement || 1)
    );

    map(promotion.gift_variants, (item) => {
      // số lượng KM sản phẩm = tính số lần apply discount * số lượng sản phẩm KM
      const giftQuantity = timeGiftFromPromotionRequire * (item.quantity || 1);
      giftVariants.push({ ...item, gift_quantity: giftQuantity });
      totalGiftQuantity += giftQuantity;
      totalSalePriceVariants += (item.variant?.sale_price || 0) * (item.quantity || 1);
    });
  }
  return { giftVariants, totalGiftQuantity, totalSalePriceVariants };
};

interface Props {
  setSearchProductText: React.Dispatch<React.SetStateAction<string>>;
  setSelectedProduct: (syncedProducts: AttributeVariant[]) => void;
  setPayment?: (value: Partial<OrderPaymentType>) => void;
  payment?: OrderPaymentType;
  params?: any;
  searchDefault: string;
}

export const ProductModal = memo((props: Props) => {
  const { setSearchProductText, setSelectedProduct, setPayment, payment, params, searchDefault } =
    props;

  const [products, setProducts] = useState<{ data: AttributeVariant[]; loading: boolean }>({
    data: [],
    loading: false,
  });
  const [syncedProducts, setSyncedProducts] = useState<{ data: AttributeVariant[] }>({ data: [] });

  const [checkedProduct, setCheckedProduct] = useState<AttributeVariant[]>([]);
  const { newCancelToken } = useCancelToken([searchDefault]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePickProduct = async ({
    index,
    product,
  }: {
    product: AttributeVariant;
    index: number;
  }) => {
    // const totalInventoryForOrderConfirm =
    //   total_inventory - (inventory_available?.quality_confirm || 0);

    //tìm product trong danh sách đã checked
    const checkedProductClone = [...checkedProduct];
    const checkNewProductIdx = checkedProductClone.findIndex((item) => item.id === product.id);
    if (checkNewProductIdx >= 0) {
      //nếu có thì remove
      checkedProductClone.splice(checkNewProductIdx, 1);
    } else {
      //nếu chưa có thì lấy promotion của product và thêm vào checked product
      // const promotions = await getPromotionFromProduct(product.id);
      checkedProductClone.push({
        ...product,
        quantity: product.quantity || 1,
        total: product.sale_price,
      });
    }
    setCheckedProduct(checkedProductClone);
    if (index !== -1) {
      //update lại trong danh sách product modal
      const productClone = syncedProducts.data;
      productClone[index] = product;

      setSyncedProducts((prev) => ({ ...prev, data: productClone }));
    }
  };

  const handlePickDuplicateProduct = async ({
    index,
    product,
  }: {
    product: AttributeVariant;
    index: number;
  }) => {
    //tìm product trong danh sách đã checked
    const checkedProductClone = [...checkedProduct];
    //nếu chưa có thì lấy promotion của product và thêm vào checked product
    // const promotions = await getPromotionFromProduct(product.id);
    checkedProductClone.push({
      ...product,
      quantity: product.quantity || 1,
      total: product.sale_price,
    });
    setCheckedProduct(checkedProductClone);
    //update lại trong danh sách product modal
    const productClone = syncedProducts.data;
    productClone[index] = product;

    setSyncedProducts((prev) => ({ ...prev, data: productClone }));
  };

  const fillSelectedProductToModal = useCallback(() => {
    let productClone = [...products.data];
    productClone = map(productClone, (curr) => {
      const selectedProduct = find(checkedProduct, (item) => item.id === curr.id);
      return { ...curr, selected: !!selectedProduct };
    });
    setSyncedProducts({ data: productClone });
  }, [products.data, checkedProduct]);

  const handleSubmitSelectedProduct = () => {
    handleClose();

    const { newCost, newTotal, newVariantActual, newVariantCost, quantity } = sumVariant({
      checkedProduct,
      payment,
    });

    const newPayment = sumPayment({
      newPayment: {
        total_variant_actual: newVariantActual,
        total_variant_quantity: quantity,
        total_variant_all: newVariantCost,
        cost: newCost,
        total_actual: newTotal,
      },
      payment,
    });
    setPayment && setPayment(newPayment);

    setSelectedProduct(checkedProduct);
  };

  const getProducts = useCallback(async () => {
    if (open) {
      setProducts((prev) => ({ ...prev, loading: true }));

      const result = await productApi.get<AttributeVariant>(
        {
          limit: 200,
          page: 1,
          search: searchDefault,
          ...params,
          status: "ACTIVE",
          cancelToken: newCancelToken(),
        },
        "variant/search/"
      );
      if (result.data) {
        setProducts({ data: result.data.results, loading: false });
        return;
      }

      if ((result?.error?.name as ErrorName) === "CANCEL_REQUEST") {
        return;
      }

      setProducts((prev) => ({ ...prev, loading: false }));
    }
  }, [newCancelToken, params, searchDefault, open]);

  const handleOpen = useCallback(() => {
    if (!!searchDefault) {
      setOpen(true);
    }
  }, [searchDefault]);

  const handleCloseModal = useCallback(() => {
    if (!open) {
      setCheckedProduct([]);
      setSyncedProducts((prev) => ({ ...prev, data: [] }));
      setSearchProductText("");
    }
  }, [open, setSearchProductText]);

  useEffect(() => {
    fillSelectedProductToModal();
  }, [fillSelectedProductToModal]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    handleOpen();
  }, [handleOpen]);

  useEffect(() => {
    handleCloseModal();
  }, [handleCloseModal]);

  return (
    <FormPopup
      title="Chọn sản phẩm"
      buttonText="Xong"
      maxWidthForm="md"
      isOpen={open}
      isDisabledSubmit={false}
      handleSubmitPopup={handleSubmitSelectedProduct}
      handleClose={handleClose}
      funcContentRender={() => (
        <>
          <SearchField
            isDebounce
            onSearch={setSearchProductText}
            defaultValue={searchDefault}
            fullWidth
            renderIcon={<></>}
            placeholder="Nhập tên sản phẩm, SKU"
            autoFocus
            loading={products.loading}
            adornmentPosition="end"
            style={{ marginBottom: 16 }}
          />
          <Paper elevation={2} style={{ height: 50, marginBottom: 8 }}>
            <Grid
              container
              p={2}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ color: "#637381" }}
            >
              <Grid item xs={7}>
                <TitleHeaderProductList>Sản phẩm</TitleHeaderProductList>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={1.5}>
                <TitleHeaderProductList>Giá niêm yết</TitleHeaderProductList>
              </Grid>
              <Grid item xs={1.5}>
                <TitleHeaderProductList>Giá bán</TitleHeaderProductList>
              </Grid>
            </Grid>
          </Paper>
          {syncedProducts.data.length === 0 ? (
            <NoDataPanel
              message="Không có sản phẩm tìm kiếm"
              wrapImageStyles={{
                height: "120px",
              }}
              showImage
            />
          ) : (
            <List>
              {syncedProducts.data.map((item, idx) => {
                return (
                  <ProductItem
                    disabled
                    product={item}
                    key={item.id}
                    onCheckedProduct={handlePickProduct}
                    index={idx}
                    hiddenColumns={["quantity", "price", "cross_sale"]}
                    bundleHiddenColumns={["price", "quantity"]}
                    isShowActualInventory={item.bundle_variants?.length ? false : true}
                    isShowInventoryForOrderConfirm={item.bundle_variants?.length ? false : true}
                    imageHeight={92}
                  />
                );
              })}
            </List>
          )}
        </>
      )}
    />
  );
});

const TitleHeaderProductList = styled(Typography)(() => ({
  lineHeight: "1.5rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  paddingLeft: "2px",
}));
