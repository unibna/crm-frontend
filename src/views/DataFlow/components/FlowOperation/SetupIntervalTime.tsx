// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import { InputNumber } from "components/Fields";
import { MultiSelect } from "components/Selectors";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { Stack, Typography } from "@mui/material";
import { INTERVAL_TIME, OPTION_INTERVAL_TIME } from "views/DataFlow/constants";

// -----------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const SetupIntervalTime = (props: Props) => {
  const { control } = props;

  return (
    <Grid container columnSpacing={2} rowSpacing={3}>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="number"
          control={control}
          render={({ field }) => (
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ mr: 3 }}>
                Số lặp mỗi lần:
              </Typography>
              <InputNumber
                value={field.value}
                minQuantity={1}
                onChange={field.onChange}
                containerStyles={{
                  minWidth: "70px",
                  maxWidth: "120px",
                }}
              />
            </Stack>
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="interval"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography variant="body2" sx={{ mr: 3 }}>
                Đơn vị lặp:
              </Typography>
              <MultiSelect
                title="Khoảng thời gian"
                size="medium"
                outlined
                error={!!error?.message}
                helperText={error?.message}
                selectorId="schedule"
                // fullWidth
                options={OPTION_INTERVAL_TIME}
                onChange={(value: INTERVAL_TIME) => field.onChange(value)}
                defaultValue={field.value}
                simpleSelect
              />
            </Stack>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default SetupIntervalTime;
