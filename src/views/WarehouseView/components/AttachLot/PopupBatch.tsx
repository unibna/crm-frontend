// Libraries
import { Controller, UseFormReturn } from "react-hook-form";

// Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormValuesProps } from "components/Popups/FormPopup";
import MDatePicker from "components/Pickers/MDatePicker";
import Iconify from "components/Icons/Iconify";
import { InputNumber } from "components/Fields";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { TypeWarehouseSheet } from "_types_/WarehouseType";

// -----------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {
  type: string;
  isEdit?: boolean;
}

const PopupBatch = (props: Props) => {
  const { control, type, isEdit = false } = props;

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
              disabled={isEdit}
              error={!!error}
              helperText={error?.message}
              label="Lô"
              placeholder="Nhập lô"
              required={true}
            />
          )}
        />
      </Grid>
      {type === TypeWarehouseSheet.IMPORTS && !isEdit ? (
        <Grid item xs={12}>
          <Typography sx={{ mb: 2 }} variant="body2" color="text.secondary">
            Chọn 1 trong 2:
          </Typography>
          <Stack>
            <Controller
              name="valueDate"
              control={control}
              render={({ field, fieldState: { error } }: any) => {
                const { isHaveHsd = true, value } = field.value;
                return (
                  <Stack rowGap={1} sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={isHaveHsd}
                          onChange={() =>
                            field.onChange({
                              ...field.value,
                              isHaveHsd: true,
                            })
                          }
                          checkedIcon={<Iconify icon={"eva:checkmark-circle-2-fill"} />}
                        />
                      }
                      label={
                        <MDatePicker
                          views={["day", "year", "month"]}
                          label="Hạn sử dụng"
                          minDate={new Date("2012-03-01")}
                          // maxDate={new Date("2025-06-01")}
                          value={value}
                          onChangeDate={(value: Date) =>
                            field.onChange({
                              ...field.value,
                              value,
                            })
                          }
                          error={!!getObjectPropSafely(() => error?.message)}
                          helperText={getObjectPropSafely(() => error?.message)}
                          size="medium"
                        />
                      }
                      sx={{ width: 300 }}
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={!isHaveHsd}
                          onChange={() =>
                            field.onChange({
                              ...field.value,
                              isHaveHsd: false,
                            })
                          }
                          checkedIcon={<Iconify icon={"eva:checkmark-circle-2-fill"} />}
                        />
                      }
                      label={<Typography>Sản phẩm không có hạn sử dụng</Typography>}
                      sx={{ width: 300 }}
                    />
                  </Stack>
                );
              }}
            />
          </Stack>
        </Grid>
      ) : null}
      {isEdit && (
        <Grid item container alignItems="center" xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 4, width: 200 }}>
            Số lượng hiện tại của lô:
          </Typography>
          <Controller
            name="quantityPrev"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputNumber
                disabled
                value={field.value}
                minQuantity={1}
                onChange={field.onChange}
                containerStyles={{
                  minWidth: "70px",
                  maxWidth: "120px",
                }}
                error={!!error?.message}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
      )}
      <Grid item container alignItems="center" xs={12}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 4, width: 200 }}>
          Nhập số lượng:
        </Typography>
        <Controller
          name="quantity"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputNumber
              value={field.value}
              minQuantity={1}
              onChange={field.onChange}
              containerStyles={{
                minWidth: "70px",
                maxWidth: "120px",
              }}
              error={!!error?.message}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default PopupBatch;
