// @mui
import { Box, Typography, Stack } from "@mui/material";
// assets
import UploadIllustration from "assets/illustrations/illustration_upload";

// ----------------------------------------------------------------------

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", md: "row" }}
      sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Kéo thả hoặc chọn tải lên hình ảnh
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          File định dạng hình ảnh, có dung lượng nhỏ hơn 2MB, với kích thước 500x500 pixels
        </Typography>
      </Box>
    </Stack>
  );
}
