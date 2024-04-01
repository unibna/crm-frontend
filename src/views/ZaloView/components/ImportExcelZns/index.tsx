// Libraries
import { Controller, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import tail from "lodash/tail";
import map from "lodash/map";
import some from "lodash/some";
import every from "lodash/every";
import omit from "lodash/omit";
import upperFirst from "lodash/upperFirst";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Hooks
import useAuth from "hooks/useAuth";

// Context
import usePopup from "hooks/usePopup";

//  Components
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import StepWrap from "components/MImportStep/StepWrap";
import TableDataExcel from "./TableDataExcel";
import TemplateSelect from "views/ZaloView/components/ImportExcelZns/TemplateSelect";
import { MImportFileButton, MButton } from "components/Buttons";
import { MDateTimeMobilePicker } from "components/Pickers";
import FormControlLabel from "@mui/material/FormControlLabel";

// @Types
import { FormValuesProps } from "components/Popups/FormPopup";

// Assets
import vi from "locales/vi.json";

// Constants & Utils
import { TypeHandle, message } from "views/ZaloView/constants";
import { isVietnamesePhoneNumber, toSimplest } from "utils/stringsUtil";
import { statusNotification, TYPE_FORM_FIELD } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParams } from "utils/formatParamsUtil";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";

// ---------------------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const ImportExcelZns = (props: Props) => {
  const { watch, setValue, reset, control } = props;
  const { user: userLogin } = useAuth();
  const { dataExcel, name, objKeyPhone, zaloOa, template, scheduledTime, dataTable, validateType } =
    watch();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const { closePopup, setNotifications } = usePopup();

  const handleChangeDataExcel = (data: [string][]) => {
    const header = data[0];
    const body = tail(data);

    const columns = map(header, (item) => {
      return {
        label: item,
        value: item,
      };
    });

    const newDataExcel = map(body, (item) => {
      return header.reduce((prevObj, current, index) => {
        return {
          ...prevObj,
          [current]: item[index] || "",
        };
      }, {});
    });

    if (!Object.keys(objKeyPhone).length) {
      setValue("objKeyPhone", columns[0]);
    }

    setValue("dataExcel", newDataExcel);
    setValue("columns", columns);
  };

  const handleBackStepTwo = () => {
    reset();
    setActiveStep(activeStep - 1);
  };

  const convertLabel = (value: string) => {
    return upperFirst(value.replace("_", " "));
  };

  const validateData = () => {
    // Validate value empty
    const isEmpty = some(dataTable, (item) => Object.values(item).includes(""));

    if (isEmpty) {
      setNotifications({
        message: "Vui lòng nhập thông tin chỗ trống",
        variant: statusNotification.WARNING,
      });

      return false;
    }

    // Validate số điện thoại
    const isValidPhone = every(dataTable, (item) =>
      isVietnamesePhoneNumber(toSimplest(item?.phone))
    );

    if (!isValidPhone) {
      setNotifications({
        message: "Vui lòng nhập số điện thoại đúng",
        variant: statusNotification.WARNING,
      });

      return false;
    }

    // Validate date
    const keyValueDate = validateType[TYPE_FORM_FIELD.DATE];

    if (keyValueDate) {
      const isValidDate = some(
        dataTable,
        (item) => !/^\d{2}([/])\d{1,2}\1\d{2,4}$/.test(item[keyValueDate])
      );

      if (isValidDate) {
        setNotifications({
          message: `Vui lòng nhập cột ${keyValueDate} theo dạng dd/MM/yyyy`,
          variant: statusNotification.WARNING,
        });

        return false;
      }
    }

    // Validate number
    const keyValueNumber = validateType[TYPE_FORM_FIELD.NUMBER];
    if (keyValueNumber) {
      const isValidNumber = some(dataTable, (item) => /[#,./ ]/.test(item[keyValueNumber]));

      if (isValidNumber) {
        setNotifications({
          message: `Vui lòng nhập cột ${convertLabel(keyValueNumber)} không chứa kí tự đặc biệt`,
          variant: statusNotification.WARNING,
        });

        return false;
      }
    }

    return true;
  };

  const handleFinishImportExcel = async () => {
    if (!validateData()) {
      return;
    }

    const newTemplateData = map(dataTable, (item) => {
      return {
        phone:
          getObjectPropSafely(() => item.phone[0]) === "0"
            ? "84" + tail(item.phone).join("")
            : item.phone,
        content: item[validateType[TYPE_FORM_FIELD.NUMBER]]
          ? {
              ...omit(item, ["stt", "phone"]),
              [validateType[TYPE_FORM_FIELD.NUMBER]]: +item[validateType[TYPE_FORM_FIELD.NUMBER]],
            }
          : omit(item, ["stt", "phone"]),
      };
    });

    const params = {
      name,
      created_by: userLogin?.id,
      oa_id: getObjectPropSafely(() => zaloOa.oa_id),
      template_id: getObjectPropSafely(() => template.template_id),
      send_data: newTemplateData,
      scheduled_time: getObjectPropSafely(() => scheduledTime.isScheduledTime)
        ? getObjectPropSafely(() => scheduledTime.time.toISOString())
        : "",
    };

    const newParams = handleParams(params);

    setLoading(true);

    const result: any = await zaloApi.create(newParams, "send-request-zns/");

    if (result && result.data) {
      setNotifications({
        message: message[TypeHandle.SEND_ZNS].OPERATION_SUCCESS,
        variant: statusNotification.SUCCESS,
      });

      setLoading(false);
      closePopup();
    } else {
      const { error = {} } = result;

      if (error.name) {
        setNotifications({
          message: "Tên đã tồn tại",
          variant: statusNotification.ERROR,
        });
      } else {
        setNotifications({
          message: message[TypeHandle.SEND_ZNS].OPERATION_FAILED,
          variant: statusNotification.ERROR,
        });
      }

      setLoading(false);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <StepWrap activeStep={activeStep} index={0} title={vi.upload_file}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <MImportFileButton handleImportFile={handleChangeDataExcel} />
            </Grid>
            {dataExcel.length ? (
              <Grid item xs={12} md={12}>
                <MButton sx={{ mt: 2 }} onClick={() => setActiveStep(activeStep + 1)}>
                  {vi.continue}
                </MButton>
              </Grid>
            ) : null}
          </Grid>
        </StepWrap>
        <StepWrap activeStep={activeStep} index={1} title={vi.select_template}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <TemplateSelect {...props} />
            </Grid>
            <Grid item container xs={12} md={12} columnGap={2}>
              <MButton
                sx={{ mt: 2 }}
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={!name}
              >
                {vi.continue}
              </MButton>
              <MButton sx={{ mt: 2 }} variant="outlined" onClick={handleBackStepTwo}>
                {vi.back}
              </MButton>
            </Grid>
          </Grid>
        </StepWrap>
        <StepWrap activeStep={activeStep} index={2} title={vi.check_data}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <TableDataExcel {...props} />
            </Grid>
            <Grid item xs={12} md={12} sx={{ pt: 4, pb: 2 }}>
              <Controller
                name="scheduledTime"
                control={control}
                render={({ field }) => {
                  const {
                    value: { time, isScheduledTime },
                    onChange,
                  } = field;

                  return (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isScheduledTime}
                            onChange={(e) =>
                              onChange({
                                ...field.value,
                                isScheduledTime: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Lên lịch gửi"
                        sx={{ width: 150 }}
                      />
                      {isScheduledTime ? (
                        <MDateTimeMobilePicker
                          onChange={(date: Date) => onChange({ ...field.value, time: date })}
                          label="Thời gian hẹn để gửi"
                          value={time ? (new Date(time) as any) : null}
                          sx={{ mt: 2 }}
                        />
                      ) : null}
                    </>
                  );
                }}
              />
            </Grid>
            <Grid item container xs={12} md={12} columnGap={2}>
              <MButton sx={{ mt: 2 }} onClick={handleFinishImportExcel} isLoading={isLoading}>
                {vi.finish}
              </MButton>
              <MButton
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                {vi.back}
              </MButton>
            </Grid>
          </Grid>
        </StepWrap>
      </Stepper>
    </Box>
  );
};

export default ImportExcelZns;
