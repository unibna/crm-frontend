// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import FormHelperText from "@mui/material/FormHelperText";
// type
import { UploadMultiFile } from "components/Uploads";
import { UploadMultiFileProps } from "_types_/FileType";

// ----------------------------------------------------------------------

interface RHFUploadMultiFileProps extends Omit<UploadMultiFileProps, "files"> {
  name: string;
  accept?: string;
}

export function RHFUploadMultiFile({ name, accept, ...other }: RHFUploadMultiFileProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;

        return (
          <UploadMultiFile
            accept={accept === "*" ? undefined : accept || "image/*"}
            files={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}
