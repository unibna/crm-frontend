import { ArrowBackIos } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { TypeWarehouseSheet } from "_types_/WarehouseType";
import { SlideTransition } from "components/Transisitions";
import vi from "locales/vi.json";
import ScanOption from "./ScanOption";

interface Props {
  open: boolean;
  handleClose: any;
  type: TypeWarehouseSheet.IMPORTS | TypeWarehouseSheet.EXPORTS;
}
function ScanModal(props: Props) {
  const { open, handleClose, type } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      TransitionComponent={SlideTransition}
      keepMounted
      onClose={handleClose}
      // fullScreen={fullScreen}
      fullScreen
      maxWidth="lg"
      sx={{
        [theme.breakpoints.down("lg")]: {
          "& .MuiDialog-paper": {
            m: 0,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          p: 0,
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "max-content",
            height: "100%",
            color: theme.palette.primary.contrastText,
            pl: 3,
          }}
          onClick={handleClose}
        >
          <ArrowBackIos sx={{ fontSize: "1.5rem" }} />
        </IconButton>
        <Typography sx={{ ...styles.title, color: theme.palette.primary.contrastText }}>
          {type === TypeWarehouseSheet.IMPORTS ? vi.scan_import : vi.scan_export}
        </Typography>
      </DialogTitle>
      <ScanOption open={open} handleClose={handleClose} type={type} />
    </Dialog>
  );
}

export default ScanModal;

const styles: any = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "350px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    width: "100%",
    fontWeight: 700,
    fontSize: "1.2rem",
    textAlign: "center",
    py: 3,
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    textTransform: "uppercase",
  },
  button: {
    borderRadius: 8,
    width: "50%",
    fontSize: "1.2rem",
    py: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
