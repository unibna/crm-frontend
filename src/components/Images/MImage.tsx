import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import RotateLeft from "@mui/icons-material/RotateLeft";
import RotateRight from "@mui/icons-material/RotateRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import defaultImage from "assets/images/icon-logo.png";
import React from "react";

interface Props {
  id?: string;
  src?: string;
  preview?: boolean;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  contentImage?: JSX.Element;
  onDelete?: ({ id, src }: { id?: string; src?: string }) => void;
  wrapImageSX?: SxProps<Theme>;
}

const MImage = ({
  id,
  src,
  preview,
  width = 50,
  height = 50,
  style,
  contentImage,
  wrapImageSX,
  onDelete,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [effect, setEffect] = React.useState({ rotate: 0, scale: 1 });

  const handleClickOpen = (e: any) => {
    setOpen(true);
    e.stopPropagation();
  };

  const handleClose = (e: any) => {
    setOpen(false);
    e.stopPropagation();
  };

  window.onscroll = (e) => {};

  return (
    <>
      {preview && (
        <Dialog
          onClose={handleClose}
          open={open}
          sx={{
            ".MuiPaper-root": {
              overflow: "unset",
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            zIndex: "1303 !important",
          }}
        >
          {open && (
            <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
              <IconButton
                onClick={() => setEffect((prev) => ({ ...prev, rotate: prev.rotate - 90 }))}
              >
                <RotateLeft />
              </IconButton>
              <IconButton
                onClick={() => setEffect((prev) => ({ ...prev, rotate: prev.rotate + 90 }))}
              >
                <RotateRight />
              </IconButton>
              <IconButton
                onClick={() => setEffect((prev) => ({ ...prev, scale: prev.scale + 0.2 }))}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  setEffect((prev) => ({
                    ...prev,
                    scale: prev.scale <= 1 ? 1 : prev.scale - 0.2,
                  }))
                }
              >
                <ZoomOutIcon />
              </IconButton>
            </div>
          )}
          <DialogContent
            sx={{
              borderRadius: "0px !important",
              transform: `rotate(${effect.rotate}deg) scale(${effect.scale})`,
              padding: 0,
            }}
          >
            <img src={src} style={{ scale: effect.scale }} alt="" />
          </DialogContent>
        </Dialog>
      )}
      <Stack
        className="relative mimg"
        style={{ position: "relative", display: "flex", flexShrink: 0 }}
        sx={{ width: [0, 0, width], m: [0, 0, 1], ...wrapImageSX }}
      >
        {onDelete && src && (
          <DoDisturbOnIcon
            onClick={() => onDelete?.({ id, src })}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              fontSize: 15,
              cursor: "pointer",
            }}
            sx={{ color: "error.main" }}
          />
        )}
        {contentImage ? (
          <Box onClick={handleClickOpen} sx={{ cursor: "pointer" }}>
            {contentImage}
          </Box>
        ) : src ? (
          <img
            style={{
              height,
              width,
              borderRadius: 8,
              margin: 4,
              cursor: preview ? "pointer" : "unset",
              ...style,
            }}
            src={src}
            onClick={handleClickOpen}
            alt=""
          />
        ) : (
          <img
            src={defaultImage}
            style={{
              filter: "grayscale(100%)",
              width: width || 50,
              height: height || 50,
              margin: 4,
              borderRadius: 8,
            }}
          />
        )}
      </Stack>
    </>
  );
};

export default MImage;
