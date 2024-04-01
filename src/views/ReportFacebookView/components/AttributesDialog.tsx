// Libraries
import { useState } from "react";

// Components
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormDialog from "components/Dialogs/FormDialog";

// Constants

interface Props {
  isOpen: boolean;
  title?: string;
  label?: string;
  buttonText?: string;
  handleClose: () => void;
  handleSubmit: (value: string) => void;
}

const AttributesDialog = (props: Props) => {
  const {
    isOpen,
    title,
    label = 'Thuộc tính',
    buttonText,
    handleClose,
    handleSubmit
  } = props;
  const [value, setValue] = useState('')

  const onSubmitAttribute = () => {
    if (value) {
      handleSubmit(value)
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
      maxWidth="sm"
      onClose={handleClose}
      onSubmit={onSubmitAttribute}
      open={isOpen}
    >
      <Box>
        <TextField
          autoFocus
          fullWidth
          size="medium"
          id="outlined-error-attribute"
          variant="outlined"
          label={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </Box>
    </FormDialog>
  );
};

export default AttributesDialog;
