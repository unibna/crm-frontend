import {
  LineItemDTO,
  OrderDTO,
  OrderFormType,
  OrderPaymentTypeV2,
  OrderStatusValue,
  OrderType,
} from "_types_/OrderType";
import { AttributeVariant } from "_types_/ProductType";
import { UserType } from "_types_/UserType";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { countPromotionDiscount } from "./countPromotionDiscount";
import { ProductProps } from "views/OrderView/components/OrderPrintModal/PrintOrder";

export const formatOrderDataToForm = (row?: Partial<OrderType>): OrderFormType => {
  // dòng này là reset payment với order có trạng thái cancel
  // const payment = row?.status?.status === "cancel" ? defaultOrderForm.payment : row?.payment;
  // const id = row?.id ? (row?.status === "cancel" ? undefined : row.id) : undefined;
  const {
    total_variant_actual,
    total_variant_all,
    total_variant_quantity,
    fee_additional,
    fee_delivery,
    discount_input,
    discount_promotion,
    payment_note,
    total_actual = 0,
    cost,
    shipping_address,
    promotions,
  } = row || {};

  const productSelected =
    (map(row?.line_items, (item) => {
      const {
        total,
        promotion,
        discount,
        is_cross_sale,
        variant,
        variant_total,
        quantity,
        item_gift_variants,
        bundle_items,
      } = item;

      let newGiftVariantPrice = 0,
        newPromotionAppliedQuantity = 0;

      /* Mapping the gift variants to the promotion gift variants. */
      const giftVariants = map(item_gift_variants, (item) => {
        newPromotionAppliedQuantity += item.gift_quantity;
        newGiftVariantPrice += item.promotion_variant.variant.sale_price || 0;
        return {
          quantity: item.gift_quantity,
          variant_total: item.variant_total || item.promotion_variant?.variant?.sale_price,
          total: item.total,
          discount: item.discount || item.promotion_variant?.variant?.sale_price,
          variant: item.promotion_variant.variant,
          selected: true,
          id: item.promotion_variant.id,
        };
      });

      return {
        ...variant,
        bundle_variants: bundle_items,
        discount,
        is_cross_sale,
        promotion: promotion
          ? {
              ...promotion,
              gift_variants: giftVariants,
              available_variants: giftVariants,
              new_gift_variant_price: newGiftVariantPrice,
              new_promotion_variant_quantity: newPromotionAppliedQuantity,
            }
          : undefined,
        total,
        sale_price: variant_total,
        selected: true,
        quantity,
      } as AttributeVariant;
    }) as AttributeVariant[]) || [];

  const reCaculatePromotions = reduce(
    promotions,
    (prev, cur) => {
      const discount_amount = countPromotionDiscount(cur, total_variant_actual);
      return [...prev, { ...cur, discount_amount }];
    },
    []
  );
  // const payments = row?.payments?.filter((item) => item.amount !== 0);

  return {
    ...row,
    promotions: reCaculatePromotions,
    line_items: productSelected,
    shipping_address: shipping_address || {},
    // payments,
    payment: {
      total_variant_actual,
      total_variant_all,
      total_variant_quantity,
      fee_additional,
      fee_delivery,
      discount_input,
      discount_promotion,
      payment_note: payment_note || "",
      total_actual,
      cost,
    },
  };
};

