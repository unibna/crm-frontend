import CloseIcon from "@mui/icons-material/Close";
import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { GridSizeType } from "_types_/GridLayoutType";
import { MButton } from "components/Buttons";
import { SlideTransition } from "components/Transisitions";
import React from "react";

// -------------------------------------------------------

export const idContentFormModal = "wrap-content-dialog";
export interface FormDialogProps {
  title?: string;
  sizeTitle?: any;
  subTitle?: string;
  open: boolean;
  buttonText?: string;
  isShowFooter?: boolean;
  isLoadingButton?: boolean;
  disabledSubmit?: boolean;
  zIndex?: number;
  children?: React.ReactNode;
  maxWidth?: GridSizeType;
  onSubmit?: (e: any) => void;
  onClose?: () => void;
  sx?: SxProps<Theme>;
  fullScreen?: boolean;
  transition?: boolean;
  component?: React.ElementType<any>;
  enableCloseByDropClick?: boolean;
  contentStyle?: React.CSSProperties;
}

const FormDialog = ({
  fullScreen,
  buttonText,
  children,
  isLoadingButton = false,
  isShowFooter = true,
  zIndex = 1200,
  maxWidth,
  onClose,
  onSubmit,
  disabledSubmit,
  open,
  title,
  subTitle,
  transition,
  sx,
  component = "form",
  enableCloseByDropClick,
  contentStyle,
}: FormDialogProps) => {
  const handleClose = (_: any, reason: string) => {
    if (reason === "backdropClick" && !enableCloseByDropClick) {
      return;
    }
    onClose && onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth
      onClose={handleClose}
      disableEscapeKeyDown
      fullScreen={fullScreen}
      TransitionComponent={transition ? SlideTransition : undefined}
      style={{ zIndex }}
      sx={sx}
    >
      {title && (
        <>
          <DialogTitle style={headerDialogStyle}>
            <DialogHeader>
              <Typography variant={"h4"}> {title} </Typography>
              {onClose && <CloseIconWrap onClick={onClose} />}
            </DialogHeader>

            <Typography fontSize={13} fontWeight={400}>
              {subTitle}
            </Typography>
          </DialogTitle>
          <Divider />
        </>
      )}

      <DialogContent
        id={idContentFormModal}
        sx={{ paddingX: [1, 2, 3], py: [2, 3] }}
        style={contentStyle}
      >
        <Box component={component} onSubmit={onSubmit}>
          {children}
        </Box>
      </DialogContent>

      <Divider />

      {isShowFooter ? (
        <DialogBottom style={footerDialogStyle}>
          {onClose && (
            <MButton variant="outlined" onClick={onClose} color="primary" sx={{ mr: 1 }}>
              Hủy
            </MButton>
          )}
          {buttonText && (
            <Stack direction="row" alignItems="center">
              <MButton onClick={onSubmit} disabled={isLoadingButton || disabledSubmit}>
                {buttonText}
              </MButton>
              {isLoadingButton && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Stack>
          )}
        </DialogBottom>
      ) : null}
    </Dialog>
  );
};

export default FormDialog;

const CloseIconWrap = styled(CloseIcon)({
  fontSize: 25,
  color: "#595959",
  cursor: "pointer",
});

const DialogHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

const DialogBottom = styled(DialogActions)({
  marginRight: 25,
});

const footerDialogStyle = { padding: "20px 16px" };
const headerDialogStyle = { paddingBottom: 8 };
