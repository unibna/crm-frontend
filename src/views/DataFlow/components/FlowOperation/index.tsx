// Libraries
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

// Context
import usePopup from "hooks/usePopup";

// Components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { MultiSelect } from "components/Selectors";
import { MDateTimeMobilePicker } from "components/Pickers";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SetupIntervalTime from "views/DataFlow/components/FlowOperation/SetupIntervalTime";
import CronTab from "views/DataFlow/components/FlowOperation/CronTab";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { Divider, Stack, Switch, Typography } from "@mui/material";
import {
  ActionType,
  contentRenderDefault,
  INTERVAL_TIME,
  titlePopupHandle,
} from "views/DataFlow/constants";
import { GridSizeType } from "_types_/GridLayoutType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -----------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const FlowOperation = (props: Props) => {
  const { control, setValue, watch } = props;
  const {
    dataPopupChild,
    setDataPopupChild,
    dataFormChild,
    setLoadingSubmitChild,
    closePopupChild,
  } = usePopup<{}>();
  const valueNode = watch();

  useEffect(() => {
    if (Object.values(dataFormChild).length) {
      handleSubmitPopup(dataFormChild);
    }
  }, [dataFormChild]);

  const convertValueIntervalTime = (type: INTERVAL_TIME, value: number) => {
    switch (type) {
      case INTERVAL_TIME.DAYS: {
        return `0 0 */${value} * *`;
      }
      case INTERVAL_TIME.HOURS: {
        return `0 */${value} * * *`;
      }
      case INTERVAL_TIME.MINUTES: {
        return `*/${value} * * * *`;
      }
    }
  };

  const openPopup = (type: string, defaultValue: Partial<any> = {}) => {
    let typeProduct = type;
    let funcContentSchema: any;
    let buttonTextPopup = "Cập nhật";
    let title = titlePopupHandle[type];
    let newContentRender = (methods: any) => contentRenderDefault[type];
    let defaultData = defaultValue;
    let maxWidthForm: GridSizeType = "sm";
    let isDisabledSubmit = true;
    let isShowFooter = true;
    let isFullScreen = false;

    switch (type) {
      case ActionType.ADD_INTERVAL_TIME: {
        defaultData = {
          number: 1,
          interval: "",
        };
        funcContentSchema = (yup: any) => {
          return {
            interval: yup.string().required("Vui lòng chọn"),
            number: yup.number(),
          };
        };
        newContentRender = (methods: any) => {
          return <SetupIntervalTime {...methods} />;
        };

        break;
      }
      case ActionType.ADD_CRON_TIME: {
        defaultData = {
          minute: "*",
          hour: "*",
          day_of_month: "*",
          day_of_week: "*",
          month: "*",
        };
        funcContentSchema = (yup: any) => {
          return {
            minute: yup.string().required("Vui lòng nhập"),
            hour: yup.string().required("Vui lòng nhập"),
            day_of_month: yup.string().required("Vui lòng nhập"),
            day_of_week: yup.string().required("Vui lòng nhập"),
            month: yup.string().required("Vui lòng nhập"),
          };
        };
        newContentRender = (methods: any) => {
          return <CronTab {...methods} />;
        };
      }
    }

    setDataPopupChild({
      ...dataPopupChild,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      isDisabledSubmit,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
      isShowFooter,
      isFullScreen,
    });
  };

  const handleSubmitPopup = async (form: Partial<any>) => {
    setLoadingSubmitChild(true);

    switch (dataPopupChild.type) {
      case ActionType.ADD_INTERVAL_TIME: {
        setValue("static_data", {
          ...valueNode.static_data,
          optionInterval: [
            ...(getObjectPropSafely(() => valueNode.static_data.optionInterval) || []),
            {
              label: `every ${form.number} ${form.interval}`,
              value: convertValueIntervalTime(form.interval, form.number),
            },
          ],
        });

        closePopupChild();
        break;
      }
      case ActionType.ADD_CRON_TIME: {
        setValue("static_data", {
          ...valueNode.static_data,
          optionCronTab: [
            ...(getObjectPropSafely(() => valueNode.static_data.optionCronTab) || []),
            {
              label: `${form.minute} ${form.hour} ${form.day_of_month} ${form.month} ${form.day_of_week}`,
              value: `${form.minute} ${form.hour} ${form.day_of_month} ${form.month} ${form.day_of_week}`,
            },
          ],
        });

        closePopupChild();
      }
    }

    setLoadingSubmitChild(false);
  };

  return (
    <Grid container columnSpacing={2} rowSpacing={3}>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Tên flow"
              required
            />
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Chú thích"
            />
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="start_date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MDateTimeMobilePicker
              onChange={field.onChange}
              label="Thời gian bắt đầu"
              value={field.value ? (new Date(field.value) as any) : null}
              sx={{ mt: 2 }}
            />
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="end_date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MDateTimeMobilePicker
              onChange={field.onChange}
              label="Thời gian kết thúc"
              value={field.value ? (new Date(field.value) as any) : null}
              sx={{ mt: 2 }}
            />
          )}
        />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Divider />
      </Grid>
      <Grid item lg={12} xs={12} sm={12}>
        <Controller
          name="schedule"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center">
                <Typography component="span" variant="body2">
                  Chạy chỉ một lần
                </Typography>
                <Switch
                  {...field}
                  checked={field.value === "@once"}
                  onChange={(event) => field.onChange(event.target.checked ? "@once" : "")}
                />
              </Stack>
              <Stack direction="row">
                <MultiSelect
                  title="Khoảng thời gian"
                  size="medium"
                  outlined
                  error={!!error?.message}
                  helperText={error?.message}
                  selectorId="schedule"
                  fullWidth
                  options={getObjectPropSafely(() => valueNode.static_data.optionInterval) || []}
                  onChange={(value: INTERVAL_TIME) => field.onChange(value)}
                  defaultValue={field.value}
                  simpleSelect
                />
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => openPopup(ActionType.ADD_INTERVAL_TIME)}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              <Stack direction="row">
                <MultiSelect
                  title="Tùy chỉnh"
                  size="medium"
                  outlined
                  error={!!error?.message}
                  helperText={error?.message}
                  selectorId="schedule"
                  fullWidth
                  options={getObjectPropSafely(() => valueNode.static_data.optionCronTab) || []}
                  onChange={(value: INTERVAL_TIME) => field.onChange(value)}
                  defaultValue={field.value}
                  simpleSelect
                />
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => openPopup(ActionType.ADD_CRON_TIME)}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
            </Stack>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default FlowOperation;
