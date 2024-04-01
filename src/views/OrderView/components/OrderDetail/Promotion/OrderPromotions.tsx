//types
import { PromotionType } from "_types_/PromotionType";

//components
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Theme, SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { NoDataPanel } from "components/DDataGrid/components";
import PromotionItem from "views/PromotionView/components/PromotionItem";

//utils
import map from "lodash/map";

//types
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

export const OrderPromotions = ({
  total_variant_actual = 0,
  product,
  sx,
  loading,
  promotions,
  handleSelectedPromotion,
  promotionsSelected,
}: {
  total_variant_actual?: number; // dành cho đơn hàng
  product?: AttributeVariant;
  sx?: SxProps<Theme>;
  loading?: boolean;
  promotions: PromotionType[];
  promotionsSelected?: Partial<PromotionType>[];
  handleSelectedPromotion: (e: React.SyntheticEvent<Element, Event>, idx: number) => void;
}) => {
  const {} = product || {};

  return loading ? (
    <Box p={1}>
      <LoadingSkeleton />
    </Box>
  ) : promotions.length <= 0 ? (
    <Box
      sx={{
        display: "flex",
        minWidth: 200,
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
      }}
    >
      <NoDataPanel />
    </Box>
  ) : (
    <FormControl sx={{ padding: 1.5, pl: 3, width: "100%", ...sx }}>
      {promotions.map((item, idx) => {
        const amountRequirement = item?.requirements.find(
          (pr) => pr.requirement_type === "TOTAL_BILL"
        );
        const quantityRequirement = item?.requirements.find(
          (pr) => pr.requirement_type === "QUANTITY_MIN"
        );

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

        const activeStatus = item.status === "ACTIVED";
        const selected = !!promotionsSelected?.find(
          (pro) => pro.id?.toString() === item.id?.toString()
        );

        return (
          <FormControlLabel
            sx={{
              width: "100%",
              "& > .MuiTypography-root": { width: "100%" },
              alignItems: "flex-start",
            }}
            style={{ marginBottom: 8, marginTop: 8 }}
            key={item.id + item.name}
            value={item.id?.toString()}
            control={<Checkbox checked={selected} />}
            onChange={(e) => handleSelectedPromotion(e, idx)}
            disabled={(!isMatchAmountPromotion || !isMatchQuantityPromotion) && activeStatus}
            label={
              <>
                <PromotionItem
                  product={product}
                  promotion={item}
                  sx={{ padding: 0 }}
                  total_variant_actual={total_variant_actual}
                  selected={selected}
                />
              </>
            }
          />
        );
      })}
    </FormControl>
  );
};

export default OrderPromotions;
