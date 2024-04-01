// Libraries
import { useMemo, useState } from "react";
import map from "lodash/map";
import tail from "lodash/tail";
import { useTheme } from "@mui/material/styles";

// Components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MImage from "components/Images/MImage";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// ---------------------------------------------------

const ContentUserGroup = (option: { name: string; extra: Partial<any> }) => {
  return (
    <Box sx={{ py: 0.8 }}>
      <Chip
        label={getObjectPropSafely(() => option.name)}
        sx={{
          color: "#fff",
          backgroundColor:
            getObjectPropSafely(() => option.extra.color) || "#384550",
        }}
        className="ellipsis-label"
        size="small"
      />
    </Box>
  );
};

const ContentUser = (option: { image: { url: string }; name: string }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={4}>
      <Box>
        <MImage
          src={getObjectPropSafely(() => option.image.url)}
          preview
          style={{ borderRadius: "50%" }}
          contentImage={
            <Avatar
              alt={""}
              src={getObjectPropSafely(() => option.image.url)}
            />
          }
        />
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{ fontSize: 13, ml: 1 }}
          className="ellipsis-label"
        >
          {getObjectPropSafely(() => option.name)}
        </Typography>
      </Box>
    </Stack>
  );
};

const ColumnViewer = (props: any) => {
  const theme = useTheme();
  const { options = [] } = props;
  const [expanded, setExpanded] = useState(false);

  const dataCollapse = useMemo(() => {
    return tail(options);
  }, [options]);

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      <Grid item container xs={12}>
        {getObjectPropSafely(() => options[0].isGroup) ? (
          <ContentUserGroup {...options[0]} />
        ) : (
          <ContentUser {...options[0]} />
        )}
      </Grid>
      {dataCollapse.length ? (
        <Grid item container xs={12}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {map(dataCollapse, (option: any) => (
              <>
                {option.isGroup ? (
                  <ContentUserGroup {...option} />
                ) : (
                  <ContentUser {...option} />
                )}
              </>
            ))}
          </Collapse>
        </Grid>
      ) : null}
      <Grid item container xs={12}>
        {!expanded && dataCollapse.length ? (
          <Typography
            variant="caption"
            color={theme.palette.secondary.main}
            onClick={() => setExpanded(!expanded)}
            sx={{ cursor: "pointer" }}
          >
            {"Xem thêm"}
          </Typography>
        ) : null}
        {expanded && (
          <Typography
            variant="caption"
            color={theme.palette.secondary.main}
            onClick={() => setExpanded(!expanded)}
            sx={{ cursor: "pointer" }}
          >
            {"Thu gọn"}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ColumnViewer;
