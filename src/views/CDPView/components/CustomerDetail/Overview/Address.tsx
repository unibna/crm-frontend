import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import vi from "locales/vi.json";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { DistrictType, ProvinceType, WardType } from "_types_/AddressType";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { addressApi } from "_apis_/address.api";
import { MultiSelect } from "components/Selectors";
import map from "lodash/map";
import { TextField } from "@mui/material";

interface Props {
  addressDefault?: string;
  wardDefault?: WardType;
}

const Address = ({ addressDefault, wardDefault }: Props) => {
  const [districts, setDistrict] = useState<DistrictType[]>([]);
  const [wards, setWards] = useState<WardType[]>([]);
  const [address, setAddress] = useState<{
    address?: string;
    wardId?: number;
    districtId?: number;
    provinceId?: number;
  }>({});

  const [provinces, setProvinces] = useState<ProvinceType[]>([]);

  const getProvinces = async () => {
    const result = await addressApi.get<ProvinceType>({
      params: { limit: 100, page: 1 },
      endpoint: "provinces/",
    });

    if (result.data) {
      setProvinces(result.data.results);
    }
  };

  useEffect(() => {
    getProvinces();
  }, []);

  const getDistrict = useCallback(async () => {
    if (address.provinceId) {
      const result = await addressApi.get<DistrictType>({
        endpoint: "districts/",
        params: { limit: 100, page: 1, provinceId: address.provinceId },
      });
      if (result.data) {
        setDistrict(result.data.results);
      }
    }
  }, [address.provinceId]);

  const getWard = useCallback(async () => {
    if (address.districtId) {
      const result = await addressApi.get<WardType>({
        endpoint: "wards/",
        params: { limit: 100, page: 1, districtId: address.districtId },
      });
      if (result.data) {
        setWards(result.data.results);
      }
    }
  }, [address.districtId]);

  useEffect(() => {
    getDistrict();
  }, [getDistrict]);

  useEffect(() => {
    getWard();
  }, [getWard]);

  useLayoutEffect(() => {
    setAddress({
      address: addressDefault,
      districtId: wardDefault?.district,
      provinceId: wardDefault?.province,
      wardId: wardDefault?.id,
    });
  }, [wardDefault, addressDefault]);

  return (
    <>
      <Grid item xs={12}>
        <ItemLine direction={"row"}>
          <LabelStyle>{vi.address}:</LabelStyle>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4} lg={12} xl={4}>
              <MultiSelect
                simpleSelect
                fullWidth
                outlined
                style={addressSelectorStyle}
                title={vi.province}
                onChange={(province) => {}}
                options={map(provinces, (pr) => ({ label: pr.label, value: pr.id }))}
                selectorId="province-selector"
              />
            </Grid>
            <Grid item xs={12} md={4} lg={12} xl={4}>
              <MultiSelect
                simpleSelect
                fullWidth
                outlined
                style={addressSelectorStyle}
                title={vi.district}
                onChange={(district) => {}}
                options={map(districts, (dt) => ({ label: dt.label, value: dt.id }))}
                selectorId="province-selector"
              />
            </Grid>
            <Grid item xs={12} md={4} lg={12} xl={4}>
              <MultiSelect
                simpleSelect
                fullWidth
                outlined
                style={addressSelectorStyle}
                title={vi.ward}
                onChange={(ward) => {}}
                options={map(wards, (w) => ({ label: w.label, value: w.id }))}
                selectorId="province-selector"
              />
            </Grid>
          </Grid>
        </ItemLine>
      </Grid>
      <Grid item xs={12} pl={10.5} style={addressStringStyle}>
        <TextField fullWidth label={vi.address_placeholder} size="small" />
      </Grid>
    </>
  );
};

export default Address;

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: 14,
  flexShrink: 0,
  marginRight: 10,
  minWidth: 65,
  color: theme.palette.text.secondary,
}));

const ItemLine = styled(Stack)({
  padding: "4px 10px",
  ".MuiTypography-root": { fontSize: 13 },
});

const addressSelectorStyle = { marginRight: 0 };

const addressStringStyle = { paddingRight: 10, marginTop: 8, marginBottom: 8 };
