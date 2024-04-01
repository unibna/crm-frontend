// Libraries
import { useEffect, useState } from "react";
import { FormValuesProps } from "components/Popups/FormPopup";
import { Controller, UseFormReturn } from "react-hook-form";
import map from "lodash/map";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import { RHFTextField } from "components/HookFormFields";
import { MButton } from "components/Buttons";
import { MultiSelect } from "components/Selectors";
import StepWrap from "components/MImportStep/StepWrap";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import vi from "locales/vi.json";

interface Props extends UseFormReturn<FormValuesProps, object> {
  listCustomer: SelectOptionType[];
  params: Partial<any>;
  submitPopup: any;
}

const ContentConversion = (props: Props) => {
  const { control, watch, setValue } = props;
  const { customer, name } = watch();
  const [listConversion, setListConversion] = useState<SelectOptionType[]>([]);
  const [isLoadingConversion, setLoadingConversion] = useState(false);

  useEffect(() => {
    if (customer) {
      getListConversion({
        customer_id: customer,
        name_like: name,
      });
    }
  }, []);

  const getListConversion = async (params: any) => {
    setLoadingConversion(true);
    const result = await reportMarketing.get(params, "google/conversion-actions/");

    if (result && result.data) {
      const newData = map(result.data, (item) => ({
        label: item.name,
        value: item.id,
      }));

      setListConversion(newData || []);
      setValue(
        "conversion",
        getObjectPropSafely(() => newData[0].value)
      );
      setLoadingConversion(false);
    }
  };

  return (
    <Grid item xs={12}>
      <Controller
        name="conversion"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            zIndex={1303}
            title="Chọn conversion"
            size="medium"
            outlined
            fullWidth
            error={!!error?.message}
            helperText={error?.message}
            selectorId="conversion"
            options={listConversion}
            onChange={(value: any) => field.onChange(value)}
            defaultValue={field.value || ""}
            simpleSelect
            isLoading={isLoadingConversion}
            isShowLoading
            required
          />
        )}
      />
    </Grid>
  );
};

const ContentUploadPhone = (props: Props) => {
  const { control, listCustomer = [], watch, params: paramsProps } = props;
  const { customer, conversion } = watch();
  const [isLoadingUpload, setLoadingUpload] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState("");

  const handleBackStepTwo = () => {
    setActiveStep(activeStep - 1);
  };

  const handleUpload = async () => {
    setLoadingUpload(true);

    const params = {
      customer_id: customer,
      conversion_action_id: conversion,
      ...paramsProps,
    };

    const result: any = await reportMarketing.get(params, "google/click-converions/upload/");

    if (result && result.data) {
      setData(JSON.stringify(result.data) || "");

      setLoadingUpload(false);
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <StepWrap activeStep={activeStep} index={0} title="Chọn customer và nhập name">
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item lg={12} sm={12} xs={12}>
              <RHFTextField name="name" label="Name" placeholder="Nhập name" />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="customer"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <MultiSelect
                    zIndex={1303}
                    title="Chọn customer"
                    size="medium"
                    outlined
                    fullWidth
                    error={!!error?.message}
                    helperText={error?.message}
                    selectorId="customer"
                    options={listCustomer}
                    onChange={(value: any) => field.onChange(value)}
                    defaultValue={field.value || ""}
                    simpleSelect
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <MButton
                disabled={!customer}
                sx={{ mt: 2 }}
                onClick={() => setActiveStep(activeStep + 1)}
              >
                {vi.continue}
              </MButton>
            </Grid>
          </Grid>
        </StepWrap>
        <StepWrap activeStep={activeStep} index={1} title="Chọn conversion">
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <ContentConversion {...props} />
            <Grid item container xs={12} md={12} columnGap={2}>
              <MButton sx={{ mt: 2 }} onClick={handleUpload} isLoading={isLoadingUpload}>
                {vi.finish}
              </MButton>
              <MButton sx={{ mt: 2 }} variant="outlined" onClick={handleBackStepTwo}>
                {vi.back}
              </MButton>
            </Grid>
          </Grid>
        </StepWrap>
        <StepWrap activeStep={activeStep} index={2} title="Kết quả">
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Card sx={{ p: 3 }}>{data}</Card>
          </Grid>
        </StepWrap>
      </Stepper>
    </Box>
  );
};

export default ContentUploadPhone;
