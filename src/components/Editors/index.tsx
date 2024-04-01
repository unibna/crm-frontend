import { ReactNode } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";

// @mui
import { styled } from "@mui/material/styles";
import { SxProps, Theme, Box } from "@mui/material";
//
import EditorToolbar, { formats, redoChange, undoChange } from "components/Editors/EditorToolbar";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
  "& .ql-container.ql-snow": {
    borderColor: "transparent",
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  "& .ql-editor": {
    minHeight: 150,
    "&.ql-blank::before": {
      fontStyle: "normal",
      color: theme.palette.text.disabled,
    },
    "& pre.ql-syntax": {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

// ----------------------------------------------------------------------

export interface Props extends ReactQuillProps {
  id?: string;
  error?: boolean;
  simple?: boolean;
  isShowEditor?: boolean;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function Editor({
  id = "minimal-quill",
  error,
  value,
  onChange,
  simple = false,
  isShowEditor = true,
  helperText,
  placeholder = "Mô tả...",
  sx,
  ...other
}: Props) {
  const modules = {
    toolbar: {
      container: `#${id}`,
      handlers: { undo: undoChange, redo: redoChange },
    },
    history: { delay: 500, maxStack: 100, userOnly: true },
    syntax: true,
    clipboard: { matchVisual: false },
  };

  return (
    <div>
      <RootStyle
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        {isShowEditor && <EditorToolbar id={id} isSimple={simple} />}
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          {...other}
        />
      </RootStyle>

      {helperText && helperText}
    </div>
  );
}
