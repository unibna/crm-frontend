import Grid from "@mui/material/Grid";
import Tags from "./Tags";

const AttributeView = () => {
  return (
    <Grid container sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }}>
      <Grid xs={12} md={6} item>
        <Tags />
      </Grid>
    </Grid>
  );
};

export default AttributeView;
