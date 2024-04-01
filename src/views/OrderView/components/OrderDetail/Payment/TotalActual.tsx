import Grid from "@mui/material/Grid";
import { LabelInfo, TextInfo } from "components/Labels";

//utils
import { fValueVnd } from "utils/formatNumber";

const TotalActual = ({ total_actual, isEdit }: { total_actual: number; isEdit?: boolean }) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo sx={{ fontSize: "1.1rem", color: "inherit", textTransform: "uppercase" }}>
          Tổng đơn hàng
        </LabelInfo>
      </Grid>
      <Grid item xs={6}>
        <TextInfo
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            width: "100%",
            textAlign: "end",
          }}
        >
          {fValueVnd(total_actual)}
        </TextInfo>
      </Grid>
    </Grid>
  );
};

export default TotalActual;
