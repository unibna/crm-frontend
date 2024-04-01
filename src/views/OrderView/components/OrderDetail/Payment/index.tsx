import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { orderApi } from "_apis_/order.api";
import {
  OrderFormType,
  OrderPaymentType,
  OrderPaymentTypeV2,
  OrderPromotionType,
} from "_types_/OrderType";
import { PROMOTION_TYPE, PromotionType } from "_types_/PromotionType";
import { Section, TitleSection } from "components/Labels";
import { paymentTotalByOrderPromotions } from "features/order/handlePaymentTotal";
import vi from "locales/vi.json";
import map from "lodash/map";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FieldErrors } from "react-hook-form";
import Cost from "./Cost";
import DiscountInput from "./DiscountInput";
import DiscountPromotion from "./DiscountPromotion";
import FeeAdditional from "./FeeAdditional";
import FeeDelivery from "./FeeDelivery";
import Note from "./Note";
import PaymentType from "./PaymentType";
import TotalActual from "./TotalActual";
import TotalVariantQuantity from "./TotalVariantQuantity";

const PADDING_COLUMN = 1 / 12;

const LoadingSkeleton = () => {
  return (
    <>
      {map([1, 2, 3, 4], (item) => (
        <Stack direction="row" alignItems="center" key={item} width="100%" spacing={1}>
          <Skeleton width="100%" height={60} />
          <Skeleton width="100%" height={60} />
        </Stack>
      ))}
    </>
  );
};

interface Props {
  onChangePayment: (value: OrderFormType["payment"]) => void;
  onChangePaymentType: (value: OrderFormType["payments"]) => void;
  onChangePromotion: (value: OrderFormType["promotions"]) => void;
  errors: FieldErrors<OrderFormType>;
  payment?: Partial<OrderPaymentType>;
  promotions?: Partial<PromotionType>[];
  loading?: boolean;
  isEdit?: boolean;
  payments?: Partial<OrderPaymentTypeV2>[];
  orderID?: string;
}

