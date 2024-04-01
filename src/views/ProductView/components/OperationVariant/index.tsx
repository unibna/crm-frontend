// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { UploadMultiFile } from "components/Uploads";
import FormHelperText from "@mui/material/FormHelperText";
import { FormValuesProps } from "components/Popups/FormPopup";
import { LabelStyle } from "views/ProductView";

// Constants & Utils
import { fNumber } from "utils/formatNumber";
import { STATUS_ROLE_LIST_PRODUCT } from "constants/rolesTab";

// -------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  isLoadingImage: boolean;
  handleRemoveImage: any;
  handleRemoveAllImage: any;
  handleDropImage: any;
  variantType?: string;
}

const OperationVariant = (props: Props) => {
  const {
    control,
    handleRemoveImage,
    handleRemoveAllImage,
    handleDropImage,
    isLoadingImage,
    variantType,
  } = props;

  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item lg={5} xs={5} sm={5}>
        <Controller
          name="value"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              required
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Tên biến thể"
            />
          )}
        />
      </Grid>
      <Grid item lg={3.5} xs={3.5} sm={3.5}>
        <Controller
          name="SKU_code"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="SKU"
              placeholder="Nhập SKU"
            />
          )}
        />
      </Grid>
      <Grid item lg={3.5} xs={3.5} sm={3.5}>
        <Controller
          name="barcode"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Barcode"
              placeholder="Nhập Barcode"
            />
          )}
        />
      </Grid>
      <Grid item lg={4.5} xs={4.5} sm={4.5}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Mô tả"
              placeholder="Nhập mô tả"
            />
          )}
        />
      </Grid>
      <Grid item lg={2.5} xs={2.5} sm={2.5}>
        <Controller
          name="neo_price"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              disabled={variantType === STATUS_ROLE_LIST_PRODUCT.COMBO}
              value={fNumber(field.value)}
              onChange={(event) => field.onChange(convertValueVnd(event.target.value))}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Giá niêm yết"
              placeholder="0 đ"
              InputProps={{
                endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
              }}
            />
          )}
        />
      </Grid>
      <Grid item lg={2.5} xs={2.5} sm={2.5}>
        <Controller
          name="sale_price"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              disabled={variantType === STATUS_ROLE_LIST_PRODUCT.COMBO}
              value={fNumber(field.value)}
              onChange={(event) => field.onChange(convertValueVnd(event.target.value))}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Giá bán"
              placeholder="0 đ"
              InputProps={{
                endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
              }}
            />
          )}
        />
      </Grid>
      <Grid item container lg={2.5} xs={2.5} sm={2.5} direction="row" alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography component="span" variant="body2">
            Ngừng kinh doanh
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => <Switch {...field} checked={field.value} />}
          />
        </Grid>
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <LabelStyle>Hình đại diện của sản phẩm (Sẽ hiển thị trên các trang bán hàng)</LabelStyle>
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const checkError = !!error && field.value?.length === 0;
            return (
              <UploadMultiFile
                accept="image/*"
                files={field.value}
                error={checkError}
                helperText={
                  checkError && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {error?.message}
                    </FormHelperText>
                  )
                }
                isMultiple={false}
                showPreview
                maxSize={3145728}
                isLoadingBackground={isLoadingImage}
                onDrop={(acceptedFiles: File[]) => handleDropImage(acceptedFiles, props)}
                onRemove={(file: { id: string; url: string }) => handleRemoveImage(file, props)}
                onRemoveAll={() => handleRemoveAllImage(props)}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default OperationVariant;
