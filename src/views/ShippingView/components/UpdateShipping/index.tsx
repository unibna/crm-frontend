// Libraries
import { Controller, UseFormReturn } from "react-hook-form";
import reduce from "lodash/reduce";

// Components
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormValuesProps } from "components/Popups/FormPopup";
import MDatePicker from "components/Pickers/MDatePicker";
import { MultiSelect } from "components/Selectors";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { useMemo } from "react";
import { optionStatusShipping, SHIPPING_STATUS } from "views/ShippingView/constants";
import { STATUS_ROLE_SHIPPING } from "constants/rolesTab";

// -----------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {}

const UpdateShipping = (props: Props) => {
  const { control, watch } = props;
  const { carrier_status_manual } = watch();

  const optionsCarrierStatus = useMemo(() => {
    return reduce(
      optionStatusShipping,
      (prevArr, current) => {
        return current.value !== "all"
          ? [
              ...prevArr,
              {
                ...current,
                disabled: [
                  SHIPPING_STATUS[STATUS_ROLE_SHIPPING.PICKING],
                  SHIPPING_STATUS[STATUS_ROLE_SHIPPING.DELIVERING],
                  SHIPPING_STATUS[STATUS_ROLE_SHIPPING.RETURNED],
                ].includes(current.value),
              },
            ]
          : prevArr;
      },
      []
    );
  }, []);

  const optionsCodTransferred: any = useMemo(
    () => [
      {
        label: "Chờ chuyển COD",
        value: false,
      },
      {
        label: "Đã chuyển COD",
        value: true,
      },
    ],
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="carrier_status_manual"
          control={control}
          render={({ field }) => (
            <MultiSelect
              zIndex={1303}
              title="Trạng thái vận đơn"
              size="medium"
              outlined
              fullWidth
              selectorId="carrier_status_manual"
              options={optionsCarrierStatus}
              onChange={field.onChange}
              defaultValue={getObjectPropSafely(() => field.value)}
              simpleSelect
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="is_cod_transferred"
          control={control}
          render={({ field }) => (
            <MultiSelect
              zIndex={1303}
              title="Trạng thái thu hộ"
              size="medium"
              outlined
              fullWidth
              selectorId="is_cod_transferred"
              options={optionsCodTransferred}
              onChange={field.onChange}
              defaultValue={getObjectPropSafely(() => field.value)}
              simpleSelect
            />
          )}
        />
      </Grid>
      {carrier_status_manual === SHIPPING_STATUS[STATUS_ROLE_SHIPPING.SUCCESS] ? (
        <Grid item xs={12} sx={{ ml: 1 }}>
          <Controller
            name="objFinishDate"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const {
                value: { isShowFinishDate, finishDate },
                onChange,
              } = field;

              return (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isShowFinishDate}
                        onChange={(e) =>
                          onChange({
                            ...field.value,
                            isShowFinishDate: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Chọn ngày hoàn thành"
                    sx={{ width: 200 }}
                  />
                  {isShowFinishDate ? (
                    <MDatePicker
                      views={["day", "month", "year"]}
                      label="Ngày hoàn thành"
                      minDate={new Date("2012-03-01")}
                      value={finishDate}
                      onChangeDate={(value: Date) =>
                        field.onChange({
                          ...field.value,
                          finishDate: value,
                        })
                      }
                      error={!!getObjectPropSafely(() => error?.message)}
                      helperText={getObjectPropSafely(() => error?.message)}
                      size="medium"
                    />
                  ) : null}
                </>
              );
            }}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default UpdateShipping;
