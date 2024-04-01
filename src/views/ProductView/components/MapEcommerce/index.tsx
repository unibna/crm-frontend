// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormValuesProps } from "components/Popups/FormPopup";
import { SearchVariant } from "components/ProductComponent";
import { MultiSelect } from "components/Selectors";

// Constants & Utils
import { optionPlatformEcommerce } from "views/ProductView/constants";

//-------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const MapEcommerce = (props: Props) => {
  const { control } = props;

  return (
    <Grid container columnSpacing={2} rowSpacing={3}>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="ecommerce_platform"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              style={{ width: "100%" }}
              title="Chọn platform"
              size="medium"
              outlined
              selectorId="platform"
              fullWidth
              error={!!error}
              helperText={error?.message}
              options={optionPlatformEcommerce}
              onChange={(value: any) => field.onChange(value)}
              defaultValue={field.value || ""}
              simpleSelect
              disabled
            />
          )}
        />
      </Grid>
      <Grid item lg={6} xs={6} sm={6}>
        <Controller
          name="ecommerce_sku"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="SKU sàn"
              required
              disabled
            />
          )}
        />
      </Grid>
      <Grid item lg={6} xs={6} sm={6}>
        <Controller
          name="ecommerce_name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Tên sản phẩm sàn"
              disabled
            />
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12} sx={{ mt: 3 }}>
        <Controller
          name="variant"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SearchVariant
              value={field.value}
              message={error?.message}
              placeholder="Tìm theo tên sản phẩm"
              handleSelectVariant={(variants) => field.onChange(variants)}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default MapEcommerce;
