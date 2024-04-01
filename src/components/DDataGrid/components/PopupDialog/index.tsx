// Libraries
import { useState } from "react";

// Components
import TextField from "@mui/material/TextField";
import FormDialog from "components/Dialogs/FormDialog";
import FormControl from "@mui/material/FormControl";
interface Props {
  isOpen: boolean;
  title?: string;
  label?: string;
  buttonText?: string;
  handleClose: () => void;
  handleSubmit: (value: string) => void;
}

const PopupDialog = (props: Props) => {
  const {
    title,
    isOpen,
    label = "attribute",
    buttonText = "add_new",
    handleClose,
    handleSubmit,
  } = props;

  const [value, setValue] = useState("");

  const onSubmitAttribute = () => {
    if (value) {
      handleSubmit(value);
    }
  };

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      onSubmitAttribute();
    }
  };

  return (
    <FormDialog
      title={title}
      buttonText={buttonText}
      maxWidth="md"
      onClose={handleClose}
      onSubmit={onSubmitAttribute}
      open={isOpen}
    >
      <FormControl fullWidth>
        <TextField
          autoFocus
          size="small"
          id="outlined-error-attribute"
          variant="outlined"
          label={`${label}*`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </FormControl>
    </FormDialog>
  );
};

export default PopupDialog;