const Payment = ({
  onChangePayment,
  onChangePaymentType,
  onChangePromotion,
  payment = {},
  promotions: promotionSelected = [],
  loading,
  errors,
  isEdit,
  payments = [],
  orderID,
}: Props) => {
  const [promotions, setPromotions] = useState<PromotionType[]>([]);

  const {
    total_actual = 0,
    total_variant_quantity = 0,
    total_variant_actual = 0,
    total_variant_all = 0,
    fee_delivery = 0,
    discount_input = 0,
    discount_promotion = 0,
    fee_additional = 0,
    cost = 0,
  } = payment;

  const isCostConfirm = useMemo(() => {
    const codPayment = payments.find((item) => item.type === "COD");
    return codPayment?.is_confirmed;
  }, [payments]);

  const handleChangeShippingFee = (value: number) => {
    const { total_actual = 0, fee_delivery = 0 } = payment;
    const fee = value;
    const newTotal = total_actual - fee_delivery + value;
    const newCost = newTotal;

    onChangePayment({
      ...payment,
      fee_delivery: fee,
      total_actual: newTotal,
      cost: newCost,
    });
    onChangePaymentType(undefined);
  };

  const handleChangePromotion = (prevPromotionSelect: Partial<OrderPromotionType>[]) => {
    onChangePromotion(prevPromotionSelect);
    const { cost, total_actual, discount_promotion } = paymentTotalByOrderPromotions({
      promotionValue: prevPromotionSelect,
      paymentValue: payment,
    });
    const newPayment = {
      ...payment,
      cost,
      discount_promotion,
      total_actual,
    };
    onChangePayment(newPayment);
    const newPayments: OrderPaymentTypeV2[] | undefined = !total_actual
      ? [{ type: "COD", amount: 0 }]
      : undefined;

    onChangePaymentType(newPayments);
  };

  const handleRemoveDiscount = (index: number) => {
    const promotionClones = [...promotionSelected];
    promotionClones.splice(index, 1);
    onChangePromotion(promotionClones);
    const { cost, discount_promotion, total_actual } = paymentTotalByOrderPromotions({
      promotionValue: promotionClones,
      paymentValue: payment,
    });

    const newPayment = {
      ...payment,
      cost,
      discount_promotion,
      total_actual,
    };
    onChangePayment(newPayment);
    onChangePaymentType(undefined);
  };

  const handleChangeDiscount = (value: number) => {
    const newTotal = total_actual + discount_input - value;
    const newCost = newTotal;

    onChangePayment({
      ...payment,
      discount_input: value,
      total_actual: newTotal,
      cost: newCost,
    });

    const newPayments: OrderPaymentTypeV2[] | undefined = !newTotal
      ? [{ type: "COD", amount: 0 }]
      : undefined;
    onChangePaymentType(newPayments);
  };

  const handleChangeAdditionFee = (value: number) => {
    const { total_actual = 0, fee_additional = 0 } = payment;
    const newTotal = total_actual - fee_additional + value;
    const newCost = newTotal;

    onChangePayment({
      ...payment,
      fee_additional: value,
      total_actual: newTotal,
      cost: newCost,
    });
    onChangePaymentType(undefined);
  };

  const getPromotions = useCallback(async () => {
    if (isEdit) {
      const result = await orderApi.get<PromotionType>({
        endpoint: "promotion/",
        params: { type: PROMOTION_TYPE.ORDER, status: "ACTIVED", limit: 50, page: 1 },
      });
      if (result?.data) {
        setPromotions(result.data.results);
      }
    }
  }, [isEdit]);

  const handleChange = (value: Partial<OrderPaymentTypeV2>[]) => {
    let paymentsClone = [...value];
    const transferIdx = value.findIndex((item) => item.type === "DIRECT_TRANSFER");

    const paidSum = transferIdx >= 0 ? paymentsClone[transferIdx].amount || 0 : 0;

    const cost = total_actual - paidSum;

    if (paidSum > total_actual) {
      return;
    }

    onChangePaymentType(value);
    onChangePayment({ ...payment, cost });
  };

  useEffect(() => {
    getPromotions();
  }, [getPromotions]);

  return (
    <Section elevation={3} sx={{ mb: 2 }}>
      <TitleSection>{vi.payment}</TitleSection>
      <Divider sx={{ my: 1 }} />
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Stack
            direction="column"
            spacing={1}
            padding={1}
            style={{
              paddingRight: orderID ? `${PADDING_COLUMN * 100}%` : `${PADDING_COLUMN * 2 * 100}%`,
            }}
          >
            <TotalVariantQuantity
              total_variant_actual={total_variant_actual}
              total_variant_all={total_variant_all}
              total_variant_quantity={total_variant_quantity}
            />
            <DiscountPromotion
              onChangePromotion={handleChangePromotion}
              loading={false}
              promotions={promotions}
              total_variant_actual={total_variant_actual}
              handleRemoveDiscount={handleRemoveDiscount}
              promotionSelected={promotionSelected}
              isEdit={isEdit && !orderID}
              discount_promotion={discount_promotion}
              payment={payment}
            />
            <DiscountInput
              discount_input={discount_input}
              errors={errors}
              handleChangeDiscount={handleChangeDiscount}
              isEdit={isEdit && !orderID}
            />
            <FeeDelivery
              isEdit={isEdit && !orderID}
              handleChangeShippingFee={handleChangeShippingFee}
              fee_delivery={fee_delivery}
            />
            <FeeAdditional
              fee_additional={fee_additional}
              handleChangeAdditionFee={handleChangeAdditionFee}
              isEdit={isEdit && !orderID}
            />
            <Note
              onChange={(value) => onChangePayment({ ...payment, payment_note: value })}
              isEdit={isEdit && !orderID}
              error={errors.payment?.payment_note}
              value={payment.payment_note}
            />
            <TotalActual total_actual={total_actual} isEdit={isEdit} />
            <PaymentType
              errors={errors}
              onChange={handleChange}
              payments={payments}
              isEdit={isEdit}
              payment={payment}
            />
          </Stack>
          <Divider sx={{ my: 1 }} />

          <Stack
            direction="column"
            spacing={1}
            padding={1}
            style={{
              paddingRight: orderID ? `${PADDING_COLUMN * 100}%` : `${PADDING_COLUMN * 2 * 100}%`,
            }}
          >
            <Cost cost={cost} isConfirm={isCostConfirm} />
          </Stack>
        </>
      )}
    </Section>
  );
};

export default memo(Payment);
