import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { forwardRef, useMemo } from "react";
import { DialogContent, Stack, alpha, useTheme, Typography } from "@mui/material";
import Image from "components/Images/Image";
import { isValidImageURL, isValidPdfURL } from "utils/helpers";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AttachmentReviewer {
  currentIndex: number;
  listFile: { url: string; id: string; file: string }[];
  setCurrentIndex: any;
  onDelete: any;
}

export default function AttachmentReviewer({
  currentIndex,
  listFile = [],
  setCurrentIndex,
  onDelete,
}: AttachmentReviewer) {
  const theme = useTheme();
  const handleClose = () => {
    setCurrentIndex(-1);
  };

  const fileName = useMemo(() => {
    const arr = listFile?.[currentIndex]?.file?.split("/");
    return arr?.[2];
  }, [listFile?.[currentIndex]]);

  return (
    <Dialog
      fullScreen
      open={currentIndex !== -1}
      onClose={handleClose}
      TransitionComponent={Transition}
      sx={{
        ".MuiDialog-paper": {
          background: alpha(theme.palette.common.black, 0.5),
        },
      }}
    >
      <Stack direction="row" display="flex" justifyContent="space-between" alignItems="center">
        <IconButton
          onClick={() => onDelete(listFile[currentIndex].id)}
          sx={{ color: theme.palette.common.white }}
        >
          <DeleteIcon />
        </IconButton>

        <Typography
          fontSize="small"
          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          color="white"
        >
          {fileName}
        </Typography>

        <IconButton onClick={handleClose} sx={{ color: theme.palette.common.white }}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <DialogContent sx={{ position: "relative" }}>
        <IconButton
          sx={{
            position: "absolute",
            left: 10,
            top: "calc(100vh / 2 - 48px)",
            zIndex: 2,
            color: theme.palette.common.white,
          }}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          <ArrowBackIosRoundedIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
        {!!((currentIndex || currentIndex === 0) && listFile?.[currentIndex]) && (
          <>
            {isValidImageURL(listFile[currentIndex]?.url) && (
              <Image
                src={listFile[currentIndex]?.url}
                alt={listFile[currentIndex]?.url}
                sx={{ height: "100%", width: "auto", "& img": { objectFit: "contain" } }}
              />
            )}
            {isValidPdfURL(listFile[currentIndex]?.url) && (
              <iframe
                src={`${listFile[currentIndex]?.url}`}
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            )}
          </>
        )}

        <IconButton
          sx={{
            position: "absolute",
            right: 10,
            top: "calc(100vh / 2 - 48px)",
            zIndex: 1,
            color: theme.palette.common.white,
          }}
          disabled={currentIndex === listFile.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          <ArrowForwardIosRoundedIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
}
