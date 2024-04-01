// Components
import Grid from "@mui/material/Grid";
import ZnsZalo from "./ZnsZalo";
import OrderZalo from "./OrderZalo";

// -------------------------------------------------------

const ZaloTable = ({ phone }: { phone: string }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <ZnsZalo phone={phone} />
      </Grid>
      <Grid item xs={12}>
        <OrderZalo phone={phone} />
      </Grid>
    </Grid>
  );
};

export default ZaloTable;
