// Libraries
import { useState, useMemo, useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { CancelTokenSource } from "axios";

// Hooks
import usePopup from "hooks/usePopup";
import { useCancelToken } from "hooks/useCancelToken";

// Services
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";

// Types
import { ColorSchema } from "_types_/ThemeColorType";

// Components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { MButton } from "components/Buttons";
import LoadingModal from "components/Loadings/LoadingModal";
import MTimeline, { DataTimelineProps } from "components/MTimeline";
import MDatePicker from "components/Pickers/MDatePicker";

// Constants & Utils
import { message } from "views/DashboardMKTView/constants";
import { COMMAS_REGEX, statusNotification } from "constants/index";

const colorDefault: ColorSchema[] = ["primary", "secondary", "info", "success", "warning", "error"];
interface FormValuesProps extends Partial<any> {
  taxes: boolean;
  inStock: boolean;
}
interface Props extends UseFormReturn<FormValuesProps, object> {
  handleSubmitForm?: (form: any) => void;
}

let cancelRequest: CancelTokenSource;

const ChildrenPopover = (props: any) => {
  const { ads_target, crm_target, handleUpdate } = props;
  const [valueTarget, setValueTarget] = useState<Partial<any>>({
    valueAdsTarget: 200000000,
    valueCrmTarget: 300000000,
  });

  const defaultValues = useMemo(() => {
    return {
      valueAdsTarget: ads_target,
      valueCrmTarget: crm_target,
    };
  }, [ads_target, crm_target]);

  useEffect(() => {
    setValueTarget({
      ...valueTarget,
      ...defaultValues,
    });
  }, []);

  return (
    <Grid container>
      <Grid xs={12} mt={2} px={2} item>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography>Mục tiêu ADS</Typography>
          <TextField
            type="number"
            fullWidth
            value={valueTarget.valueAdsTarget}
            // error={!!error}
            // helperText={error?.message}
            label="Nhập mục tiêu ADS"
            placeholder="Mục tiêu"
            onChange={(event: any) =>
              setValueTarget({ ...valueTarget, valueAdsTarget: +event.target.value })
            }
          />
        </Stack>
        {/* <Slider
          value={valueTarget.valueAdsTarget}
          onChange={(e, value) => setValueTarget({ ...valueTarget, valueAdsTarget: value })}
          getAriaValueText={fShortenNumber}
          valueLabelFormat={fShortenNumber}
          valueLabelDisplay="auto"
          marks={MARK_SLIDER_OBJECTIVE_REVENUE}
          min={MARK_SLIDER_OBJECTIVE_REVENUE[0].value}
          max={MARK_SLIDER_OBJECTIVE_REVENUE[9].value}
        /> */}
      </Grid>
      <Grid xs={12} mt={2} px={2} item>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography>Mục tiêu CRM</Typography>
          <TextField
            type="number"
            fullWidth
            value={valueTarget.valueCrmTarget}
            // error={!!error}
            // helperText={error?.message}
            onChange={(event: any) =>
              setValueTarget({ ...valueTarget, valueCrmTarget: +event.target.value })
            }
            label="Nhập mục tiêu CRM"
            placeholder="Mục tiêu"
          />
        </Stack>
        {/* <Slider
          value={valueTarget.valueCrmTarget}
          onChange={(e, value) => setValueTarget({ ...valueTarget, valueCrmTarget: value })}
          getAriaValueText={fShortenNumber}
          valueLabelFormat={fShortenNumber}
          valueLabelDisplay="auto"
          marks={MARK_SLIDER_OBJECTIVE_REVENUE}
          min={MARK_SLIDER_OBJECTIVE_REVENUE[0].value}
          max={MARK_SLIDER_OBJECTIVE_REVENUE[9].value}
        /> */}
      </Grid>
      <Grid xs={12} mt={2} px={2} item>
        <Stack direction="row" justifyContent="flex-end">
          <MButton
            onClick={() =>
              handleUpdate({
                ...props,
                ads_target: valueTarget.valueAdsTarget,
                crm_target: valueTarget.valueCrmTarget,
              })
            }
            disabled={isEqual(defaultValues, valueTarget)}
          >
            Cập nhật
          </MButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

const FormMonthTarget = (props: Props) => {
  const { control, handleSubmit, clearErrors, watch, reset, handleSubmitForm = () => {} } = props;
  const { dataPopup } = usePopup();
  const values = watch();

  const handleResetForm = () => {
    reset();
    clearErrors();
  };

  return (
    <Stack spacing={2}>
      <Controller
        name="crm_target"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            fullWidth
            label="Nhập mục tiêu CRM"
            placeholder="Mục tiêu"
          />
        )}
      />
      <Controller
        name="ads_target"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            fullWidth
            label="Nhập mục tiêu ADS"
            placeholder="Mục tiêu"
          />
        )}
      />
      <Controller
        name="time"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MDatePicker
            views={["year", "month"]}
            label="Thời gian"
            minDate={new Date("2012-03-01")}
            // maxDate={new Date("2025-06-01")}
            value={field.value}
            onChangeDate={(value: Date) => field.onChange(value)}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <MButton
          color="secondary"
          disabled={isEqual(dataPopup.defaultData, values)}
          onClick={handleResetForm}
        >
          Reset
        </MButton>
        <MButton
          disabled={isEqual(dataPopup.defaultData, values)}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Save
        </MButton>
      </Stack>
    </Stack>
  );
};

