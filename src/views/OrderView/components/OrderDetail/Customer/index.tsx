import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { addressApi } from "_apis_/address.api";
import { customerApi } from "_apis_/customer.api";
import { AddressType } from "_types_/AddressType";
import { CustomerType } from "_types_/CustomerType";
import { OrderFormType, OrderStatusValue } from "_types_/OrderType";
import vi from "locales/vi.json";
import { NoDataPanel } from "components/DDataGrid/components";
import { MTextLine } from "components/Labels";
import { MButton } from "components/Buttons";
import { PhoneCDPDrawer } from "components/Drawers";
import { Section, TitleGroup, TitleSection } from "components/Labels";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import isValid from "date-fns/isValid";
import useAuth from "hooks/useAuth";
import useIsMountedRef from "hooks/useIsMountedRef";
import map from "lodash/map";
import omit from "lodash/omit";
import React, { memo, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { fDate } from "utils/dateUtil";
import { fNumber } from "utils/formatNumber";
import { isReadAndWriteRole } from "utils/roleUtils";
import { isVietnamesePhoneNumber } from "utils/stringsUtil";
import RankField from "views/CDPView/components/CustomerDetail/Overview/RankField";
import OrderCustomerAutocomplete from "./OrderCustomerAutocomplete";
import OrderCustomerModal, { OrderCustomerProps } from "./OrderCustomerModal";

export interface CustomerProps
  extends Pick<OrderFormType, "customer" | "customer_name" | "customer_phone" | "shipping_address">,
    Pick<OrderCustomerProps, "orderID"> {
  onChange: <T extends keyof OrderFormType>(key: T, value: OrderFormType[T]) => void;
  errors: FieldErrors<OrderFormType>;
  disabledSearch?: boolean;
  disabledChange?: boolean;
  onChangeShippingAddress: (value?: AddressType) => void;
  loading?: boolean;
  defaultStatus?: OrderStatusValue;
  creatorID?: string;
  is_ecommerce_source?: boolean;
}

export type CUSTOMER_MODAL_ACTION =
  | "create_customer"
  | "update_customer"
  | "create_address"
  | "update_address";

const LoadingSkeleton = () => {
  return (
    <Stack alignItems="center" width="100%" spacing={1}>
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={40} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={40} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={40} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={60} />
      <Skeleton width="100%" style={{ transform: "scale(1)" }} height={60} />
    </Stack>
  );
};

const Customer = ({
  errors,
  onChange,
  customer,
  shipping_address,
  disabledChange,
  disabledSearch,
  onChangeShippingAddress,
  loading,
  customer_name,
  customer_phone,
  defaultStatus,
  orderID,
  is_ecommerce_source,
  creatorID,
}: CustomerProps) => {
  const { user } = useAuth();
  const isMounted = useIsMountedRef();
  const [customerModal, setCustomerModal] = useState<{
    customer?: Partial<CustomerType>;
    open?: CUSTOMER_MODAL_ACTION;
  }>({ customer: undefined, open: undefined });

  const handleUpdateDefaultAddressCustomer = async (addressProps: AddressType) => {
    const updateAddRes = await addressApi.update({
      endpoint: `address/${addressProps.id}/`,
      params: {
        ...omit(addressProps, ["id"]),
        location: addressProps.location?.code,
        is_default: true,
      },
    });

    if (updateAddRes?.data) {
      getCustomer(customerModal.customer?.id || "");
    }
  };

  const handleChangeShippingAddress = (addressID: string) => {
    const address = customer?.shipping_addresses?.find((item) => item.id === addressID);
    onChangeShippingAddress(address);
  };

  useEffect(() => {
    if (customer) {
      isMounted.current && setCustomerModal({ customer, open: undefined });
    }
  }, [customer, setCustomerModal, isMounted]);

  const handleUpdateCustomer = async <T extends keyof CustomerType>(
    key: T,
    value: Partial<CustomerType>[T]
  ) => {
    const custtomerRes = await customerApi.update({
      endpoint: `${customer?.id}/`,
      params: {
        [key]: value,
      },
    });

    if (custtomerRes.data) {
      onChange("customer", custtomerRes.data);
    }
  };

  function validateBirthday(date: string) {
    var birthday = new Date(date);

    if (!isValid(birthday)) {
      handleUpdateCustomer("birthday", null);
      return;
    } else {
      handleUpdateCustomer(
        "birthday",
        fDate(date, yyyy_MM_dd) ? fDate(date, yyyy_MM_dd)?.toString() : null
      );
      return;
    }
  }

  const handleChangeCustomer = (customer: Partial<CustomerType>) => {
    onChange("customer", customer);
    onChange("customer_name", customer.customer_name || "");
    onChange("customer_phone", customer.phone || "");
    const addressFirst = customer?.shipping_addresses?.[0];
    if (customer?.shipping_addresses?.length === 1) {
      onChangeShippingAddress(addressFirst);
    } else if (customer?.shipping_addresses?.length || 0 >= 1) {
      const addressDefault = customer?.shipping_addresses?.find((item) => item.is_default === true);
      if (addressDefault) {
        onChangeShippingAddress(addressDefault);
      } else {
        onChangeShippingAddress(addressFirst);
      }
    } else {
      onChangeShippingAddress(undefined);
    }
  };

  const handleUpdateAddress =
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => (address: AddressType) => {
      e.preventDefault();
      setCustomerModal((prev) => ({
        ...prev,
        customer: { ...customer, address },
        open: "update_address",
      }));
    };

  const getCustomer = async (customerID: string) => {
    const customerRes = await customerApi.getById({
      endpoint: `${customerID}/`,
    });
    if (customerRes.data) {
      handleChangeCustomer({ ...customerRes.data, customer_name: customerRes.data?.full_name });
    }
  };

  // chỉnh sửa khi được set quyền hoặc là người tạo Order
  const isControl =
    isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
    ) || user?.id === creatorID;

  return (
    <Section elevation={3}>
      <OrderCustomerModal
        open={customerModal.open}
        setOpen={(open) => setCustomerModal((prev) => ({ ...prev, open: undefined }))}
        onReloadCustomer={getCustomer}
        customer={customerModal.open === "create_customer" ? undefined : customerModal.customer}
        orderID={orderID}
      />
      <Stack direction="row" display={"flex"} flex={1} alignItems="center">
        <TitleSection style={{ display: "flex", flex: 1 }}>{vi.customer.customer}</TitleSection>
        {defaultStatus !== "completed" && (
          <MButton
            style={{ fontSize: 13, padding: 2 }}
            onClick={() =>
              setCustomerModal((prev) => ({ ...prev, customer, open: "create_customer" }))
            }
          >
            Thêm KH
          </MButton>
        )}
      </Stack>
      <Divider sx={{ my: 1 }} />
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Stack direction="column" spacing={2} sx={{ pt: 1 }}>
          <OrderCustomerAutocomplete
            onChange={({ name, phone }) => {
              setCustomerModal((prev) => ({ ...prev, phone, full_name: name || "" }));
            }}
            onSelected={(customer) => {
              handleChangeCustomer({
                ...customer,
                id: customer.id,
                customer_name: customer.full_name,
              });
            }}
            error={!!errors.customer?.id}
            helperText={errors.customer?.id?.message}
            label={vi.phone_number}
            defaultValue={customerModal.customer || {}}
            required
            size="small"
            disabled={disabledSearch}
          />
          <Stack direction="column" spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <TitleGroup>Thông tin KH</TitleGroup>
              {is_ecommerce_source &&
                isControl &&
                !isVietnamesePhoneNumber(customer?.phone || "") &&
                customer?.id && (
                  <MButton
                    // disabled={disabledAddress}
                    style={{ minWidth: 96, fontSize: 13, padding: 2 }}
                    onClick={() =>
                      setCustomerModal((prev) => ({ ...prev, customer, open: "update_customer" }))
                    }
                  >
                    Cập nhật KH
                  </MButton>
                )}
            </Stack>
            <MTextLine
              label="Số điện thoại:"
              value={
                customer?.phone ? (
                  <PhoneCDPDrawer
                    phone={customer_phone || customer?.phone}
                    onRefresh={(customer) =>
                      handleChangeCustomer({ ...customer, customer_name: customer.full_name })
                    }
                  />
                ) : (
                  "---"
                )
              }
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
            <MTextLine
              label="Tên:"
              value={
                <TextField
                  size="small"
                  fullWidth
                  value={customer_name || ""}
                  onChange={(e) => onChange("customer_name", e.target.value)}
                  disabled={disabledChange}
                  error={!!errors.customer_name}
                  helperText={errors.customer_name?.message}
                />
              }
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
            <MTextLine
              label="Ngày sinh:"
              value={
                <Typography fontSize={13}>
                  {customer?.birthday ? fDate(customer?.birthday) : "---"}
                </Typography>
              }
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
          </Stack>
          <Stack direction="column" spacing={1}>
            <TitleGroup>Lịch sử mua hàng</TitleGroup>
            <MTextLine
              label="Hạng:"
              value={<RankField value={customer?.ranking} />}
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
            <MTextLine
              label="Ngày mua gần nhất:"
              value={fDate(customer?.last_order_date) || "---"}
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
            <MTextLine
              label="Số đơn TC:"
              value={fNumber(customer?.shipping_completed_order)}
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
            <MTextLine
              label="Số tiền đơn giao TC:"
              value={fNumber(customer?.shipping_completed_spent)}
              valueStyle={styles.textStyle}
              labelStyle={styles.textStyle}
              displayType="grid"
            />
          </Stack>

          <Stack
            direction="row"
            sx={{ width: "100%", mt: 2 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <TitleGroup>Địa chỉ giao hàng</TitleGroup>
            {!disabledChange && (
              <MButton
                disabled={!customer?.id}
                onClick={() =>
                  setCustomerModal((prev) => ({ ...prev, customer, open: "create_address" }))
                }
                style={{ fontSize: 13, padding: 2, paddingLeft: 8, paddingRight: 8 }}
              >
                Thêm địa chỉ
              </MButton>
            )}
          </Stack>
          {customer?.id ? (
            <>
              {errors.is_available_shipping && (
                <FormHelperText error={!!errors.is_available_shipping}>
                  {errors.is_available_shipping?.message}
                </FormHelperText>
              )}
              {errors.shipping_address && (
                <FormHelperText error={!!errors.shipping_address}>
                  {errors.shipping_address?.id?.message}
                </FormHelperText>
              )}
            </>
          ) : errors.customer?.id ? (
            <FormHelperText error>{errors.customer.id.message}</FormHelperText>
          ) : (
            <NoDataPanel message="Vui lòng chọn khách hàng" wrapImageStyles={{ maxHeight: 100 }} />
          )}
          <Box sx={{ px: 1, maxHeight: 480, overflow: "auto" }}>
            {map(customer?.shipping_addresses, (item, idx) => {
              return (
                <Stack spacing={0.5} direction="column" key={item.id} sx={{ mb: 2 }}>
                  <FormControlLabel
                    sx={{
                      ".MuiTypography-root": {
                        fontSize: 13,
                      },
                      color: item.is_default ? "primary.main" : "unset",
                    }}
                    key={item.id}
                    value={item.id?.toString()}
                    control={
                      <Radio
                        // disabled={disabledAddress}
                        checked={shipping_address?.id?.toString() === item.id?.toString()}
                        onChange={(e) => handleChangeShippingAddress(e.target.value)}
                      />
                    }
                    label={
                      <Typography
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                        onClick={(e) => handleUpdateAddress(e)(item)}
                        fontSize={13}
                      >
                        {item.address || item.street || ""}
                      </Typography>
                    }
                  />
                  {!item.is_default && (
                    <Typography
                      color="secondary"
                      fontSize={12}
                      textAlign="end"
                      style={styles.addressItemDefaultLabel}
                      onClick={() => handleUpdateDefaultAddressCustomer(item)}
                    >
                      Đặt làm mặc định
                    </Typography>
                  )}
                </Stack>
              );
            })}
          </Box>
        </Stack>
      )}
    </Section>
  );
};

export default memo(Customer);

const styles: { [key: string]: React.CSSProperties } = {
  wrapFullNameStyle: { position: "relative", marginBottom: 8 },
  addressItemDefaultLabel: { cursor: "pointer", marginLeft: 32, marginTop: 0 },
  editFullNameStyle: { position: "absolute", top: 0, right: 0 },
  textStyle: { fontSize: 13 },
};
