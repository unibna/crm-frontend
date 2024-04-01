//types
import { OrderPaymentType } from "_types_/OrderType";
import map from "lodash/map";
import { DISCOUNT_METHOD, PromotionType } from "_types_/PromotionType";

//components
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { LabelInfo, TextInfo } from "components/Labels";
import FormDialog from "components/Dialogs/FormDialog";
import OrderPromotions from "../Promotion/OrderPromotions";

//utils
import { fValueVnd } from "utils/formatNumber";

//icons
import DeleteIcon from "@mui/icons-material/Delete";

//hooks
import { useEffect, useState } from "react";
import { countPromotionDiscount } from "features/order/countPromotionDiscount";

const DiscountPromotion = ({
  onChangePromotion,
  loading,
  promotions,
  total_variant_actual,
  handleRemoveDiscount,
  isEdit,
  discount_promotion = 0,
  promotionSelected,
  payment,
}: {
  onChangePromotion: (prevPromotionSelect: Partial<PromotionType>[]) => void;
  promotions: PromotionType[];
  total_variant_actual: number;
  loading: boolean;
  handleRemoveDiscount: (index: number) => void;
  isEdit?: boolean;
  discount_promotion: number;
  promotionSelected: Partial<PromotionType>[];
  payment: OrderPaymentType;
}) => {
  const [prevPromotionSelect, setPrevPromotionSelect] = useState<Partial<PromotionType>[]>([]);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLSpanElement) | null>(null);

  const handleSelectedPromotion = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    let newPromotionSelected = [...prevPromotionSelect];
    if (e.target.checked) {
      newPromotionSelected = [...newPromotionSelected, promotionDiscount(promotions[idx])];
    } else {
      newPromotionSelected = prevPromotionSelect.filter((item) => item.id !== e.target.value);
    }
    setPrevPromotionSelect(newPromotionSelected);
  };

  const promotionDiscount = (promotion: Partial<PromotionType>) => {
    let promotionClone = { discount_percent: 0, total_after_discount: 0, ...promotion };
    const discount_amount = countPromotionDiscount(promotionClone, total_variant_actual);
    promotionClone.discount_amount = discount_amount;
    promotionClone.selected = true;
    return promotionClone;
  };

  const handleShowListPromotion = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const { total_variant_quantity = 0 } = payment || {};
    if (total_variant_quantity) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (anchorEl) {
      setPrevPromotionSelect(promotionSelected);
    }
  }, [anchorEl, promotionSelected]);

  return (
    <Grid
      container
      display="flex"
      alignItems={promotionSelected.length ? "flex-start" : "center"}
      spacing={1}
    >
      <Grid item xs={6}>
        <FormDialog
          open={Boolean(anchorEl)}
          onClose={handleClose}
          title="Danh sách khuyến mãi"
          buttonText="Xong"
          maxWidth="md"
          onSubmit={() => {
            setAnchorEl(null);
            onChangePromotion(prevPromotionSelect);
          }}
          contentStyle={{ maxHeight: 500 }}
        >
          <OrderPromotions
            sx={{ minWidth: 300 }}
            promotions={promotions}
            total_variant_actual={total_variant_actual}
            loading={loading}
            handleSelectedPromotion={handleSelectedPromotion}
            promotionsSelected={prevPromotionSelect}
          />
        </FormDialog>
        <Typography
          onClick={handleShowListPromotion}
          sx={
            isEdit
              ? { cursor: "pointer", color: "secondary.main" }
              : { pointerEvents: "none", color: "#637381" }
          }
          style={{ fontSize: 14, fontWeight: "600" }}
        >
          {`Khuyến mãi đơn hàng >>>`}
        </Typography>
        {map(promotionSelected, (item, index) => (
          <Stack key={index} sx={{ mt: 0.5, mr: 0.5 }}>
            <Tooltip title={item?.note || ""}>
              <Chip
                label={item.note}
                sx={{
                  display: "inline-flex",
                  maxWidth: "100%",
                  span: { textAlign: "start", width: "100%" },
                }}
                onDelete={isEdit ? () => handleRemoveDiscount(index) : undefined}
                deleteIcon={<DeleteIcon />}
                variant="outlined"
                size="small"
                color="success"
              />
            </Tooltip>
          </Stack>
        ))}
      </Grid>
      <Grid item xs={6}>
        <Stack
          width="100%"
          style={{ alignItems: "flex-end", paddingTop: promotionSelected.length ? 24 : 0 }}
        >
          {map(promotionSelected, (item, index) => (
            <TextInfo my={0.5} key={index}>
              {fValueVnd(item.discount_amount || 0)}
            </TextInfo>
          ))}
          <LabelInfo my={0.5} fontSize={15}>
            Tổng KM: {fValueVnd(discount_promotion)}
          </LabelInfo>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default DiscountPromotion;
