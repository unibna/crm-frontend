// Libraries
import { useEffect, useState } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import some from "lodash/some";
import find from "lodash/find";

// Services
import { shippingApi } from "_apis_/shipping.api";

// Hooks
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesShipping } from "selectors/attributes";

// Components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";
import Iconify from "components/Icons/Iconify";
import { GHNPickingShift, SHIPPING_COMPANIES } from "_types_/GHNType";
import { SelectOptionType } from "_types_/SelectOptionType";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  CHECK_PRODUCT_OPTIONSGhn,
  CHECK_PRODUCT_OPTIONSVnPost,
  optionPickupType,
  SHIPPING_VEHICEL_OPTIONS,
} from "views/ShippingView/constants";
import { InputNumber } from "components/Fields";

// ------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const Information = (props: Props) => {
  const { watch, control, setValue, setError } = props;
  const { deliveryCompany } = useAppSelector((state) => getAllAttributesShipping(state.attributes));
  const [optionShift, setOptionShift] = useState<SelectOptionType[]>([]);
  const [isLoadingShift, setLoadingShift] = useState(false);

  const { informationShip, shippingCompanies } = watch();

  useEffect(() => {
    if (some(shippingCompanies, (item) => item.type === SHIPPING_COMPANIES.GHN)) {
      const deliveryGhn: any = find(
        deliveryCompany,
        (item) => item.type === SHIPPING_COMPANIES.GHN
      );

      if (getObjectPropSafely(() => deliveryGhn.ghn_token)) {
        getPickingShift(deliveryGhn.ghn_token);
      }
    }
  }, []);

  const getPickingShift = async (token: string) => {
    setLoadingShift(true);
    const result = await shippingApi.getMulti<GHNPickingShift>({
      endpoint: "/v2/shift/date",
      token,
    });
    if (result?.data) {
      const { data = [] } = result.data;
      const newOption = map(data, (item) => ({
        ...item,
        value: item.id,
        label: item.title,
      }));

      setOptionShift(newOption);
      if (!informationShip.pickShift) {
        setValue("informationShip", {
          ...informationShip,
          pickShift: newOption[0],
        });
      }
    }

    setLoadingShift(false);
  };

  const handleSetValue = (
    field: ControllerRenderProps<FormValuesProps, "informationShip">,
    objValue: Partial<any>
  ) => {
    const { onChange, value } = field;

    onChange({
      ...value,
      ...objValue,
    });
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Vận chuyển" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    id="asynchronous-demo-ffff"
                    value={getObjectPropSafely(() => field.value["shipCompany"])}
                    fullWidth
                    isOptionEqualToValue={(option, value) => value.value === option.value}
                    getOptionLabel={(option) => option.label}
                    options={shippingCompanies}
                    onChange={(event, newValue) =>
                      field.onChange({
                        ...field.value,
                        shipCompany: newValue,
                      })
                    }
                    sx={{ zIndex: 1303 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Đơn vị vận chuyển"
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
            {getObjectPropSafely(() => informationShip.shipCompany.type) ===
            SHIPPING_COMPANIES.GHN ? (
              <Grid item xs={12} md={6}>
                <Controller
                  name="informationShip"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="asynchronous-demo-ffff"
                      value={getObjectPropSafely(() => field.value["pickShift"])}
                      fullWidth
                      isOptionEqualToValue={(option, value) => value.value === option.value}
                      getOptionLabel={(option) => option.label}
                      options={optionShift}
                      onChange={(event, newValue) => handleSetValue(field, { pickShift: newValue })}
                      sx={{ zIndex: 1303 }}
                      loading={isLoadingShift}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chọn ca lấy hàng"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingShift ? (
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
            ) : null}
            {getObjectPropSafely(() => informationShip.shipCompany.type) ===
            SHIPPING_COMPANIES.E_COMMERCE ? (
              <Grid item xs={12} md={6}>
                <Controller
                  name="informationShip"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      value={getObjectPropSafely(() => field.value["tracking_number"])}
                      label="Mã vận đơn"
                      sx={{ width: "100%" }}
                      onChange={(event) =>
                        handleSetValue(field, { tracking_number: event.target.value })
                      }
                      error={!!error?.["tracking_number"].message}
                      helperText={error?.["tracking_number"].message}
                    />
                  )}
                />
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Gói hàng" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    label="Tiền thu hộ COD"
                    value={getObjectPropSafely(() => field.value["cod"])}
                    onChange={(value) => {
                      handleSetValue(field, { cod: value });
                    }}
                    inputStyle={{
                      paddingBottom: 2,
                      paddingTop: 2,
                      fontSize: 15,
                    }}
                    type="currency"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={getObjectPropSafely(() => field.value["totalWeight"])}
                    label="Tổng khối lượng"
                    sx={{ width: "100%" }}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">gam</InputAdornment>,
                    }}
                    onChange={(event) => handleSetValue(field, { totalWeight: event.target.value })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={getObjectPropSafely(() => field.value["length"])}
                    label="Chiều dài"
                    sx={{ width: "100%" }}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">cm</InputAdornment>,
                    }}
                    onChange={(event) => handleSetValue(field, { length: event.target.value })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={getObjectPropSafely(() => field.value["width"])}
                    type="number"
                    label="Chiều rộng"
                    sx={{ width: "100%" }}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">cm</InputAdornment>,
                    }}
                    onChange={(event) => handleSetValue(field, { width: event.target.value })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={getObjectPropSafely(() => field.value["height"])}
                    type="number"
                    label="Chiều cao"
                    sx={{ width: "100%" }}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">cm</InputAdornment>,
                    }}
                    onChange={(event) => handleSetValue(field, { height: event.target.value })}
                  />
                )}
              />
            </Grid>
            {getObjectPropSafely(() => informationShip.shipCompany.type) ===
            SHIPPING_COMPANIES.GHN ? (
              <>
                <Grid item xs={12} md={12}>
                  <Controller
                    name="informationShip"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={getObjectPropSafely(() => field.value["isShowInsurance"])}
                            onChange={(e) =>
                              handleSetValue(field, { isShowInsurance: e.target.checked })
                            }
                          />
                        }
                        label="Bảo hiểm hàng hóa"
                      />
                    )}
                  />
                </Grid>
                {informationShip.isShowInsurance ? (
                  <Grid item xs={6} md={4}>
                    <Controller
                      name="informationShip"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          label="Giá trị bảo hiểm"
                          value={getObjectPropSafely(() => field.value["insurance"])}
                          onChange={(value) => {
                            handleSetValue(field, { insurance: value });
                          }}
                          inputStyle={{
                            paddingBottom: 2,
                            paddingTop: 2,
                            fontSize: 15,
                          }}
                          type="currency"
                        />
                      )}
                    />
                  </Grid>
                ) : null}
              </>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Lưu ý" />
        <CardContent>
          <Grid container spacing={2}>
            <Controller
              name="informationShip"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    {getObjectPropSafely(() => informationShip.shipCompany.type) ===
                    SHIPPING_COMPANIES.GHN
                      ? map(CHECK_PRODUCT_OPTIONSGhn, (item, index) => {
                          const isCheck =
                            item.value === getObjectPropSafely(() => field.value["checkProduct"]);

                          return (
                            <Grid item xs={12} md={4} key={index}>
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={isCheck}
                                    onChange={(event) =>
                                      handleSetValue(field, {
                                        checkProduct: item.value,
                                      })
                                    }
                                    checkedIcon={<Iconify icon={"eva:checkmark-circle-2-fill"} />}
                                  />
                                }
                                label={<Typography variant="body2">{item.label}</Typography>}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              />
                            </Grid>
                          );
                        })
                      : map(CHECK_PRODUCT_OPTIONSVnPost, (item, index) => {
                          const isCheck =
                            item.value ===
                            getObjectPropSafely(() => field.value["isPackageViewable"]);

                          return (
                            <Grid item xs={12} md={4} key={index}>
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={isCheck}
                                    onChange={(event) =>
                                      handleSetValue(field, {
                                        isPackageViewable: item.value,
                                      })
                                    }
                                    checkedIcon={<Iconify icon={"eva:checkmark-circle-2-fill"} />}
                                  />
                                }
                                label={<Typography variant="body2">{item.label}</Typography>}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              />
                            </Grid>
                          );
                        })}
                  </>
                );
              }}
            />
            {getObjectPropSafely(() => informationShip.shipCompany.type) ===
            SHIPPING_COMPANIES.GHN ? (
              <Grid item xs={12} md={8}>
                <Controller
                  name="informationShip"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="asynchronous-demo-ffff"
                      value={getObjectPropSafely(() => field.value["transType"])}
                      fullWidth
                      isOptionEqualToValue={(option, value) => value.value === option.value}
                      getOptionLabel={(option) => option.label}
                      options={SHIPPING_VEHICEL_OPTIONS}
                      onChange={(event, newValue) => handleSetValue(field, { transType: newValue })}
                      sx={{ zIndex: 1303 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Phương tiện giao hàng"
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
            ) : (
              <Grid item xs={12} md={8}>
                <Controller
                  name="informationShip"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="asynchronous-demo-ffff"
                      value={getObjectPropSafely(() => field.value["pickupType"])}
                      fullWidth
                      isOptionEqualToValue={(option, value) => value.value === option.value}
                      getOptionLabel={(option) => option.label}
                      options={optionPickupType}
                      onChange={(event, newValue) =>
                        handleSetValue(field, { pickupType: newValue })
                      }
                      sx={{ zIndex: 1303 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Hình thức thu gom"
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
            )}
            <Grid item xs={12} md={4}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={getObjectPropSafely(() => field.value["note"])}
                    label="Ghi chú"
                    sx={{ width: "100%" }}
                    onChange={(event) => handleSetValue(field, { note: event.target.value })}
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <Controller
                name="informationShip"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={getObjectPropSafely(
                      () => field.value["orderNumber"]
                    )}
                    label="Mã đơn"
                    sx={{ width: "100%" }}
                    onChange={(event) =>
                      handleSetValue(field, { orderNumber: event.target.value })
                    }
                  />
                )}
              />
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default Information;
