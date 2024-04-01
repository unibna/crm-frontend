// Components
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

// ------------------------------------------------------

const SkeletonVariant = () => {
  return (
    <Card sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2} sx={{ p: 3 }}>
        <Skeleton variant="rectangular" sx={{ paddingTop: "30%", width: "30%" }} />
        <Stack spacing={2} sx={{ p: 1 }}>
          <Skeleton variant="text" sx={{width: 200}} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row">
              <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
              <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
              <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
            </Stack>
            <Skeleton variant="text" sx={{ width: 40 }} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default SkeletonVariant;
