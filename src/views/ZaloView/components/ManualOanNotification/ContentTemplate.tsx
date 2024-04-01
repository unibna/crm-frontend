// Libraries
import { UseFormReturn } from "react-hook-form";

// Components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FormValuesProps } from "components/Popups/FormPopup";
import Image from "components/Images/Image";
import Stack from "@mui/material/Stack";

// Assets
import imageNotFound from "assets/images/image_not_found.png";

// ---------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const ContentTemplateOan = (props: Props) => {
  const { watch } = props;
  const { image_url, subtitle, title, action_url } = watch();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ position: "relative" }}>
            <Image src={image_url || imageNotFound} ratio="16/9" />
          </Box>

          <Box sx={{ p: 2 }} rowGap={2}>
            <Typography variant="body1">{title}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center">
              <Image
                src="https://res.cloudinary.com/dq5k2muhe/image/upload/v1656648183/online-shop_qepqot.png"
                sx={{ width: 50, height: 50 }}
              />
              <Typography
                variant="body1"
                sx={{ ml: 2, cursor: "pointer" }}
                onClick={() => window.open(action_url, "_blank", "noopener,noreferrer")}
              >
                Đặt hàng ngay
              </Typography>
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center">
              <Image
                src="https://res.cloudinary.com/dq5k2muhe/image/upload/v1656648335/customer-service_1_okwedl.png"
                sx={{ width: 50, height: 50 }}
              />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Gặp tư vấn viên
              </Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ContentTemplateOan;
