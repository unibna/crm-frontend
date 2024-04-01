import React from "react";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import { useTheme, styled } from "@mui/material";

interface Props {
  handleDropFile: (files: any[]) => void;
  sizeSuggest?: string;
  width?: number | string;
  height?: number | string;
  multiple?: boolean;
  iconSize?: number;
}

let dragCounter = 0;
const DragAndDropImagePanel = ({
  handleDropFile,
  sizeSuggest,
  width,
  height,
  multiple,
  iconSize,
}: Props) => {
  const theme = useTheme();
  const dropRef = React.createRef();

  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    let div = dropRef.current as any;
    dragCounter = 0;
    div?.addEventListener("dragenter", handleDragIn);
    div?.addEventListener("dragleave", handleDragOut);
    div?.addEventListener("dragover", handleDrag);
    div?.addEventListener("drop", handleDrop);
    return () => {
      div?.removeEventListener("dragenter", handleDragIn);
      div?.removeEventListener("dragleave", handleDragOut);
      div?.removeEventListener("dragover", handleDrag);
      div?.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter > 0) return;
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDropFile(e.dataTransfer.files);
      e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  return (
    <Paper
      className="drag-drop-panel"
      style={{
        position: "relative",
        width: width || 200,
        height: height || 200,
        border: dragging ? "dashed grey 4px" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? dragging
              ? "grey.600"
              : "grey.700"
            : dragging
            ? "#e6e6e6"
            : "#f2f2f2",
      }}
      ref={dropRef as any}
      elevation={2}
    >
      <Typography sx={{ fontSize: 13, textAlign: "center" }}>Kéo thả hình ảnh vào đây</Typography>
      <CloudUploadIcon
        style={{
          fontSize: iconSize || 72,
          color: theme.palette.mode === "dark" ? "#1b1b1b" : "#fff",
        }}
      />
      <label htmlFor="button-choose-file-upload">
        <Input
          accept="image/*"
          id="button-choose-file-upload"
          type="file"
          multiple={multiple}
          onChange={(e: any) => e.target.files?.length > 0 && handleDropFile(e.target.files)}
        />
        {dragging ? (
          <label>Thả vào đây</label>
        ) : (
          <Typography sx={{ color: "primary.main", cursor: "pointer", fontSize: 14 }}>
            Chọn tập tin
          </Typography>
        )}
      </label>
      <Typography sx={{ fontSize: 13, color: "info.main" }}>{sizeSuggest}</Typography>
    </Paper>
  );
};

export default DragAndDropImagePanel;

const Input = styled("input")`
  display: none;
`;
