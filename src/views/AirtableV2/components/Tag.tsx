import { Avatar, Box, SxProps, Theme, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextLink from "./TextLink";

type TagProps = {
  label: any;
  color?: string;
  image?: string;
  isShowImage?: boolean;
  isShowEdit?: boolean;
  sx?: SxProps<Theme>;
  onDelete?: () => void;
  onClick?: () => void;
};
function Tag({ label, color, image, isShowImage, isShowEdit, sx, onClick, onDelete }: TagProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: color || "#eee",
        fontSize: 10,
        py: 0.5,
        px: !!isShowImage ? 0.5 : 1,
        pr: 1,
        borderRadius: "24px",
        fontWeight: 600,
        width: "fit-content",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "fit-content",
        ...sx,
      }}
      onClick={onClick}
    >
      {isShowImage && (
        <Avatar
          src={image}
          alt={typeof label === "string" ? label : ""}
          sx={{ width: 24, height: 24, borderRadius: "50%", mr: "4px" }}
        />
      )}
      {typeof label === "string" ? (
        <TextLink
          content={label}
          sx={{
            ...(theme.palette.mode === "dark" && {
              color: theme.palette.common.black,
            }),
          }}
        />
      ) : (
        label
      )}

      {isShowEdit && (
        <CloseIcon
          onMouseDown={onDelete}
          sx={{
            ml: 1,
            fontSize: "1rem",
            opacity: 0.5,
            "&:hover": {
              opacity: 1,
            },
          }}
        />
      )}
    </Box>
  );
}

export default Tag;
