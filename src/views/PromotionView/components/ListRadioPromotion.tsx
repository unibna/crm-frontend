//hooks
import { memo, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "hooks/reduxHook";

//types
import { DISCOUNT_METHOD, PromotionType } from "_types_/PromotionType";

//apis
import { orderApi } from "_apis_/order.api";

//components
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Theme, SxProps } from "@mui/material";
import PromotionItem from "./PromotionItem";
import Box from "@mui/material/Box";
import { NoDataPanel } from "components/DDataGrid/components";

//utils
import { toastWarning } from "store/redux/toast/slice";
import map from "lodash/map";
import { AttributeVariant } from "_types_/ProductType";

const LoadingSkeleton = () => {
  return (
    <>
      {map([1, 2, 3, 4], (item) => (
        <Stack
          direction="row"
          alignItems="center"
          key={item}
          width="100%"
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Skeleton variant="circular" width={35} height={35} sx={{ flexShrink: 0 }} />
          <Stack direction="column" spacing={0.1} sx={{ width: "100%", minWidth: 240 }}>
            <Skeleton width="100%" height={10} />
            <Skeleton width="100%" height={10} />
            <Skeleton width="100%" height={10} />
            <Skeleton width="100%" height={10} />
          </Stack>
        </Stack>
      ))}
    </>
  );
};

let isChangePromotion = false;

export interface PromotionParams {
  limit?: number;
  page?: number;
  applied_variant?: string;
}

