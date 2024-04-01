import { OrderPaymentType } from "_types_/OrderType";
import { PromotionType } from "_types_/PromotionType";
import reduce from "lodash/reduce";

export const paymentTotal = ({
  discount_input = 0,
  fee_additional = 0,
  fee_delivery = 0,
  total = 0,
  newPromotionTotal = 0,
}: {
  total?: number;
  fee_delivery?: number;
  fee_additional?: number;
  discount_input?: number;
  newPromotionTotal?: number;
}) => {
  return total + fee_delivery + fee_additional - discount_input - newPromotionTotal;
};

export const paymentTotalByOrderPromotions = ({
  promotionValue = [],
  paymentValue = {},
}: {
  promotionValue?: Partial<PromotionType>[];
  paymentValue?: Partial<OrderPaymentType>;
}) => {
  const {
    total_variant_actual = 0,
    fee_additional = 0,
    fee_delivery = 0,
    discount_input = 0,
  } = paymentValue;

  let newPromotionTotal = reduce(
    promotionValue,
    (item, cur) => {
      return (item += cur.discount_amount || 0);
    },
    0
  );

  const newTotal = paymentTotal({
    total: total_variant_actual,
    discount_input,
    fee_additional,
    fee_delivery,
    newPromotionTotal,
  });

  return {
    discount_promotion: newPromotionTotal,
    total_actual: newTotal,
    cost: newTotal,
  };
};
