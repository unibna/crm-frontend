//components
import Grid from "@mui/material/Grid";
import Tags from "./Tags";

//utils
import { styled } from "@mui/material";
import CancelReason from "./CancelReason";

const Attribute = () => {
  return (
    <ViewWrap container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      <Grid xs={12} md={6} item>
        <Tags />
      </Grid>
      <Grid xs={12} md={6} item>
        <CancelReason />
      </Grid>
    </ViewWrap>
  );
};

export default Attribute;

const ViewWrap = styled(Grid)``;
