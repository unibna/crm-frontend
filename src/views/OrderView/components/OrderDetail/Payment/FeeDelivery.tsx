import Grid from "@mui/material/Grid";
import { LabelInfo, TextInfo } from "components/Labels";
import { InputNumber } from "components/Fields";

//utils
import { fValueVnd } from "utils/formatNumber";

const FeeDelivery = ({
  fee_delivery,
  handleChangeShippingFee,
  isEdit,
}: {
  isEdit?: boolean;
  fee_delivery: number;
  handleChangeShippingFee: (value: number) => void;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>Phí giao hàng</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <InputNumber
            containerStyles={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
            value={fee_delivery}
            onChange={handleChangeShippingFee}
            type="currency"
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {fValueVnd(fee_delivery)}
          </TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default FeeDelivery;
