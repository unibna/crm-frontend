// Components
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

// ------------------------------------------------------------

const SkeletonInfo = () => {
  return (
    <>
      <Skeleton variant="rectangular" sx={{ height: 200, width: "100%", borderRadius: 2 }} />
      <Box sx={{ display: "flex", mt: 1.5 }}>
        <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
        <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
      </Box>
    </>
  );
};

export default SkeletonInfo;
