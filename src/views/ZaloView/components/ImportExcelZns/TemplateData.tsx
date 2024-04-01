// Libraries
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import map from "lodash/map";
import forEach from "lodash/forEach";
import upperFirst from "lodash/upperFirst";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Components
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

// Constants & Utils
import { TemplateDataRender } from "_types_/ZaloType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// ----------------------------------------------------------------

export function SkeletonTemplateData() {
  return (
    <>
      <Skeleton width="100%" height={560} variant="rectangular" sx={{ borderRadius: 2 }} />
    </>
  );
}

const TemplateData = (props: any) => {
  const { control, watch, setValue } = props;
  const { template, columns, templateData } = watch();
  const { newCancelToken } = useCancelToken();
  const [dataRender, setDataRender] = useState<TemplateDataRender[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(template).length) {
      getListTemplateData({
        id: template.id,
      });
    }
  }, [template]);

  const convertLabel = (value: string) => {
    return upperFirst(value.replace("_", " "));
  };

  const getListTemplateData = async (params: Partial<unknown>) => {
    const result: any = await zaloApi.getId(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      `template/`
    );

    if (result && result.data) {
      const {
        params: { data = [] },
      } = result.data;
      let newDataRender: TemplateDataRender[] = [];
      let newTemplateData = {};
      let newValidateType = {};

      forEach(data, (item) => {
        newDataRender.push({
          type: item.type,
          name: item.name,
          value: columns[0],
          label: convertLabel(item.name),
          placeholder: `Chọn ${convertLabel(item.name)}`,
          required: item.require,
        });

        newValidateType = {
          ...newValidateType,
          [item.type]: item.name,
        };

        newTemplateData = {
          ...newTemplateData,
          [item.name]: templateData[item.name] || columns[0],
        };
      });

      setValue("templateData", {
        ...newTemplateData,
      });
      setValue("validateType", {
        ...newValidateType,
      });
      setDataRender(newDataRender);
    }

    setLoading(false);
  };

  const renderHtml = () => {
    if (dataRender.length) {
      return map(dataRender, (item) => {
        return (
          <Controller
            name="templateData"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="asynchronous-demo-ffff"
                value={getObjectPropSafely(() => field.value[item.name]) || item.value || ""}
                fullWidth
                isOptionEqualToValue={(option, value) => value.value === option.value}
                getOptionLabel={(option) => option.label}
                options={columns}
                onChange={(event, newValue) =>
                  field.onChange({ ...templateData, [item.name]: newValue })
                }
                sx={{ zIndex: 1303 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={item.placeholder}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                  />
                )}
              />
            )}
          />
        );
      });
    }

    return;
  };

  return (
    <Stack spacing={3}>
      {isLoading && <SkeletonTemplateData />}
      {!isLoading && renderHtml()}
    </Stack>
  );
};

export default TemplateData;
