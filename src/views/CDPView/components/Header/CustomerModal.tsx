//components
import FormDialog from "components/Dialogs/FormDialog";
import TextField from "@mui/material/TextField";
import { MultiSelect } from "components/Selectors";
import Grid from "@mui/material/Grid";

//utils
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import vi from "locales/vi.json";
import { PHONE_REGEX } from "constants/index";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import map from "lodash/map";

//hooks
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import useIsMountedRef from "hooks/useIsMountedRef";

//types
import { AddressType, DistrictType, ProvinceType, WardType } from "_types_/AddressType";
import { CustomerType } from "_types_/CustomerType";

//apis
import { customerApi } from "_apis_/customer.api";
import { addressApi } from "_apis_/address.api";

export type OrderCustomerFormType = Omit<Partial<CustomerType>, "shipping_addresses"> & {
  address: {
    provinceId?: string;
    districtId?: string;
    wardId?: string;
    street?: string;
    is_default?: boolean;
  };
};
interface Props {
  open?: boolean;
  setOpen: (isShow: boolean) => void;
  onReloadCustomer?: (id: string) => void;
  customer?: Partial<CustomerType>;
}

const schema = yup.object().shape({
  full_name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
  phone: yup.string().trim().required(VALIDATION_MESSAGE.REQUIRE_PHONE).matches(PHONE_REGEX, {
    message: VALIDATION_MESSAGE.FORMAT_PHONE,
  }),
  address: yup.object({
    provinceId: yup.string(),
    districtId: yup.string().when("provinceId", {
      is: (provincesId: string) => !!provincesId,
      then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
    }),
    wardId: yup.string().when("provinceId", {
      is: (provincesId: string) => !!provincesId,
      then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
    }),
    street: yup.string().when("provinceId", {
      is: (provincesId: string) => !!provincesId,
      then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
    }),
  }),
});

