import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import BlockContent from "./BlockContent";
import RejectionFiles from "./RejectionFiles";
import MultiFilePreview from "./MultiFilePreview";
import LoadingModal from "components/Loadings/LoadingModal";
import { UploadMultiFileProps } from "_types_/FileType";
// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ----------------------------------------------------------------------

export default function UploadMultiFile({
  error,
  showPreview = false,
  isLoadingBackground = false,
  isMultiple = true,
  files,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  ...other
}: UploadMultiFileProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: isMultiple,
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Box sx={{ position: "relative" }}>
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: "error.main",
              borderColor: "error.light",
              bgcolor: "error.lighter",
            }),
            position: "relative",
          }}
        >
          <input {...getInputProps()} />

          <BlockContent />
        </DropZoneStyle>
        {isLoadingBackground && <LoadingModal />}
      </Box>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      <MultiFilePreview
        files={files}
        showPreview={showPreview}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onClickUpload={getRootProps().onClick}
      />

      {helperText}
    </Box>
  );
}
