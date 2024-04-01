// Libraries
import { map } from "lodash";
import { Controller } from "react-hook-form";

// Components
import MDatePicker from "components/Pickers/MDatePicker";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import { InputNumber } from "components/Fields";

// Types
import { OperationProps, ProviderFilter } from "views/DataFlow/components/NodeOperation";

// Contants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { checkValueReg, OPTION_INCLUSIVE } from "views/DataFlow/constants";

// -----------------------------------------------------------

const OperationDatetimeRange = (props: OperationProps) => {
  const { control, watch } = props;
  const valueNode = watch();

  return (
    <>
      <Controller
        name="start"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <ProviderFilter {...props} field={field}>
            <MDatePicker
              views={["day", "year", "month"]}
              label="Thời gian bắt đầu"
              minDate={new Date("2012-03-01")}
              // maxDate={new Date("2025-06-01")}
              value={checkValueReg(
                field.value,
                getObjectPropSafely(() => valueNode.static_data.formatFilter.start)
              )}
              onChangeDate={field.onChange}
              error={!!getObjectPropSafely(() => error?.message)}
              helperText={getObjectPropSafely(() => error?.message)}
              size="medium"
              fullWidth
            />
          </ProviderFilter>
        )}
      />
      <Controller
        name="end"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <ProviderFilter {...props} field={field}>
            <MDatePicker
              views={["day", "year", "month"]}
              label="Thời gian kết thúc"
              minDate={new Date("2012-03-01")}
              fullWidth
              // maxDate={new Date("2025-06-01")}
              value={checkValueReg(
                field.value,
                getObjectPropSafely(() => valueNode.static_data.formatFilter.end)
              )}
              onChangeDate={field.onChange}
              error={!!getObjectPropSafely(() => error?.message)}
              helperText={getObjectPropSafely(() => error?.message)}
              size="medium"
            />
          </ProviderFilter>
        )}
      />
      <Controller
        name="periods"
        control={control}
        render={({ field }) => (
          <>
            <Typography variant="body2">Chu kỳ</Typography>
            <InputNumber
              value={field.value}
              minQuantity={1}
              onChange={field.onChange}
              containerStyles={{
                minWidth: "70px",
                maxWidth: "120px",
                paddingTop: 0.5,
                paddingBottom: 1.5,
              }}
            />
          </>
        )}
      />
      <Controller
        name="inclusive"
        control={control}
        render={({ field }) => (
          <Stack>
            <Typography variant="body2">Bao hàm:</Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {map(OPTION_INCLUSIVE, (item) => (
                <Grid item>
                  <Chip
                    label={item}
                    sx={{
                      // color: "#fff",
                      ...(!(item === field.value) && {
                        opacity: 0.5,
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

export default OperationDatetimeRange;
