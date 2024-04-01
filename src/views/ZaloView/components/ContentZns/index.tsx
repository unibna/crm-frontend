// Libraries
import { useEffect, useState, useMemo } from "react";
import { Controller } from "react-hook-form";

import { UseFormReturn } from "react-hook-form";
import map from "lodash/map";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";
import { STATUS, TemplateItemType } from "_types_/ZaloType";
import { FormValuesProps } from "components/Popups/FormPopup";

// Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TemplateData, { SkeletonTemplateData } from "./TemplateData";
import TemplateItem from "./TemplateItem";
import { MDateTimeMobilePicker } from "components/Pickers";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {
  isShowInputPhone?: boolean;
}

const ContentZns = (props: Props) => {
  const { control, setValue, watch, isShowInputPhone = false } = props;
  const { newCancelToken } = useCancelToken();
  const [dataOaZalo, setDataOaZalo] = useState<SelectOptionType[]>([]);

  // Loading
  const [isLoadingOa, setLoadingOa] = useState(false);
  const [isLoadingTemplate, setLoadingTemplate] = useState(false);

  const [dataTemplate, setDataTemplate] = useState<TemplateItemType[]>([]);

  const { zaloOa, template, columns, objKeyPhone, phone } = watch();

  useEffect(() => {
    getListAccountOaZalo();
  }, []);

  useEffect(() => {
    if (Object.keys(zaloOa).length) {
      getListTemplate({
        zalo_oa: zaloOa.value,
        status: STATUS.ENABLE,
      });
    }
  }, [zaloOa]);

  const getListTemplate = async (params: any) => {
    setLoadingTemplate(true);

    const result: any = await zaloApi.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      `template/`
    );

    if (result && result.data) {
      const { results = [] } = result.data;

      const newData = results.map((item: any) => {
        return {
          ...item,
          label: item.template_name,
          value: item.id,
        };
      });

      setDataTemplate(newData);
      if (!Object.keys(template).length) setValue("template", newData[0]);
    }

    setLoadingTemplate(false);
  };

  const getListAccountOaZalo = async () => {
    setLoadingOa(true);
    const result = await zaloApi.get({}, "oa/");

    if (result && result.data) {
      const { results = [] } = result.data;

      const newData = results.map((item: any) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });

      setDataOaZalo(newData);
      if (!Object.keys(zaloOa).length) setValue("zaloOa", newData[0]);
    }

    setLoadingOa(false);
  };

  const arrColumnTable = useMemo(() => {
    if (getObjectPropSafely(() => columns.columnWidths)) {
      const newColumn = map(columns.columnWidths, (item) => {
        return {
          label: item.columnName,
          value: item.columnName,
        };
      });

      if (!Object.keys(objKeyPhone).length) {
        setValue("objKeyPhone", newColumn[0]);
      }

      return newColumn;
    }

    return [];
  }, []);

  return (
    <Card sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {isShowInputPhone ? (
          <Grid item container xs={12}>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  label="Số điện thoại"
                  required
                />
              )}
            />
          </Grid>
        ) : null}
        <Grid item container xs={6}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
                fullWidth
                label="Tên chiến dịch"
                required
              />
            )}
          />
        </Grid>
        <Grid item container xs={6}>
          <Controller
            name="zaloOa"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="asynchronous-demo-ffff"
                value={field.value}
                fullWidth
                isOptionEqualToValue={(option, value) => value.value === option.value}
                getOptionLabel={(option) => option.label}
                options={dataOaZalo}
                onChange={(event, newValue) => field.onChange(newValue)}
                sx={{ zIndex: 1303 }}
                loading={isLoadingOa}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn OA"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingOa ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>
        {arrColumnTable.length ? (
          <>
            <Grid item container xs={6}>
              <Controller
                name="template"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    id="asynchronous-demo-ffff"
                    value={field.value}
                    fullWidth
                    isOptionEqualToValue={(option, value) => value.value === option.value}
                    getOptionLabel={(option) => option.label}
                    options={dataTemplate}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    sx={{ zIndex: 1303 }}
                    loading={isLoadingTemplate}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn template"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingTemplate ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item container xs={6}>
              <Controller
                name="objKeyPhone"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    id="asynchronous-demo-ffff"
                    value={field.value}
                    fullWidth
                    isOptionEqualToValue={(option, value) => value.value === option.value}
                    getOptionLabel={(option) => option.label}
                    options={arrColumnTable}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    sx={{ zIndex: 1303 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn cột số điện thoại"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <>{params.InputProps.endAdornment}</>,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </>
        ) : (
          <Grid item container xs={12}>
            <Controller
              name="template"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="asynchronous-demo-ffff"
                  value={field.value}
                  fullWidth
                  isOptionEqualToValue={(option, value) => value.value === option.value}
                  getOptionLabel={(option) => option.label}
                  options={dataTemplate}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  sx={{ zIndex: 1303 }}
                  loading={isLoadingTemplate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn template"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingTemplate ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={7} md={7}>
          {isLoadingTemplate && <SkeletonTemplateData />}
          {!isLoadingTemplate && (
            <Box
              sx={{
                width: 450,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <TemplateItem item={template} avatar={zaloOa?.avatar || ""} {...props} />
            </Box>
          )}
        </Grid>
        <Grid item xs={5} md={5}>
          <TemplateData {...props} />
        </Grid>
      </Grid>
      <Grid container xs={12} md={12} sx={{ pt: 4, pb: 2, width: "100%" }}>
        <Controller
          name="scheduledTime"
          control={control}
          render={({ field }) => {
            const {
              value: { time, isScheduledTime },
              onChange,
            } = field;

            return (
              <Stack sx={{ width: "100%" }}>
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
              </Stack>
            );
          }}
        />
      </Grid>
    </Card>
  );
};

export default ContentZns;
