// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import { MultiSelect } from "components/Selectors";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { Stack, TextField, Typography } from "@mui/material";
import { INTERVAL_TIME, OPTION_INTERVAL_TIME } from "views/DataFlow/constants";

// -----------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const CronTab = (props: Props) => {
  const { control } = props;

  return (
    <Grid container columnSpacing={2} rowSpacing={3}>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="minute"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ width: 200 }}>
                Phút:
              </Typography>
              <TextField
                {...field}
                fullWidth
                error={!!error}
                helperText={error?.message}
                label="Chú thích"
              />
            </Stack>
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="hour"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ width: 200 }}>
                Giờ:
              </Typography>
              <TextField
                {...field}
                fullWidth
                error={!!error}
                helperText={error?.message}
                label="Chú thích"
              />
            </Stack>
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="day_of_month"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ width: 200 }}>
                Ngày trong tháng:
              </Typography>
              <TextField
                {...field}
                fullWidth
                error={!!error}
                helperText={error?.message}
                label="Chú thích"
              />
            </Stack>
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="month"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ width: 200 }}>
                Tháng:
              </Typography>
              <TextField
                {...field}
                fullWidth
                error={!!error}
                helperText={error?.message}
                label="Chú thích"
              />
            </Stack>
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="day_of_week"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ width: 200 }}>
                Ngày trong tuần:
              </Typography>
              <TextField
                {...field}
                fullWidth
                error={!!error}
                helperText={error?.message}
                label="Chú thích"
              />
            </Stack>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default CronTab;
