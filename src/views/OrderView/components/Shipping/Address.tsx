// Libraries
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import map from "lodash/map";
import { styled } from "@mui/material/styles";

// Services
import { deliveryApi } from "_apis_/delivery.api";

// Types
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { FormValuesProps } from "components/Popups/FormPopup";
import { Span } from "components/Labels";
import Iconify from "components/Icons/Iconify";

// Constants & Utils
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// -------------------------------------------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const OptionStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2.5),
  justifyContent: "space-between",
  transition: theme.transitions.create("all"),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

const Address = (props: Props) => {
  const { watch, control, setValue } = props;

  const { option, addressReceived, shippingCompanies, informationShip } = watch();

  useEffect(() => {
    if (getObjectPropSafely(() => addressReceived.location.ward_id)) {
      getListShippingCompany({
        id: getObjectPropSafely(() => addressReceived.location.ward_id),
      });
    }
  }, [addressReceived]);

  const getListShippingCompany = async (params: any) => {
    const result: any = await deliveryApi.get(params, "available_company/locations/");

    if (result?.data) {
      const { available_companies = [] } = result.data;

      const newListCompany = available_companies.length
        ? map(available_companies, (item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        : [];

      setValue("shippingCompanies", newListCompany, { shouldValidate: true });
      setValue(
        "informationShip",
        {
          ...informationShip,
          shipCompany: newListCompany[0] || null,
        },
        { shouldValidate: true }
      );
    }
  };

  return (
    <Grid>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Bên giao" />
        <CardContent>
          <Controller
            name="addressSend"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="asynchronous-demo-ffff"
                value={field.value}
                fullWidth
                isOptionEqualToValue={(option, value) => value.value === option.value}
                getOptionLabel={(option) => option.label}
                options={option.optionWarehouse}
                onChange={(event, newValue) => field.onChange(newValue)}
                sx={{ zIndex: 1303 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kho"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                  />
                )}
              />
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Bên nhận" />
        <CardContent>
          <Controller
            name="addressReceived"
            control={control}
            render={({ field }) => (
              <Grid container rowGap={2}>
                <Grid item xs={12}>
                  <OptionStyle
                    sx={{
                      boxShadow: (theme) => theme.customShadows.z20,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          checked={true}
                          checkedIcon={<Iconify icon={"eva:checkmark-circle-2-fill"} />}
                        />
                      }
                      label={
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              {getObjectPropSafely(() => field.value.address)}
                            </Typography>
                          </Box>
                          {map(shippingCompanies, (option) => (
                            <Span color="warning" sx={{ mt: 1 }}>
                              {option.label}
                            </Span>
                          ))}
                        </Box>
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        py: 2,
                      }}
                    />
                  </OptionStyle>
                </Grid>
              </Grid>
            )}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Address;
