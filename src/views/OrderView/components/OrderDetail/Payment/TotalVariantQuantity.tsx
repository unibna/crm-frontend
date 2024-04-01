//components
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { LabelInfo, TextInfo } from "components/Labels";

//utils
import { fValueVnd } from "utils/formatNumber";

const TotalVariantQuantity = ({
  total_variant_actual,
  total_variant_all,
  total_variant_quantity,
}: {
  total_variant_quantity: number;
  total_variant_all: number;
  total_variant_actual: number;
}) => {
  return (
    <Grid ml={0} container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>Tiền hàng {total_variant_quantity} sản phẩm</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="row" alignItems="center" justifyContent={"flex-end"}>
          {total_variant_all !== total_variant_actual && (
            <TextInfo
              sx={{
                fontWeight: 400,
                fontSize: 13,
                textDecoration: "line-through",
                marginRight: 1,
              }}
            >
              {fValueVnd(total_variant_all)}
            </TextInfo>
          )}
          <TextInfo sx={{ fontWeight: 700 }}>{fValueVnd(total_variant_actual)}</TextInfo>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TotalVariantQuantity;
