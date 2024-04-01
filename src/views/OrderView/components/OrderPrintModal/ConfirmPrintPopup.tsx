import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React from "react";

interface Props {
  open: boolean;
  onClose: any;
  onConfirm: any;
  onCancel: any;
  loading?: boolean;
  isExportAfterPrint: boolean;
  setIsExportAfterPrint: any;
}

const ConfirmPrintPopup = (props: Props) => {
  const { open, onClose, onConfirm, onCancel, loading, isExportAfterPrint } = props;

  const handleChangeSwitch = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    props.setIsExportAfterPrint(checked);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogContent
        dividers
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          px: 5,
        }}
      >
        <HelpOutlineIcon sx={{ width: "60px", height: "auto", color: "primary.main" }} />
        <DialogTitle sx={{ textAlign: "center" }}>{"Xác nhận in đơn"}</DialogTitle>
        <DialogContentText>{"Xác nhận in đơn thành công"}</DialogContentText>
        {props.setIsExportAfterPrint && (
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Switch
                checked={isExportAfterPrint}
                onChange={handleChangeSwitch}
                name="Export File"
              />
            }
            label="Tuỳ chọn xuất file"
          />
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={onCancel} disabled={loading}>
          Huỷ
        </Button>
        <Button onClick={onConfirm} disabled={loading} variant="contained">
          {loading && (
            <CircularProgress style={{ width: 16, height: 16, marginRight: 8 }} color="inherit" />
          )}
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPrintPopup;
