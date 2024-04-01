// Types
import { STATUS, TEMPLATE_QUALITY, TEMPLATE_TAG, TemplateItemType } from "_types_/ZaloType";

// Components
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Span } from "components/Labels";
import Image from "components/Images/Image";

// Assets
import noImageAvailable from "assets/images/no_image_available.jpg";

// Constants & Utils
import { fDateTime } from "utils/dateUtil";

// ----------------------------------------------------------------------

const TemplateItem = ({
  item,
  avatar,
  setValue,
}: { item: TemplateItemType; avatar: string } | any) => {
  const {
    status,
    template_name,
    created,
    template_id,
    template_quality,
    price,
    template_tag,
    preview_url,
  } = item;

  const formatColor = (value: string) => {
    switch (value) {
      case TEMPLATE_QUALITY.HIGH: {
        return "success";
      }
      case TEMPLATE_QUALITY.LOW: {
        return "secondary";
      }
      case TEMPLATE_QUALITY.MEDIUM: {
        return "warning";
      }
      case TEMPLATE_QUALITY.UNDEFINED: {
        return "default";
      }
      case STATUS.ENABLE: {
        return "success";
      }
      case STATUS.DISABLE: {
        return "default";
      }
      case STATUS.DELETE: {
        return "secondary";
      }
      case STATUS.PENDING_REVIEW: {
        return "warning";
      }
      case STATUS.REJECT: {
        return "error";
      }
      case TEMPLATE_TAG.ACCOUNT_UPDATE: {
        return "primary";
      }
      case TEMPLATE_TAG.GENERAL_UPDATE: {
        return "info";
      }
      case TEMPLATE_TAG.IN_TRANSACTION: {
        return "success";
      }
      case TEMPLATE_TAG.OTP: {
        return "warning";
      }
      case TEMPLATE_TAG.POST_TRANSACTION: {
        return "secondary";
      }
      case TEMPLATE_TAG.DEFAULT: {
        return "default";
      }
      default: {
        return "info";
      }
    }
  };

  return (
    <Paper sx={{ borderRadius: 2, bgcolor: "background.neutral" }}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt="Oa" src={avatar} />

          <div>
            <Typography variant="subtitle2">{template_name}</Typography>

            <Typography
              variant="caption"
              sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
            >
              {fDateTime(created)}
            </Typography>
          </div>
        </Stack>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={1}
          rowSpacing={4}
          sx={{ color: "text.secondary" }}
        >
          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">Giá:</Typography>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {price ? `${price} đ` : ""}
            </Typography>
          </Grid>

          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">ID:</Typography>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {template_id}
            </Typography>
          </Grid>

          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">
              Chất lượng
              {template_quality ? (
                <Span
                  variant="filled"
                  color={formatColor(template_quality)}
                  sx={{
                    right: 16,
                    ml: 1,
                    zIndex: 9,
                    bottom: 16,
                    textTransform: "capitalize",
                  }}
                >
                  {template_quality}
                </Span>
              ) : null}
            </Typography>
          </Grid>

          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">
              Tag
              {template_tag ? (
                <Span
                  variant="filled"
                  color={formatColor(template_tag)}
                  sx={{
                    right: 16,
                    ml: 1,
                    zIndex: 9,
                    bottom: 16,
                    textTransform: "capitalize",
                  }}
                >
                  {template_tag}
                </Span>
              ) : null}
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      <Box sx={{ p: 1, position: "relative" }}>
        <Span
          variant="filled"
          color={formatColor(status)}
          sx={{
            left: 16,
            zIndex: 9,
            bottom: 16,
            position: "absolute",
            textTransform: "capitalize",
          }}
        >
          {status}
        </Span>

        {preview_url ? (
          <iframe
            width="100%"
            height={450}
            frameBorder={0}
            src={preview_url}
            style={{ borderRadius: 12 }}
          />
        ) : (
          <Image src={noImageAvailable} sx={{ borderRadius: 1.5, height: 450 }} />
        )}
      </Box>
    </Paper>
  );
};

export default TemplateItem;
