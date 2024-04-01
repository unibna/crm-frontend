// Components
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

// ------------------------------------------------------

const SkeletonRecent = () => {
  return (
    <Card sx={{ width: "100%" }}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Skeleton variant="text" sx={{ width: "100%" }} />
        {[...Array(6)].map((item, index) => (
          <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Skeleton variant="text" sx={{ width: 70 }} />
              <Skeleton variant="text" sx={{ width: 40 }} />
            </Stack>
            <Skeleton variant="text" sx={{ width: 40 }} />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export default SkeletonRecent;