const CustomerModal = ({ open, setOpen, onReloadCustomer, customer }: Props) => {
  const isMounted = useIsMountedRef();
  const [addresses, setAddresses] = useState<{
    provinces: ProvinceType[];
    districts: DistrictType[];
    wards: WardType[];
  }>({ provinces: [], districts: [], wards: [] });

  const getProvinces = useCallback(async () => {
    const result = await addressApi.get<ProvinceType>({
      params: { limit: 100, page: 1 },
      endpoint: "provinces/",
    });

    if (result?.data) {
      isMounted.current && setAddresses((prev) => ({ ...prev, provinces: result.data?.results }));
    }
  }, [isMounted]);

  const {
    setValue,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm<Partial<OrderCustomerFormType>>({
    resolver: yupResolver(schema),
  });
  const { full_name, phone, address, id } = watch();

  const getDistrict = async (province_id: string) => {
    const result = await addressApi.get<DistrictType>({
      endpoint: "districts/",
      params: {
        province_id,
        limit: 100,
        page: 1,
      },
    });
    if (result?.data) {
      setAddresses((prev) => ({ ...prev, districts: result.data?.results }));
    }
  };
  const getWard = async (district_id: string) => {
    const result = await addressApi.get<WardType>({
      endpoint: "wards/",
      params: {
        district_id,
        limit: 100,
        page: 1,
      },
    });
    if (result?.data) {
      setAddresses((prev) => ({ ...prev, wards: result.data?.results }));
    }
  };

  const handleChangeProvince = async (value: string) => {
    setValue(
      "address",
      {
        ...address,
        provinceId: value.toString(),
        districtId: undefined,
        wardId: undefined,
      },
      { shouldValidate: true }
    );

    setAddresses((prev) => ({ ...prev, districts: [], wards: [] }));
    await getDistrict(value);
  };

  const handleChangeDistrict = async (value: string) => {
    setValue(
      "address",
      { ...address, districtId: value.toString(), wardId: undefined },
      { shouldValidate: true }
    );
    setAddresses((prev) => ({ ...prev, wards: [] }));
    await getWard(value);
  };

  const handleAddCustomer = async (form: OrderCustomerFormType) => {
    const { phone, full_name } = form;
    const result = await customerApi.create({
      endpoint: "",
      params: {
        // ! form nhận vào tên customer bằng trường full_name và update bằng trường full_name
        last_name: full_name,
        first_name: "",
        phone,
      },
    });
    if (result?.data) {
      handleCreateLocation({ ...form, id: result?.data?.id, is_default: true });
    }
  };

  const handleUpdateCustomer = async (form: OrderCustomerFormType) => {
    if (customer?.id) {
      const { full_name, phone, address } = form;

      const result = await customerApi.update({
        endpoint: `${customer.id}/`,
        params: {
          customer_address: address.wardId
            ? {
                street: address?.street,
                location: address?.wardId,
                // customer: customer.id,
              }
            : undefined,
          customer_phone: phone,
          customer_name: full_name,
        },
      });
      if (result?.data) {
        // handleCreateLocation({ ...form, id: customer.id, is_default: false });
        onReloadCustomer && onReloadCustomer(id || "");
        setOpen(false);
      }
    }
  };

  const handleCreateLocation = async (form: OrderCustomerFormType & { is_default: boolean }) => {
    const {
      address: { street, wardId: location },
      is_default,
      id,
    } = form;
    if (location) {
      const createLocationRequest = await addressApi.create<AddressType>(
        { street, is_default, location, customer: id },
        "address/"
      );

      if (createLocationRequest.data) {
        onReloadCustomer && onReloadCustomer(id || "");
        setOpen(false);
      }
    } else {
      onReloadCustomer && onReloadCustomer(id || "");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      reset(customer);
    } else {
      clearErrors();
    }
  }, [customer, open, clearErrors, reset]);

  useEffect(() => {
    open && getProvinces();
  }, [open, getProvinces]);

  const buttonSubmitLabel = customer?.id ? "Cập nhật" : "Thêm";
  const formTitle = customer?.id ? "Cập nhật khách hàng" : "Thêm khách hàng";

  return (
    <FormDialog
      title={formTitle}
      open={!!open}
      buttonText={buttonSubmitLabel}
      isLoadingButton={isSubmitting}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit(customer?.id ? handleUpdateCustomer : handleAddCustomer)}
      maxWidth="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={vi.name}
            value={full_name || ""}
            onChange={(e) => setValue("full_name", e.target.value, { shouldValidate: true })}
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={vi.phone}
            value={phone || ""}
            onChange={(e) => setValue("phone", e.target.value, { shouldValidate: true })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={vi.address}
            value={address?.street || ""}
            onChange={(e) =>
              setValue("address", { ...address, street: e.target.value }, { shouldValidate: true })
            }
            error={!!errors.address?.street}
            helperText={errors.address?.street?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(addresses.provinces, (item) => ({
              value: item.code,
              label: item.label,
            }))}
            outlined
            size="medium"
            fullWidth
            title={vi.province}
            defaultValue={address?.provinceId || ""}
            onChange={handleChangeProvince}
            error={!!errors.address?.provinceId}
            simpleSelect
            selectorId="province-id-selector"
            helperText={errors.address?.provinceId?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(addresses.districts, (item) => ({ value: item.code, label: item.label }))}
            outlined
            size="medium"
            fullWidth
            title={vi.district}
            defaultValue={address?.districtId || ""}
            onChange={handleChangeDistrict}
            error={!!errors.address?.districtId}
            simpleSelect
            selectorId="district-id-selector"
            helperText={errors.address?.districtId?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(addresses.wards, (item) => ({ value: item.code, label: item.label }))}
            outlined
            size="medium"
            fullWidth
            title={vi.ward}
            defaultValue={address?.wardId || ""}
            onChange={(value) =>
              setValue(
                "address",
                { ...address, wardId: value.toString() },
                { shouldValidate: true }
              )
            }
            error={!!errors.address?.wardId}
            simpleSelect
            selectorId="ward-id-selector"
            helperText={errors.address?.wardId?.message}
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
};

export default CustomerModal;
