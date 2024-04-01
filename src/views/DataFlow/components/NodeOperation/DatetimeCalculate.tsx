// Libraries
import { map } from "lodash";
import { Controller } from "react-hook-form";

// Components
import { Chip, Grid, Stack, TextField, Typography } from "@mui/material";

// Types
import { OperationProps } from "views/DataFlow/components/NodeOperation";

// Contants & Utils
import { OPTION_OPERATION_DATETIME, OPTION_TIME_UNIT } from "views/DataFlow/constants";

// -----------------------------------------------------------

const OperationDatetimeCalculate = (props: OperationProps) => {
  const { control } = props;

  return (
    <>
      <Controller
        name="date_values"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="Giá trị ngày"
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      <Controller
        name="periods"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            type="number"
            value={field.value}
            error={!!error?.message}
            helperText={error?.message}
            label="Chu kỳ"
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      <Controller
        name="operation"
        control={control}
        render={({ field }) => (
          <Stack>
            <Typography variant="body2">Thao tác:</Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {map(OPTION_OPERATION_DATETIME, (item) => (
                <Grid item>
                  <Chip
                    label={item}
                    sx={{
                      color: "#fff",
                      ...(!(item === field.value) && {
                        opacity: 0.2,
                      }),
                    }}
                    onClick={() => field.onChange(item)}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
      />
      <Controller
        name="time_unit"
        control={control}
        render={({ field }) => (
          <Stack>
            <Typography variant="body2">Đơn vị thời gian:</Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {map(OPTION_TIME_UNIT, (item) => (
                <Grid item>
                  <Chip
                    label={item}
                    sx={{
                      color: "#fff",
                      ...(!(item === field.value) && {
                        opacity: 0.2,
                      }),
                    }}
                    onClick={() => field.onChange(item)}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
      />
    </>
  );
};

export default OperationDatetimeCalculate;
