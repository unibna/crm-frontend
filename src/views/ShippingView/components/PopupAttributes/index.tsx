// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { MultiSelect } from "components/Selectors";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import { TYPE_SHIPPING_COMPANIES } from "views/ShippingView/constants";
import { SHIPPING_COMPANIES } from "_types_/GHNType";

// -------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const PopupAttributes = (props: Props) => {
  const { watch, control } = props;
  const { type } = watch();

  const renderHtml = () => {
    switch (type) {
      case SHIPPING_COMPANIES.GHN: {
        return (
          <>
            <Grid item xs={12}>
              <Controller
                name="valueA"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Token" placeholder="Nhập token" required />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="valueB"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Shop ID"
                    placeholder="Nhập Shop ID"
                    required
                  />
                )}
              />
            </Grid>
          </>
        );
      }
      case SHIPPING_COMPANIES.VNPOST: {
        return (
          <>
            <Grid item xs={12}>
              <Controller
                name="valueA"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tài khoản"
                    placeholder="Nhập tài khoản"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="valueB"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    fullWidth
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                )}
              />
            </Grid>
          </>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <Grid container spacing={3}>
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
              label="Tên đơn vị vận chuyển"
              placeholder="Nhập tên đơn vị vận chuyển"
              required
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              zIndex={1303}
              title="Đơn vị vận chuyển"
              size="medium"
              error={!!error}
              outlined
              fullWidth
              helperText={error?.message}
              options={TYPE_SHIPPING_COMPANIES}
              onChange={field.onChange}
              defaultValue={field.value || ""}
              placeholder="Nhập để tìm kiếm"
              simpleSelect
              selectorId="tracking-company"
            />
          )}
        />
      </Grid>
      {renderHtml()}
    </Grid>
  );
};

export default PopupAttributes;
