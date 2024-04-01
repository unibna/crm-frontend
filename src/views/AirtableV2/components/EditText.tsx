import { TextField } from "@mui/material";
import { forwardRef, memo } from "react";

const EditText = forwardRef(({ sx, isOriginal, ...rest }: any, ref: any) => {
  // console.log(rest);
  return (
    <TextField
      inputRef={ref}
      sx={{
        ...(!isOriginal && {
          ".MuiOutlinedInput-root": {
            p: 0,
          },
          ".MuiOutlinedInput-input": {
            p: 0,
            fontSize: 12,
            fontWeight: 500,
          },
          fieldset: {
            border: "none",
          },
        }),
        ...sx,
      }}
      fullWidth
      {...rest}
    />
  );
});

export default memo(EditText);
