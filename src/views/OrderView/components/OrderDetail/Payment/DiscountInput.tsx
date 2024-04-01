//types
import { FieldErrors } from "react-hook-form";
import { OrderFormType } from "_types_/OrderType";

//components
import Grid from "@mui/material/Grid";
import { LabelInfo, TextInfo } from "components/Labels";
import { InputNumber } from "components/Fields";

//utils
import { fValueVnd } from "utils/formatNumber";

const DiscountInput = ({
  discount_input,
  errors,
  handleChangeDiscount,
  isEdit,
}: {
  isEdit?: boolean;
  discount_input: number;
  handleChangeDiscount: (value: number) => void;
  errors: FieldErrors<OrderFormType>;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>Giảm giá</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <InputNumber
            value={discount_input}
            onChange={handleChangeDiscount}
            type="currency"
            error={!!errors?.payment?.discount_input_validate}
            helperText={errors?.payment?.discount_input_validate?.message}
            containerStyles={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {fValueVnd(discount_input)}
          </TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default DiscountInput;
