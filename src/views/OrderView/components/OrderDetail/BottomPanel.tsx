import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import vi from "locales/vi.json";

export interface BottomPanelProps {
  onClose?: () => void;
  id?: string;
  loading?: boolean;
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  orderKey?: string;
  submitDisabled?: boolean;
}

const BottomPanel = ({
  onClose,
  loading,
  onSubmit,
  id,
  submitDisabled,
  orderKey,
}: BottomPanelProps) => {
  const labelSubmitButton =
    orderKey === vi.duplidate ? "Tạo đơn" : !!id ? "Cập nhật đơn" : "Tạo đơn";

  return (
    <DialogActions style={{ padding: 12 }}>
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        {onClose && (
          <Button sx={{ color: "primary.main" }} onClick={onClose}>
            {vi.button.close}
          </Button>
        )}
        {/* {!isShowSubmitButton ? null : ( */}
        <LoadingButton
          variant="contained"
          disabled={submitDisabled}
          loading={loading}
          onClick={onSubmit}
        >
          {labelSubmitButton}
        </LoadingButton>
        {/* )} */}
      </Stack>
    </DialogActions>
  );
};

export default BottomPanel;
