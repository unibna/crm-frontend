// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import { SelectOptionType } from "_types_/SelectOptionType";
import { MSelectColor } from "components/Selectors";

// -----------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {
  optionLeadStatus: SelectOptionType[];
  optionDataStatus: SelectOptionType[];
  optionBadDataStatus: SelectOptionType[];
  optionHandleReason: SelectOptionType[];
  optionCustomer: SelectOptionType[];
}

const ContentRule = (props: Props) => {
  const {
    control,
    getValues,
    optionLeadStatus,
    optionDataStatus,
    optionBadDataStatus,
    optionHandleReason,
    optionCustomer,
  } = props;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Tên phân loại"
              placeholder="Nhập tên"
              required={true}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="lead_status"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              multiple
              options={optionLeadStatus}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              value={field.value}
              disableCloseOnSelect
              getOptionLabel={(option) => option.label}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Trạng thái đơn" placeholder="Chọn trạng thái đơn" />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="data_status"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              multiple
              options={optionDataStatus}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              value={field.value}
              disableCloseOnSelect
              getOptionLabel={(option) => option.value}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Trạng thái dữ liệu"
                  placeholder="Chọn trạng thái dữ liệu"
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="bad_data_reason"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              multiple
              options={optionBadDataStatus}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              value={field.value}
              disableCloseOnSelect
              getOptionLabel={(option) => option.value}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lý do dữ liệu KCL"
                  placeholder="Chọn lý do dữ liệu KCL"
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="handle_reason"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              multiple
              options={optionHandleReason}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              value={field.value}
              disableCloseOnSelect
              getOptionLabel={(option) => option.value}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Lý do xử lý" placeholder="Chọn lý do xử lý" />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="customer_ids"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              multiple
              options={optionCustomer}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              value={field.value}
              disableCloseOnSelect
              getOptionLabel={(option) => option.label}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tài khoản Upload Conversion"
                  placeholder="Chọn tài khoản Upload Conversion"
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="color"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Grid container direction="row" spacing={3} alignItems="center">
                <Grid item xs={4} md={4}>
                  <Typography variant="body2">Chọn màu cho rule</Typography>
                </Grid>
                <Grid item xs={2} md={2}>
                  <MSelectColor
                    color={field.value}
                    onChangeColor={(color: string) => field.onChange(color)}
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  {getValues("name") ? (
                    <Box>
                      <Chip
                        size="small"
                        label={getValues("name")}
                        sx={{
                          backgroundColor: field.value,
                          color: "#fff",
                        }}
                      />
                    </Box>
                  ) : null}
                </Grid>
              </Grid>
              {!!error ? (
                <Typography variant="body2" component="span" color="error" sx={{ mt: 1 }}>
                  {error?.message}
                </Typography>
              ) : null}
            </>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default ContentRule;
