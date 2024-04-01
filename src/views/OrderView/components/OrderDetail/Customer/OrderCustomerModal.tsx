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
import { CUSTOMER_MODAL_ACTION } from ".";

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
import { isVietnamesePhoneNumber } from "utils/stringsUtil";
import { orderApi } from "_apis_/order.api";

export type OrderCustomerFormType = Omit<Partial<CustomerType>, "shipping_addresses"> & {
  address: Partial<AddressType>;
  formType: CUSTOMER_MODAL_ACTION;
};
export interface OrderCustomerProps {
  open?: CUSTOMER_MODAL_ACTION;
  setOpen: (isShow: boolean) => void;
  onReloadCustomer: (id: string) => void;
  customer?: Partial<CustomerType>;
  orderID?: string;
}

const schema = yup.object().shape({
  formType: yup.string(),
  full_name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
  phone: yup.string().trim().required(VALIDATION_MESSAGE.REQUIRE_PHONE).matches(PHONE_REGEX, {
    message: VALIDATION_MESSAGE.FORMAT_PHONE,
  }),
  address: yup
    .object({
      location: yup.object({
        province_id: yup.string(),
        district_id: yup.string().when("provinces_id", {
          is: (provinces_id: string) => !!provinces_id,
          then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
        }),
        ward_id: yup.string().when("provinces_id", {
          is: (provinces_id: string) => !!provinces_id,
          then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
        }),
      }),
      street: yup.string().when("location", {
        is: (location: {
          district?: string;
          province?: string;
          ward?: string;
          district_id?: string;
          province_id?: string;
          ward_id?: string;
          code?: string;
        }) => !!location?.province_id,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
      }),
    })
    .when("formType", {
      is: (formType: CUSTOMER_MODAL_ACTION) =>
        formType === "create_address" || formType === "update_customer",
      then: yup
        .object({
          location: yup.object({
            province_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PROVINCE),
            district_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
            ward_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
          }),
          street: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ADDRESS).trim(),
        })
        .required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
    }),
});

