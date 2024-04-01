//components
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";

//icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Props {
  onClose?: () => void;
  id?: string;
  title: string;
  isPage?: boolean;
}

const HeaderPanel = ({ onClose, title, isPage }: Props) => {
  return (
    <DialogTitle style={{ padding: "8px 24px", display: "flex", justifyContent: "space-between" }}>
      <Stack direction="row" alignItems="center">
        {onClose && (
          <IconButton onClick={onClose} style={{ marginRight: 8 }}>
            <ChevronRightIcon />
          </IconButton>
        )}
        <Title>{title}</Title>
      </Stack>
      {!isPage && (
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export default HeaderPanel;

const Title = styled(Typography)(() => ({
  fontWeight: 700,
  lineHeight: 1.55556,
  fontSize: "1.2rem",
}));
