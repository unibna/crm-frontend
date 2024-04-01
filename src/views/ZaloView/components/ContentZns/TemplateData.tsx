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
import MDatePicker from "components/Pickers/MDatePicker";

// Constants & Utils
import { TemplateDataType, TemplateDataRender } from "_types_/ZaloType";
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
  const { template } = watch();
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
    setLoading(true);

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
      let newValidateType: { [key: string]: string[] } = {};

      forEach(data, (item) => {
        newDataRender.push({
          type: item.type,
          name: item.name,
          label: convertLabel(item.name),
          placeholder: `Nhập ${convertLabel(item.name)}`,
          required: item.require,
        });

        if (newValidateType[item.type]) {
          newValidateType[item.type].push(item.name);
        } else {
          newValidateType = {
            ...newValidateType,
            [item.type]: [item.name],
          };
        }
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
        switch (item.type) {
          case TemplateDataType.NUMBER: {
            return (
              <Controller
                name="templateData"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      value={getObjectPropSafely(() => field.value[item.name]) || ""}
                      type="number"
                      fullWidth
                      label={item.label}
                      required={item.required}
                      onChange={(event) =>
                        field.onChange({
                          ...field.value,
                          [item.name]: event.target.value,
                        })
                      }
                    />
                  );
                }}
              />
            );
          }
          case TemplateDataType.STRING: {
            return (
              <Controller
                name="templateData"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      value={getObjectPropSafely(() => field.value[item.name]) || ""}
                      fullWidth
                      label={item.label}
                      required={item.required}
                      onChange={(event) =>
                        field.onChange({
                          ...field.value,
                          [item.name]: event.target.value,
                        })
                      }
                    />
                  );
                }}
              />
            );
          }
          case TemplateDataType.DATE: {
            return (
              <Controller
                name="templateData"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <MDatePicker
                      views={["day", "year", "month"]}
                      label={item.label}
                      minDate={new Date("2012-03-01")}
                      // maxDate={new Date("2025-06-01")}
                      value={getObjectPropSafely(() => field.value[item.name]) || new Date()}
                      onChangeDate={(value: Date) =>
                        field.onChange({ ...field.value, [item.name]: value })
                      }
                      error={!!error}
                      helperText={error?.message}
                    />
                  );
                }}
              />
            );
          }
          default: {
            return <></>;
          }
        }
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