const OrderCustomerModal = ({
  open,
  setOpen,
  onReloadCustomer,
  customer,
  orderID,
}: OrderCustomerProps) => {
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
    defaultValues: { formType: open },
  });
  const { full_name, phone, address, id } = watch();

  const getDistrict = useCallback(async () => {
    if (address?.location?.province_id) {
      const result = await addressApi.get<DistrictType>({
        endpoint: "districts/",
        params: {
          province_id: address?.location?.province_id,
          limit: 100,
          page: 1,
        },
      });
      if (result?.data) {
        setAddresses((prev) => ({ ...prev, districts: result.data?.results }));
      }
    }
  }, [address?.location?.province_id]);

  const getWard = useCallback(async () => {
    if (address?.location?.district_id) {
      const result = await addressApi.get<WardType>({
        endpoint: "wards/",
        params: {
          district_id: address?.location?.district_id,
          limit: 100,
          page: 1,
        },
      });
      if (result?.data) {
        setAddresses((prev) => ({ ...prev, wards: result.data?.results }));
      }
    }
  }, [address?.location?.district_id]);

  const handleChangeProvince = async (value: string) => {
    setValue(
      "address",
      {
        ...address,
        location: {
          province_id: value.toString(),
          district_id: undefined,
          ward_id: undefined,
        },
      },
      { shouldValidate: true }
    );

    setAddresses((prev) => ({ ...prev, districts: [], wards: [] }));
  };

  const handleChangeDistrict = async (value: string) => {
    setValue(
      "address",
      {
        ...address,
        location: { ...address?.location, district_id: value.toString(), ward_id: undefined },
      },
      { shouldValidate: true }
    );
    setAddresses((prev) => ({ ...prev, wards: [] }));
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

      const result = await orderApi.update({
        endpoint: `${orderID}/customer/infomation/`,
        params: {
          customer_address: address.location?.ward_id
            ? {
                street: address?.street,
                location: address?.location?.ward_id,
                // customer: customer.id,
              }
            : undefined,
          customer_phone: phone,
          customer_name: full_name,
        },
      });
      if (result?.data) {
        // handleCreateLocation({ ...form, id: customer.id, is_default: false });
        onReloadCustomer(id || "");
        setOpen(false);
      }
    }
  };

  const handleCreateLocation = async (form: OrderCustomerFormType & { is_default: boolean }) => {
    const {
      address: { street, location },
      is_default,
      id,
    } = form;
    if (location) {
      const createLocationRequest = await addressApi.create<AddressType>(
        { street, is_default, location: location.ward_id, customer: id },
        "address/"
      );

      if (createLocationRequest.data) {
        onReloadCustomer(id || "");
        setOpen(false);
      }
    } else {
      onReloadCustomer(id || "");
      setOpen(false);
    }
  };

  const handleUpdateLocation = async (form: OrderCustomerFormType) => {
    const {
      address: { street, location },
      id,
    } = form;
    if (location) {
      const createLocationRequest = await addressApi.update<AddressType>({
        params: { street, location: location.ward_id },
        endpoint: `address/${address?.id}/`,
      });

      if (createLocationRequest.data) {
        onReloadCustomer(id || "");
        setOpen(false);
      }
    } else {
      onReloadCustomer(id || "");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? { ...customer, full_name: customer.full_name, formType: open }
          : { formType: open }
      );
    } else {
      clearErrors();
    }
  }, [customer, open, clearErrors, reset]);

  useEffect(() => {
    open && getProvinces();
  }, [open, getProvinces]);

  useEffect(() => {
    getDistrict();
  }, [getDistrict]);

  useEffect(() => {
    getWard();
  }, [getWard]);

  const buttonSubmitLabel =
    open === "create_customer"
      ? "Thêm"
      : open === "update_customer" || open === "update_address"
      ? "Cập nhật"
      : "Thêm địa chỉ";
  const formTitle =
    open === "create_customer"
      ? "Thêm khách hàng"
      : open === "update_customer"
      ? "Cập nhật khách hàng"
      : open === "update_address"
      ? "Cập nhật địa chỉ"
      : "Thêm địa chỉ";

  return (
    <FormDialog
      title={formTitle}
      open={!!open}
      buttonText={buttonSubmitLabel}
      isLoadingButton={isSubmitting}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit((form: OrderCustomerFormType) => {
        open === "create_customer"
          ? handleAddCustomer(form)
          : open === "update_customer"
          ? handleUpdateCustomer(form)
          : open === "create_address"
          ? handleCreateLocation({ ...form, is_default: id ? false : true, id })
          : handleUpdateLocation(form);
      })}
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
            disabled={open === "create_address" || open === "update_address"}
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
            disabled={
              isVietnamesePhoneNumber(customer?.phone || "") ||
              open === "create_address" ||
              open === "update_address"
            }
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
            defaultValue={address?.location?.province_id || ""}
            onChange={handleChangeProvince}
            error={!!errors.address?.location?.province_id}
            simpleSelect
            selectorId="province-id-selector"
            helperText={errors.address?.location?.province_id?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(addresses.districts, (item) => ({ value: item.code, label: item.label }))}
            outlined
            size="medium"
            fullWidth
            title={vi.district}
            defaultValue={address?.location?.district_id || ""}
            onChange={handleChangeDistrict}
            error={!!errors.address?.location?.district_id}
            simpleSelect
            selectorId="district-id-selector"
            helperText={errors.address?.location?.district_id?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MultiSelect
            options={map(addresses.wards, (item) => ({ value: item.code, label: item.label }))}
            outlined
            size="medium"
            fullWidth
            title={vi.ward}
            defaultValue={address?.location?.ward_id || ""}
            onChange={(value) =>
              setValue(
                "address",
                { ...address, location: { ...address?.location, ward_id: value.toString() } },
                { shouldValidate: true }
              )
            }
            error={!!errors.address?.location?.ward_id}
            simpleSelect
            selectorId="ward-id-selector"
            helperText={errors.address?.location?.ward_id?.message}
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
};

export default OrderCustomerModal;
