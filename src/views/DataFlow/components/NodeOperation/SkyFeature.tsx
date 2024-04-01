// Libraries
import { map, reduce } from "lodash";
import { useMemo } from "react";
import { Controller } from "react-hook-form";

// Context
import { useAppSelector } from "hooks/reduxHook";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import { getAllAttributesDataFlow, getAllFilterContentId } from "selectors/attributes";
import { leadStore } from "store/redux/leads/slice";
import { userStore } from "store/redux/users/slice";

// Components
import { Stack, TextField } from "@mui/material";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import { MultiSelect } from "components/Selectors";

// Types
import { OperationProps, ProviderFilter } from "views/DataFlow/components/NodeOperation";
import { CONTENT_TYPE, CREDENTIAL_TYPE } from "_types_/DataFlowType";

// Contants & Utils
import { ROLE_TAB } from "constants/rolesTab";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  OPTION_GET_FIELD,
  OPTION_SOURCE_GET_DATA,
  OPTION_TYPE_REPORT_REVENUE,
  TYPE_DATA,
  VALUE_ARRAY_IN_FILTER,
  convertFilterSkyFeature,
  checkValueReg,
} from "views/DataFlow/constants";
import { TYPE_FORM_FIELD } from "constants/index";

// -----------------------------------------------------------

const OperationSkyFeature = (props: OperationProps) => {
  const { control, watch, setValue } = props;
  const valueNode = watch();
  const leadSlice = useAppSelector(leadStore);
  const userSlice = useAppSelector(userStore);
  const attributesDataFlow = useAppSelector((state) => getAllAttributesDataFlow(state.attributes));
  const filterContentId = useAppSelector((state) => getAllFilterContentId(state.attributes));

  useDidUpdateEffect(() => {
    if (valueNode.url) {
      let filter: Partial<any> = {
        limit: 30,
        ...valueNode.filter,
      };

      if (valueNode.url === TYPE_DATA[ROLE_TAB.REPORT_REVENUE]) {
        filter = {
          dimension: OPTION_TYPE_REPORT_REVENUE[0].value,
          ...filter,
        };
      }

      setValue("static_data", {
        ...valueNode.static_data,
        filterArray: VALUE_ARRAY_IN_FILTER[valueNode.url],
      });
      setValue("filter", filter);
    }
  }, [valueNode.url]);

  const headerFilterChannel = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.channel.length)
      ? map(leadSlice.attributes.channel, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterProduct = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.product.length)
      ? map(leadSlice.attributes.product, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterFanpage = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.fanpage.length)
      ? map(leadSlice.attributes.fanpage, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterBadDataReason = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.bad_data_reason.length)
      ? map(leadSlice.attributes.bad_data_reason, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterFailReason = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.fail_reason.length)
      ? map(leadSlice.attributes.bad_data_reason, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterDataStatus = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.data_status.length)
      ? map(leadSlice.attributes.data_status, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterCreatedBy = useMemo(() => {
    return getObjectPropSafely(() => userSlice.leaderAndTelesaleUsers)
      ? map(userSlice.leaderAndTelesaleUsers, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const headerFilterTelesale = useMemo(() => {
    return getObjectPropSafely(() => userSlice.telesaleUsers)
      ? map(userSlice.telesaleUsers, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  return (
    <>
      <Controller
        name="get_fields"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="Loại dữ liệu"
            size="medium"
            outlined
            selectorId="get_fields"
            fullWidth
            options={OPTION_GET_FIELD}
            onChange={(value: string) => field.onChange(value)}
            error={!!error?.message}
            helperText={error?.message}
            defaultValue={field.value}
            simpleSelect
          />
        )}
      />
      <Controller
        name="credential"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="Credential"
            size="medium"
            outlined
            error={!!error?.message}
            helperText={error?.message}
            selectorId="credential"
            fullWidth
            options={attributesDataFlow[CREDENTIAL_TYPE.SKY_FEATURE]}
            onChange={(value: CONTENT_TYPE) => field.onChange(value)}
            defaultValue={field.value}
            simpleSelect
          />
        )}
      />
      <Controller
        name="url"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MultiSelect
            title="Nguồn dữ liệu"
            size="medium"
            outlined
            selectorId="url"
            fullWidth
            options={OPTION_SOURCE_GET_DATA}
            onChange={field.onChange}
            error={!!error?.message}
            helperText={error?.message}
            defaultValue={field.value}
            simpleSelect
          />
        )}
      />
      <Controller
        name="filter"
        control={control}
        render={({ field }) => (
          <Stack direction="row">
            <TextField
              size="small"
              value={field.value.limit}
              fullWidth
              label="Limit"
              sx={{ width: 300 }}
              onChange={(event) => field.onChange({ ...field.value, limit: +event.target.value })}
            />
            <HeaderFilter
              isShowContentRight={false}
              isShowSlideFilter={false}
              params={reduce(
                Object.keys(field.value),
                (prevObj, current) => ({
                  ...prevObj,
                  [current]: checkValueReg(
                    field.value[current],
                    getObjectPropSafely(() => valueNode.static_data.formatFilter[current])
                  ),
                }),
                {}
              )}
              dataRenderHeader={convertFilterSkyFeature(valueNode.url, {
                ...filterContentId,
                headerFilterChannel,
                headerFilterCreatedBy,
                headerFilterTelesale,
                headerFilterProduct,
                headerFilterFanpage,
                headerFilterBadDataReason,
                headerFilterFailReason,
                headerFilterDataStatus,
              })}
              columns={{
                columnsShow: [],
                resultColumnsShow: [],
              }}
              handleFilter={(paramsProps: Partial<any>) => {
                field.onChange({ ...field.value, ...paramsProps });
              }}
              providerFilter={(
                children: JSX.Element,
                type: TYPE_FORM_FIELD,
                objKey: Partial<any>
              ) => {
                const fieldKey =
                  type === TYPE_FORM_FIELD.DATE
                    ? [objKey.keyDateTo, objKey.keyDateFrom, objKey.keyDateValue]
                    : [objKey.key];

                return (
                  <ProviderFilter {...props} fieldKeyChild={fieldKey} field={field}>
                    {children}
                  </ProviderFilter>
                );
              }}
              style={{ my: 0, pt: 0, pb: 0 }}
            />
          </Stack>
        )}
      />
    </>
  );
};

export default OperationSkyFeature;
