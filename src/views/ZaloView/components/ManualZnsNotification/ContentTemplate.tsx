// Libraries
import { useEffect, useState, useContext, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import map from "lodash/map";
import upperFirst from "lodash/upperFirst";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FormValuesProps } from "components/Popups/FormPopup";
import { SkeletonTemplateData } from "views/ZaloView/components/ImportExcelZns/TemplateData";
import TemplateItem from "views/ZaloView/components/ContentZns/TemplateItem";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// ---------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const ContentTemplateZns = (props: Props) => {
  const { watch, control, setValue } = props;
  const { newCancelToken } = useCancelToken();
  const { template, templateId, templateData } = watch();

  // State
  const [isLoadingTemplate, setLoadingTemplate] = useState(false);

  // Store
  const { state: store } = useContext(ZaloContext);
  const { oaFilter } = store;

  useEffect(() => {
    if (templateId) {
      getListTemplate({
        id: templateId,
      });
    }
  }, [templateId, newCancelToken]);

  const getListTemplate = async (params: any) => {
    setLoadingTemplate(true);

    const result: any = await zaloApi.getId(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      `template/`
    );

    if (result && result.data) {
      const { data } = result;

      setValue("template", data);
    }

    setLoadingTemplate(false);
  };

  const convertLabel = (value: string) => {
    return upperFirst(value.replace("_", " "));
  };

  const dataRender = useMemo(() => {
    if (Object.keys(templateData).length) {
      const arrKeysTemplateData = Object.keys(templateData);
      return map(arrKeysTemplateData, (item) => ({
        name: item,
        label: convertLabel(item),
      }));
    }

    return [];
  }, [templateData]);

  const renderHtml = () => {
    if (dataRender.length) {
      return map(dataRender, (item) => {
        return (
          <Controller
            name="templateData"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  value={getObjectPropSafely(() => field.value[item.name]) || ""}
                  disabled
                  fullWidth
                  label={item.label}
                />
              );
            }}
          />
        );
      });
    }

    return;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={7} md={6}>
        {isLoadingTemplate && <SkeletonTemplateData />}
        {!isLoadingTemplate && (
          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <TemplateItem
              item={template}
              avatar={oaFilter?.avatar || getObjectPropSafely(() => template.zalo_oa.avatar) || ""}
              {...props}
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={5} md={6}>
        <Stack spacing={3}>{renderHtml()}</Stack>
      </Grid>
    </Grid>
  );
};

export default ContentTemplateZns;