export const formatOrderDataToRequestParams = ({
  form,
  user,
  defaultStatus,
}: {
  form: OrderFormType;
  user?: Partial<UserType> | null;
  defaultStatus?: OrderStatusValue;
}): OrderDTO | null => {
  const {
    customer,
    source,
    note,
    status,
    payment,
    promotions,
    tags,
    shipping_address,
    delivery_note,
    cross_sale_amount,
    customer_name,
    appointment_date,
    customer_staff_override,
    ecommerce_code,
    customer_offline_code,
  } = form;

  const promotionParams = map(promotions, (item) => item.id || "");

  const line_items: LineItemDTO[] = map(form?.line_items, (item) => {
    const {
      quantity = 0,
      id = "",
      sale_price = 0,
      is_cross_sale = false,
      promotion,
      discount,
      total,
    } = item;

    const giftVariants = map(promotion?.gift_variants, (item) => ({
      available_variant: item.id,
      gift_quantity: item.quantity || 0,
      variant_total: item.variant?.sale_price || 0,
      total: 0,
      discount: item.variant?.sale_price || 0,
    }));

    return {
      variant: id,
      variant_total: sale_price,
      is_cross_sale,
      quantity,
      promotion: promotion?.id
        ? {
            id: promotion?.id,
            gift_variants: giftVariants?.length ? giftVariants : undefined,
          }
        : undefined,
      discount,
      total,
    };
  });
  if (customer) {
    const { total_actual = 0 } = payment || {};

    let payments: Partial<OrderPaymentTypeV2>[] | undefined = undefined;
    if (defaultStatus !== "completed") {
      payments = form.payments?.filter((item: { amount: 0 }) => item.amount > 0);
      // đây là trạng thái stable
      const stableType = form.payments?.find((item) => item.type === "CASH" || item.type === "COD");

      // nếu có cost mà không có stable type thì gán cost cho COD
      // nếu không có cost và không có payment thì tạo payment COD ảo cho backend
      if ((payment?.cost && !stableType) || (!payment?.cost && !payments?.length)) {
        payments = [...(payments || []), { type: "COD", amount: payment?.cost || 0 }];
      }
      payments = payments?.map((item) => ({ type: item.type, amount: item.amount }));
    }

    const order: OrderDTO = {
      line_items,
      ecommerce_code,
      customer_offline_code,
      created_by: user?.id || "",
      source: source?.id.toString() || "",
      customer: customer.id || "",
      status,
      modified_by: user?.id || "",
      total_actual,
      promotions: promotionParams,
      note,
      delivery_note,
      tags,
      cross_sale_amount,
      is_cross_sale: cross_sale_amount ? true : false,
      customer_name,
      shipping_address: shipping_address?.id,
      appointment_date,
      payments,
      customer_staff_override,
      ...payment,
    };

    return order;
  }
  return null;
};

export const formatLineItemsForPrint = (line_items: any) => {
  const productList =
    reduce(
      line_items,
      (prev: ProductProps[], current: any) => {
        const temp = {
          name: current?.variant?.name,
          quantity: current.quantity,
          price: current?.variant_total,
          salePrice: current?.total,
          neoPrice: current?.variant?.neo_price,
          SKUCode: current?.variant?.SKU_code,
          giftVariantQuantity: 0,
          bundleVariants: current?.variant?.bundle_variants?.map((item: any) => ({
            name: item?.variant?.name,
            quantity: item.quantity * current.quantity,
            price: item?.variant?.sale_price,
            salePrice: item?.variant?.purchase_price,
            SKUCode: item?.variant?.SKU_code,
            neoPrice: item?.variant?.neo_price,
          })),
        };

        const currentExistedIndex = prev.findIndex(
          (itemPrev) => itemPrev.SKUCode === temp.SKUCode && itemPrev.salePrice === temp.salePrice
        );

        if (currentExistedIndex !== -1) {
          prev[currentExistedIndex] = {
            ...prev[currentExistedIndex],
            quantity: prev[currentExistedIndex].quantity + temp.quantity,
            giftVariantQuantity: prev[currentExistedIndex].giftVariantQuantity,

            // Nếu sản phẩm là combo thì số lượng mỗi sản phẩm trong combo của prev (số lượng của combo trong prev có thể là 1 hoặc nhiều) phải cộng thêm số lượng mỗi sản phẩm trong combo ở temp (số lượng combo là 1)
            ...(temp?.bundleVariants?.length &&
              prev[currentExistedIndex].bundleVariants && {
                bundleVariants: (prev[currentExistedIndex].bundleVariants || []).map((item) => ({
                  ...item,
                  quantity:
                    item.quantity +
                    (temp?.bundleVariants?.find(
                      (tempItem: any) => tempItem.SKUCode === item.SKUCode
                    )?.quantity || 0),
                })),
              }),
          };
        } else {
          prev = [...prev, temp];
        }

        current?.item_gift_variants?.map((item: any) => {
          const index = prev.findIndex(
            (itemPrev) =>
              itemPrev.SKUCode === item?.promotion_variant?.variant?.SKU_code &&
              itemPrev.salePrice === 0
          );
          if (index !== -1) {
            prev[index] = {
              ...prev[index],
              quantity: prev[index].quantity + item.gift_quantity,
              giftVariantQuantity: prev[index].giftVariantQuantity + item.gift_quantity,
            };
          } else {
            const tempGiftVariant = item?.promotion_variant?.variant;
            tempGiftVariant &&
              prev.push({
                name: tempGiftVariant.name,
                quantity: item.gift_quantity,
                price: tempGiftVariant.sale_price,
                neoPrice: tempGiftVariant?.neo_price,
                salePrice: 0,
                SKUCode: tempGiftVariant.SKU_code,
                giftVariantQuantity: item.gift_quantity,
              });
          }
          prev = [...prev];
        });
        return prev;
      },
      []
    ) || [];
  return productList;
};
