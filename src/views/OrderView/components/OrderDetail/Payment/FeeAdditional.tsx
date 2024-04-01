import Grid from "@mui/material/Grid";
import { LabelInfo, TextInfo } from "components/Labels";
import { InputNumber } from "components/Fields";

//utils
import { fValueVnd } from "utils/formatNumber";

const FeeAdditional = ({
  fee_additional,
  handleChangeAdditionFee,
  isEdit,
}: {
  isEdit?: boolean;
  fee_additional: number;
  handleChangeAdditionFee: (value: number) => void;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>Phụ thu</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <InputNumber
            containerStyles={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
            value={fee_additional}
            onChange={handleChangeAdditionFee}
            type="currency"
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {fValueVnd(fee_additional)}
          </TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default FeeAdditional;