const PopupObjectiveRevenue = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<DataTimelineProps[]>([]);
  const { setNotifications } = usePopup();
  const { newCancelToken } = useCancelToken();

  useEffect(() => {
    getData();
  }, []);

  const convertValue = (value: number) => {
    return `${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0}`;
  };

  const getData = async () => {
    setLoading(true);
    const result: any = await dashboardMkt.get(
      {
        cancelToken: newCancelToken(),
      },
      "monthly-target/"
    );
    if (result && result.data) {
      const { results = [] } = result.data;
      const newData = results.map((item: any) => {
        return {
          ads_target: item.ads_target,
          crm_target: item.crm_target,
          id: item.id,
          time: `${item.month}-${item.year}`,
          title: [
            `ADS - ${convertValue(item.ads_target)}`,
            `CRM - ${convertValue(item.crm_target)}`,
          ],
          month: item.month,
          year: item.year,
          color: colorDefault[Math.floor(Math.random() * colorDefault.length)],
        };
      });

      setData(newData);
    }

    setLoading(false);
  };

  const handleUpdateTarget = async (valueTarget: any) => {
    if (valueTarget) {
      const params = {
        id: valueTarget.id,
        // month: valueTarget.month,
        // year: valueTarget.year,
        ads_target: valueTarget.ads_target,
        crm_target: valueTarget.crm_target,
      };

      const result: any = await dashboardMkt.update(
        {
          ...params,
          cancelToken: cancelRequest.token,
        },
        "monthly-target/"
      );

      if (result && result.data) {
        getData();

        setNotifications({
          message: message.UPDATE_TARGET_SUCCESS,
          variant: statusNotification.SUCCESS,
        });
      } else {
        setNotifications({
          message: message.UPDATE_TARGET_FAILED,
          variant: statusNotification.ERROR,
        });
      }
    }
  };

  const handleCreateTarget = async (form: {
    ads_target: string;
    crm_target: string;
    time: Date;
  }) => {
    if (form) {
      const params = {
        month: form?.time.getMonth() + 1,
        year: form?.time.getFullYear(),
        ads_target: +form.ads_target || 0,
        crm_target: +form.crm_target || 0,
      };

      const result: any = await dashboardMkt.create(
        {
          ...params,
          cancelToken: cancelRequest.token,
        },
        "monthly-target/"
      );

      if (result && result.data) {
        getData();

        setNotifications({
          message: message.CREATE_TARGET_SUCCESS,
          variant: statusNotification.SUCCESS,
        });
      } else {
        setNotifications({
          message: message.CREATE_TARGET_FAILED,
          variant: statusNotification.ERROR,
        });
      }
    }
  };

  return (
    <Grid container>
      <Grid item xs={6} className="relative">
        {isLoading && <LoadingModal />}
        <MTimeline
          data={data}
          childrenPopover={(propChildren) => (
            <ChildrenPopover {...propChildren} handleUpdate={handleUpdateTarget} />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ mb: 2 }}>Tạo mới mục tiêu</Typography>
        <FormMonthTarget {...props} handleSubmitForm={handleCreateTarget} />
      </Grid>
    </Grid>
  );
};

export default PopupObjectiveRevenue;
