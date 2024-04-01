import { OrderPromotionType } from "_types_/OrderType";
import { DISCOUNT_METHOD } from "_types_/PromotionType";

export const countPromotionDiscount = (
  promotion: Partial<OrderPromotionType>,
  totalActual: number = 0
) => {
  let discountAmount = 0;
  const { discount_method, discount_percent = 0, discount_amount = 0 } = promotion;
  if (discount_method === DISCOUNT_METHOD.PERCENTAGE) {
    discountAmount = (discount_percent * totalActual) / 100;

    if (
      promotion?.requirements?.[2]?.limit &&
      (discountAmount || 0) > (promotion?.requirements[2]?.limit || 0)
    ) {
      discountAmount = promotion?.requirements[2]?.limit || 0;
    }
  } else {
    discountAmount = discount_amount;
  }
  return discountAmount;
};