const ListRadioPromotion = ({
  onChangePromotion,
  total_variant_actual = 0,
  isOpen,
  params,
  product,
  promotion,
  sx,
  checkFor = "order",
}: {
  total_variant_actual?: number; // dành cho đơn hàng
  onChangePromotion: (value?: PromotionType) => void;
  isOpen: boolean;
  params?: PromotionParams;
  product?: AttributeVariant;
  promotion?: Partial<PromotionType>;
  sx?: SxProps<Theme>;
  checkFor: "order" | "variant";
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [promotionSelected, setPromotionSelected] = useState<string>();

  const getPromotions = useCallback(async () => {
    setLoading(true);
    const result = await orderApi.get<PromotionType>({
      endpoint: "promotion/",
      params: { applied_variant: params?.applied_variant, status: "ACTIVED", limit: 50, page: 1 },
    });
    if (result.data) {
      const findPromoIndex = result.data.results.findIndex(
        (item) => item.id?.toString() === promotion?.id?.toString()
      );
      //tìm promotion của variant có trong list promotion không
      //nếu có thì gán promotion bằng
      if (findPromoIndex >= 0) {
        let resultClone = [...result.data.results];
        // set selected available gift variants
        if (promotion?.discount_method === DISCOUNT_METHOD.COMBO) {
          //update available gift
          map(resultClone[findPromoIndex].available_variants, (item) => {
            const giftIndex = promotion.gift_variants?.findIndex(
              (promoSelected) => promoSelected?.id?.toString() === item?.id?.toString()
            );
            if (giftIndex !== -1) {
              item.selected = true;
              item.quantity = promotion?.gift_variants?.[giftIndex || 0]?.quantity;
            } else {
              item.selected = false;
            }
            return item;
          });
          resultClone[findPromoIndex].new_promotion_variant_quantity =
            promotion?.new_promotion_variant_quantity;
        }
        setPromotions(resultClone);
      } else {
        setPromotions(result.data.results);
      }
    }

    setLoading(false);
  }, [
    params?.applied_variant,
    promotion?.discount_method,
    promotion?.gift_variants,
    promotion?.id,
    promotion?.new_promotion_variant_quantity,
  ]);

  const handleSelectedPromotion = (e: React.ChangeEvent<HTMLInputElement>) => {
    isChangePromotion = true;
    setPromotionSelected(e.target.value.toString());
    checkFor === "order" && handleChangePromotion(e.target.value.toString());
    e.preventDefault();
  };

  const handleChangePromotion = (value?: string) => {
    let promotion = promotions.find((item) => item.id?.toString() === value?.toString());
    if (promotion) {
      const sale_price = product?.sale_price || 0;
      let discount_amount = 0;

      //khuyến mãi theo tiền
      if (promotion.discount_method === DISCOUNT_METHOD.AMOUNT) {
        discount_amount = promotion.discount_amount;
        // khuyến mãi theo phần trăm
      } else if (promotion.discount_method === DISCOUNT_METHOD.PERCENTAGE) {
        const costOrigin = checkFor === "order" ? total_variant_actual : sale_price;
        discount_amount = (promotion.discount_percent * costOrigin) / 100;
        //kiểm tra nếu số tiền giảm nhiều hơn giới hạn khuyến mãi thì lấy giới hạn khuyến mãi
        if (
          promotion.requirements[2].limit &&
          discount_amount > (promotion.requirements[2].limit || 0)
        ) {
          discount_amount = promotion.requirements[2].limit || 0;
        }
        // ------------------------------
        promotion.total_after_discount =
          discount_amount < sale_price ? sale_price - discount_amount : 0;
      } else {
        // tìm sản phẩm được chọn trong combo KM
        const giftVariants = promotion.available_variants?.filter((item) => {
          return item.selected;
        });
        // chọn chương trình kM nhưng không chọn SP trong combo => xoá KM vừa chọn
        if (giftVariants?.length === 0) {
          dispatch(toastWarning({ message: "Khuyến mãi vẫn chưa được chọn" }));
          onChangePromotion(undefined);
          return;
          // ----------------------------------
        } else {
          promotion.gift_variants = giftVariants;
        }
      }
      promotion.discount_amount = discount_amount;
      onChangePromotion(promotion);
    }
  };

  const handleChangeListPromotion = (value: PromotionType, idx: number) => {
    isChangePromotion = true;
    const promotionsClone = [...promotions];
    promotionsClone[idx] = value;
    setPromotions(promotionsClone);
  };

  useEffect(() => {
    if (isOpen) {
      getPromotions();
    } else {
      setPromotionSelected(undefined);
    }
    isChangePromotion = false;
  }, [isOpen, getPromotions]);

  useEffect(() => {
    if (isOpen) {
      setPromotionSelected(promotion?.id?.toString() || promotionSelected?.toString());
    }
  }, [promotions, isOpen, promotion?.id, promotionSelected]);

  useEffect(() => {
    setPromotionSelected(promotion?.id?.toString());
  }, [promotion?.id]);

  return loading ? (
    <Box p={1}>
      <LoadingSkeleton />
    </Box>
  ) : promotions.length <= 0 ? (
    <Box
      sx={{
        display: "flex",
        minWidth: 200,
        // height: 100,
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
      }}
    >
      <NoDataPanel />
    </Box>
  ) : (
    <ClickAwayListener
      onClickAway={
        checkFor === "variant" && isChangePromotion
          ? () => handleChangePromotion(promotionSelected)
          : () => {}
      }
    >
      <FormControl sx={{ padding: 1.5, pl: 3, width: "100%", ...sx }}>
        <RadioGroup
          value={promotionSelected?.toString() || null}
          onChange={handleSelectedPromotion}
          aria-labelledby="promotions-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
        >
          {promotions.map((item, idx) => {
            const amountRequirement = item?.requirements.find(
              (pr) => pr.requirement_type === "TOTAL_BILL"
            );
            const quantityRequirement = item?.requirements.find(
              (pr) => pr.requirement_type === "QUANTITY_MIN"
            );

            const isMatchAmountPromotion = amountRequirement
              ? (total_variant_actual ||
                  (product?.quantity || 0) * (product?.sale_price || 0) ||
                  0) >= (amountRequirement.requirement || 0)
                ? true
                : false
              : true;

            const isMatchQuantityPromotion = quantityRequirement
              ? (product?.quantity || 0) >= (quantityRequirement.requirement || 0)
                ? true
                : false
              : true;

            const activeStatus = item.status === "ACTIVED";

            return (
              <FormControlLabel
                sx={{
                  width: "100%",
                  "& > .MuiTypography-root": { width: "100%" },
                  alignItems: "flex-start",
                  mb: 2,
                }}
                key={item.id + item.name}
                value={item.id?.toString()}
                control={<Radio />}
                disabled={(!isMatchAmountPromotion || !isMatchQuantityPromotion) && activeStatus}
                label={
                  <>
                    <PromotionItem
                      product={product}
                      promotion={item}
                      sx={{ padding: 0 }}
                      total_variant_actual={total_variant_actual}
                      onChange={(value) => handleChangeListPromotion(value, idx)}
                      selected={promotionSelected?.toString() === item.id?.toString()}
                    />
                  </>
                }
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </ClickAwayListener>
  );
};

export default memo(ListRadioPromotion);
