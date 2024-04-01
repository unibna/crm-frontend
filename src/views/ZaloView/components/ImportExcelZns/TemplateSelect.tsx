// Libraries
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import { UseFormReturn } from "react-hook-form";

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
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TemplateData, {
  SkeletonTemplateData,
} from "views/ZaloView/components/ImportExcelZns/TemplateData";
import TemplateItem from "views/ZaloView/components/ContentZns/TemplateItem";

// -------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const TemplateSelect = (props: Props) => {
  const { control, setValue, watch } = props;
  const { newCancelToken } = useCancelToken();
  const [dataOaZalo, setDataOaZalo] = useState<SelectOptionType[]>([]);
  const [isLoadingOa, setLoadingOa] = useState(false);
  const [isLoadingTemplate, setLoadingTemplate] = useState(false);
  const [dataTemplate, setDataTemplate] = useState<TemplateItemType[]>([]);

  const { zaloOa, template, columns } = watch();

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

  return (
    <Card sx={{ p: 3 }}>
      <Grid container spacing={2}>
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
                options={columns}
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
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={7} md={6}>
          {isLoadingTemplate && <SkeletonTemplateData />}
          {!isLoadingTemplate && (
            <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden", position: "relative" }}>
              <TemplateItem item={template} avatar={zaloOa?.avatar || ""} {...props} />
            </Box>
          )}
        </Grid>
        <Grid item xs={5} md={6}>
          <TemplateData {...props} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default TemplateSelect;
