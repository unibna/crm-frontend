// Libraries
import { styled } from "@mui/material";

// Components
import Typography from "@mui/material/Typography";
import FormDialog from "components/Dialogs/FormDialog";
import FormControl from "@mui/material/FormControl";

interface Props {
  isOpen: boolean;
  title?: string;
  buttonText?: string;
  messagePopup?: string;
  handleClose: () => void;
  handleSubmit: () => void;
}

const BodyPageWrap = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const PopupMessage = (props: Props) => {
  const { title, isOpen, buttonText = "add_new", messagePopup, handleClose, handleSubmit } = props;

  return (
    <FormDialog
      title={title}
      buttonText={buttonText}
      maxWidth="md"
      onClose={handleClose}
      onSubmit={handleSubmit}
      open={isOpen}
    >
      <FormControl fullWidth>
        <BodyPageWrap>
          <Typography variant="h5">{messagePopup}</Typography>
          <Typography variant="h6">Bạn chắc chắn muốn muốn điều này</Typography>
        </BodyPageWrap>
      </FormControl>
    </FormDialog>
  );
};

export default PopupMessage;
