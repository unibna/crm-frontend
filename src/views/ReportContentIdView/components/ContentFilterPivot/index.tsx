// Libraries
import { map, reduce, xor } from "lodash";
import { useMemo } from "react";

// Components
import { Divider, Grid, Typography, useTheme } from "@mui/material";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import { Span } from "components/Labels";

// Constants
import { arrRenderFilterDateDefault } from "constants/index";

const ContentFilter = ({
  params,
  columns,
  columnSelected,
  handleParams,
  handleSelect,
}: {
  params: Partial<any>;
  columns: {
    dimensions: string[];
    metrics: string[];
  };
  columnSelected: {
    dimensions: string[];
    metrics: string[];
  };
  handleParams: (params: Partial<any>) => void;
  handleSelect: (columns: Partial<any>) => void;
}) => {
  const theme = useTheme();
  const dataRenderHeader = [...arrRenderFilterDateDefault];

  return (
    <Grid container spacing={2}>
      <Grid item container>
        <HeaderFilter
          isShowPopupFilter={false}
          columns={{
            columnsShow: [],
            resultColumnsShow: [],
          }}
          params={params}
          dataRenderHeader={dataRenderHeader}
          handleFilter={handleParams}
        />
      </Grid>
      <Grid item container>
        <Divider sx={{ my: 2, width: "100%" }} />
      </Grid>
      <Grid item container spacing={3}>
        <Grid item container>
          <Grid item xs={1}>
            <Typography variant="body2">Dimension:</Typography>
          </Grid>
          <Grid item container xs={11} gap={1}>
            {map(columns.dimensions, (item) => (
              <Span
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={columnSelected.dimensions.includes(item) ? "success" : "default"}
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  handleSelect({
                    ...columnSelected,
                    dimensions: xor(columnSelected.dimensions, [item]),
                  })
                }
              >
                {item}
              </Span>
            ))}
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={1}>
            <Typography variant="body2">Metric:</Typography>
          </Grid>
          <Grid item container xs={11} gap={1}>
            {map(columns.metrics, (item) => (
              <Span
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={columnSelected.metrics.includes(item) ? "success" : "default"}
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  handleSelect({
                    ...columnSelected,
                    metrics: xor(columnSelected.metrics, [item]),
                  })
                }
              >
                {item}
              </Span>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContentFilter;
