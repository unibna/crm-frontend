// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { RHFTextField } from "components/HookFormFields";
import { FormValuesProps } from "components/Popups/FormPopup";
import FormControlLabel from "@mui/material/FormControlLabel";

// -----------------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const UpdateCell = (props: Props) => {
  const { control } = props;

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} sm={12} xs={12}>
        <RHFTextField name="content_id" label="Content ID" placeholder="Nhập name" />
      </Grid>
      {/* <Grid item lg={12} sm={12} xs={12}>
        <RHFTextField name="ad_id" label="Ad ID" placeholder="Nhập name" />
      </Grid> */}
      <Grid item xs={12}>
        <Controller
          name="is_conversion_obj"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Chuyển đổi"
              sx={{ width: 150 }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default UpdateCell;
