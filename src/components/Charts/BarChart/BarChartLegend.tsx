import map from "lodash/map";
import { Box, Grid, Stack, Typography } from "@mui/material";

interface Props<T> {
  data: T[];
  itemComponent?: (item: T) => React.ReactNode;
}

const BarChartLegend = ({ data, itemComponent }: Props<any>) => {
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {map(data, (item, idx) => (
          <Grid key={idx} item xs={6} md={4} xl={3}>
            {itemComponent ? (
              itemComponent(item)
            ) : (
              <Stack direction="row" alignItems="center">
                <Box style={legendSpaceStyle} sx={{ backgroundColor: "primary.main" }} />
                <Typography style={legendLabelStyle}>{item}</Typography>
              </Stack>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BarChartLegend;

const legendSpaceStyle: React.CSSProperties = { width: 12, height: 12, borderRadius: 3, margin: 4 };
const legendLabelStyle: React.CSSProperties = { fontSize: 14 };
