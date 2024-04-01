import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingObjectBackdrop({ loading }: { loading: boolean }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        position: "absolute",
      }}
      open={loading}
    >
      <CircularProgress sx={{ color: "primary.main" }} />
    </Backdrop>
  );
}
