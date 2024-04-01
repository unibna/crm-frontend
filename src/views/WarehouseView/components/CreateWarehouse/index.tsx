// Libraries
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import map from "lodash/map";

// Services
import { addressApi } from "_apis_/address.api";

// Components
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { RHFTextField } from "components/HookFormFields";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { MultiSelect } from "components/Selectors";

// @Types
import { FormValuesProps } from "components/Popups/FormPopup";
import { SelectOptionType } from "_types_/SelectOptionType";

// -------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const CreateWarehouse = (props: Props) => {
  const { control, watch } = props;
  const { province, district } = watch();

  // State
  const [isLoadingProvince, setLoadingProvince] = useState(false);
  const [listProvince, setListProvince] = useState<SelectOptionType[] | []>([]);
  const [isLoadingDistrict, setLoadingDistrict] = useState(false);
  const [listDistrict, setListDistrict] = useState<SelectOptionType[] | []>([]);
  const [isLoadingWard, setLoadingWard] = useState(false);
  const [listWard, setListWard] = useState<SelectOptionType[] | []>([]);

  useEffect(() => {
    getListProvince();
  }, []);

  useEffect(() => {
    if (province) {
      getListDistrict({
        province_id: province,
        limit: 500,
      });
    }
  }, [province]);

  useEffect(() => {
    if (province && district) {
      getListWard({
        province_id: province,
        district_id: district,
        limit: 500,
      });
    }
  }, [district, province]);

  const getListProvince = async () => {
    setLoadingProvince(true);
    const result = await addressApi.get({
      endpoint: "provinces/",
      params: {
        limit: 100,
      },
    });

    if (result && result.data) {
      const { results = [] } = result.data;

      const newData = map(results, (item: any) => {
        return {
          label: item.label,
          value: item.code,
        };
      });

      setListProvince(newData);
    }

    setLoadingProvince(false);
  };

  const getListDistrict = async (params: any) => {
    setLoadingDistrict(true);
    const result = await addressApi.get({
      endpoint: "districts/",
      params,
    });

    if (result && result.data) {
      const { results = [] } = result.data;

      const newData = map(results, (item: any) => {
        return {
          label: item.label,
          value: item.code,
        };
      });

      setListDistrict(newData);
    }

    setLoadingDistrict(false);
  };

  const getListWard = async (params: any) => {
    setLoadingWard(true);
    const result = await addressApi.get({
      endpoint: "wards/",
      params,
    });

    if (result && result.data) {
      const { results = [] } = result.data;

      const newData = map(results, (item: any) => {
        return {
          label: item.label,
          value: item.code,
        };
      });

      setListWard(newData);
    }

    setLoadingWard(false);
  };

  return (
    <Grid container spacing={2} rowGap={2}>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField name="name" label="Kho" placeholder="Nhập tên kho" required />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField
          name="manager_phone"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại kho"
          required
          InputProps={{
            endAdornment: (
              <Tooltip title="Số điện thoại để bên giao hàng gọi" placement="right-end">
                <InputAdornment position="start">
                  <ContactSupportIcon fontSize="small" />
                </InputAdornment>
              </Tooltip>
            ),
          }}
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField
          name="manager_name"
          label="Quản lí kho"
          placeholder="Nhập quản lí kho"
          required
        />
      </Grid>
      <Grid item lg={6} sm={6} xs={6}>
        <RHFTextField name="description" label="Mô tả" placeholder="Nhập mô tả" />
      </Grid>
      <Grid item container xs={12} spacing={3}>
        <Grid item xs={12}>
          <Typography>Địa chỉ:</Typography>
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="address" label="Số nhà, đường" placeholder="Nhập" required />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <MultiSelect
                zIndex={1303}
                style={{ width: "100%" }}
                title="Chọn tỉnh"
                size="medium"
                outlined
                fullWidth
                selectorId="province"
                options={listProvince}
                onChange={(value: any) => field.onChange(value)}
                defaultValue={field.value || ""}
                simpleSelect
                isLoading={isLoadingProvince}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <MultiSelect
                zIndex={1303}
                style={{ width: "100%" }}
                title="Chọn quận/huyện"
                size="medium"
                outlined
                fullWidth
                selectorId="district"
                options={listDistrict}
                onChange={(value: any) => field.onChange(value)}
                defaultValue={field.value || ""}
                simpleSelect
                isLoading={isLoadingDistrict}
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="ward"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                zIndex={1303}
                style={{ width: "100%" }}
                title="Chọn phường/xã"
                size="medium"
                outlined
                fullWidth
                selectorId="ward"
                error={!!error?.message}
                helperText={error?.message}
                options={listWard}
                onChange={(value: any) => field.onChange(value)}
                defaultValue={field.value || ""}
                simpleSelect
                isLoading={isLoadingWard}
                required
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateWarehouse;
