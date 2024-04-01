//components
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import RedeemIcon from "@mui/icons-material/Redeem";
import CouponItem from "./CouponItem";

//types
import { DISCOUNT_METHOD, PromotionType } from "_types_/PromotionType";
import { SxProps } from "@mui/material";
import { Theme } from "@mui/material";
import { AttributeVariant } from "_types_/ProductType";

//utils
import { fNumber, fShortenNumber } from "utils/formatNumber";
import { fDate } from "utils/dateUtil";
import { toastWarning } from "store/redux/toast/slice";

//hooks
import { useAppDispatch } from "hooks/reduxHook";
import { ProductItem } from "components/ProductComponent";

const PromotionItem = ({
  promotion,
  onClick,
  product,
  sx,
  total_variant_actual = 0,
  onChange,
  selected,
}: {
  promotion: PromotionType;
  onClick?: () => void;
  product?: AttributeVariant;
  sx?: SxProps<Theme>;
  total_variant_actual?: number;
  selected?: boolean;
  onChange?: (promotion: PromotionType) => void;
}) => {
  const dispatch = useAppDispatch();

  const {
    combo_times = 0,
    new_promotion_variant_quantity = 0,
    requirements,
    discount_method,
    name,
    date_end,
    discount_amount,
    discount_percent,
    available_variants,
    note,
  } = promotion;

  const handleSelectAvailableGift = (checked: boolean, index: number) => {
    if (checked) {
      if (combo_times !== undefined && new_promotion_variant_quantity >= combo_times) {
        dispatch(toastWarning({ message: "Không thể chọn quá giới hạn lựa chọn" }));
        return;
      } else {
        let promotionClone = { ...promotion };
        if (available_variants?.length) {
          available_variants!![index].selected = checked;
          const quantity = available_variants!![index].quantity ? 1 : 0;
          promotionClone.new_promotion_variant_quantity = new_promotion_variant_quantity + quantity;
          onChange && onChange(promotionClone);
        }
      }
    } else {
      const promotionClone = {
        ...promotion,
        new_promotion_variant_quantity:
          new_promotion_variant_quantity - available_variants!![index].quantity,
      };
      if (promotionClone.available_variants?.length) {
        promotionClone.available_variants!![index].selected = checked;

        onChange && onChange(promotionClone);
      }
    }
  };

  const amountRequirement = requirements.find((pr) => pr.requirement_type === "TOTAL_BILL");
  const quantityRequirement = requirements.find((pr) => pr.requirement_type === "QUANTITY_MIN");

  const isMatchAmountPromotion = amountRequirement
    ? (total_variant_actual || (product?.quantity || 0) * (product?.sale_price || 0) || 0) >=
      (amountRequirement.requirement || 0)
      ? true
      : false
    : true;

  const isMatchQuantityPromotion = quantityRequirement
    ? (product?.quantity || 0) >= (quantityRequirement.requirement || 0)
      ? true
      : false
    : true;

  const isDisabled = !isMatchAmountPromotion || !isMatchQuantityPromotion;

  const couponName =
    discount_method === DISCOUNT_METHOD.COMBO
      ? `${name} (combo ${combo_times} sản phẩm khuyến mãi)`
      : name;

  const description = (
    <>
      {(requirements[0].requirement && (
        <Typography>Đơn hàng từ {fNumber(requirements[0].requirement)} ₫</Typography>
      )) ||
        ""}
      {(requirements[1].requirement && (
        <Typography>Đơn hàng từ {fNumber(requirements[1].requirement)} sản phẩm</Typography>
      )) ||
        ""}

      {(requirements[2].limit && (
        <Typography>{"Giảm tối đa " + fNumber(requirements[2].limit)} đ</Typography>
      )) ||
        ""}
    </>
  );

  const exp: string = date_end ? fDate(date_end)?.toString() || "" : "Không giới hạn";

  const value =
    discount_method === DISCOUNT_METHOD.COMBO ? (
      <RedeemIcon style={{ fontSize: "2.2rem" }} />
    ) : discount_method === DISCOUNT_METHOD.AMOUNT ? (
      fShortenNumber(discount_amount)
    ) : (
      `${discount_percent}%`
    );

  return (
    <>
      <ListItemButton
        sx={{ ...sx, width: "fit-content" }}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        autoFocus={selected}
      >
        <CouponItem
          name={couponName}
          description={description}
          expiredAt={exp}
          value={value}
          note={note}
        />
      </ListItemButton>
      {selected && (
        <Stack direction="column" spacing={2} mt={2} sx={{ overflowY: "auto" }}>
          {available_variants?.map((availableVariant, index) => {
            return (
              <ListItemButton
                key={index}
                onClick={(e) => {
                  handleSelectAvailableGift(Boolean(selected && !availableVariant.selected), index);
                  e.preventDefault();
                }}
                style={{ marginTop: 0, padding: 4 }}
              >
                <Checkbox
                  disabled={!selected}
                  checked={selected && availableVariant.selected ? true : false}
                  onChange={(e) => {
                    handleSelectAvailableGift(e.target.checked, index);
                    e.preventDefault();
                  }}
                />
                <ProductItem
                  index={availableVariant.variant.id}
                  product={{ ...availableVariant.variant, quantity: availableVariant.quantity }}
                  disabled
                  hiddenColumns={["quantity", "price", "total", "cross_sale", "listed_price"]}
                />
              </ListItemButton>
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default PromotionItem;
