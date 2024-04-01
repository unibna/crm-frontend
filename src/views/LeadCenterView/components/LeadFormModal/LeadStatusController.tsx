import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Grid, Paper, styled } from "@mui/material";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { customerApi } from "_apis_/customer.api";
import { AttributeType } from "_types_/AttributeType";
import { CustomerType } from "_types_/CustomerType";
import { OrderFormType, OrderType } from "_types_/OrderType";
import { PhoneLeadType } from "_types_/PhoneLeadType";
import { MultiSelect } from "components/Selectors";
import { NULL_OPTION } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import vi from "locales/vi.json";
import map from "lodash/map";
import { useCallback, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { dispatch } from "store";
import { leadStore } from "store/redux/leads/slice";
import { toastError, toastWarning } from "store/redux/toast/slice";
import { isReadAndWriteRole } from "utils/roleUtils";
import { filterIsShowOptions } from "utils/selectOptionUtil";
import { isVietnamesePhoneNumber } from "utils/stringsUtil";
import {
  BAD_DATA_OPTION,
  FINAL_LEAD_STATUS_OPTIONS,
  LEAD_STATUS,
  LEAD_TABS,
} from "views/LeadCenterView/constants";
import FormOrderModal from "views/OrderView/components/FormOrderModal";
import OrderNumberField from "./OrderNumberField";

const SYSTEM_CRM = "(system) CRM";

const LeadStatusController = ({
  values,
  handleChange,
  channel,
  customer,
  errors,
  tabName,
}: {
  values?: Partial<PhoneLeadType>;
  handleChange: (value: any, name?: keyof PhoneLeadType) => void;
  phoneInit?: { phone?: string; name?: string };
  channel?: AttributeType;
  customer?: Partial<CustomerType>;
  errors?: FieldErrors<PhoneLeadType>;
  tabName?: string;
}) => {
  const leadSlice = useAppSelector(leadStore);
  const { user } = useAuth();
  const [isCalled, setIsCalled] = useState(false);
  const [data, setData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderValue, setOrderValue] = useState<Partial<OrderFormType>>();
  const [isShowOrderModal, setIsShowOrderModal] = useState(false);
  const [orderCustomer, setOrderCustomer] = useState<Partial<CustomerType>>(); // customer phục vụ cho order form

  const handleCreateOrderSuccess = async (order: Partial<OrderFormType>) => {
    setOrderValue(order);
    handleChange(order.order_key, "order_information");
  };

  const handleCloseOrderDrawer = () => {
    setIsShowOrderModal(false);
  };

  // const getOrder = async (textInput: string) => {
  //   setLoading(true);
  //   const result = await orderApi.get<OrderType>({
  //     params: {
  //       limit: 200,
  //       page: 1,
  //       search: textInput,
  //     },
  //     endpoint: "get/all/",
  //   });
  //   if (result.data) {
  //     setData(result.data.results);
  //   }
  //   setLoading(false);
  // };

  const getCustomer = useCallback(async () => {
    if (!customer?.id && values?.phone && isVietnamesePhoneNumber(values?.phone)) {
      setLoading(true);
      const result = await customerApi.get({
        endpoint: "search-es/",
        params: { limit: 1, page: 1, search: values?.phone },
      });
      if (result.data) {
        //sau khi có thông tin customer thì mở drawer order và truyền thông tin customer vào order form
        setOrderCustomer(result.data.results[0]);
      }
      setLoading(false);
    }
  }, [values?.phone, customer?.id]);

  const handleAddOrder = () => {
    if (errors?.phone || errors?.name) {
      dispatch(toastError({ message: "Vui lòng kiểm tra tên và số điện thoại khách hàng" }));
    } else if (!orderCustomer) {
      dispatch(toastWarning({ message: "Vui lòng tạo số hoặc tạo khách hàng trước khi thêm đơn" }));
    } else if (orderCustomer && values?.phone !== orderCustomer?.phone) {
      dispatch(
        toastWarning({
          message: "Thông tin khách hàng đã bị sửa đổi vui lòng chọn khách hàng từ danh sách",
        })
      );
    } else {
      setIsShowOrderModal(true);
    }
  };

  useEffect(() => {
    if (customer?.id) {
      setOrderCustomer(customer);
    }
  }, [customer]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  const isHandleLeadItem =
    isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
    ) || values?.handle_by === user?.id
      ? true
      : false;

  const shippingAddress = orderCustomer?.shipping_addresses?.find((item) => item.is_default);
  const handleReasonOptions = [
    NULL_OPTION,
    ...filterIsShowOptions(leadSlice.attributes.handle_reason),
  ];

  const leadStatusOptions = FINAL_LEAD_STATUS_OPTIONS.concat(
    channel?.name === SYSTEM_CRM ? [] : [BAD_DATA_OPTION]
  );
  const spamDisabled = tabName === LEAD_TABS.SPAM;

  return (
    <>
      {isHandleLeadItem ? (
        <Box component={Paper} style={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}>
          <Grid container alignItems="center">
            <GridFieldWrap item xs={12}>
              <MultiSelect
                options={[NULL_OPTION, ...filterIsShowOptions(leadSlice.attributes.handle_reason)]}
                label="handle_reason"
                outlined
                simpleSelect
                defaultValue={values?.handle_reason || ""}
                title={vi.handle_reason}
                fullWidth
                selectorId="phone-lead-handle_reason"
                onChange={(value) => {
                  handleChange(value, "handle_reason");
                  const getHandleReasonItem = handleReasonOptions.find(
                    (item) => item.value.toString() === value.toString()
                  );
                  if (getHandleReasonItem?.label === "Hẹn gọi lại") {
                    handleChange(true, "is_require_call_later_at");
                  } else {
                    handleChange(false, "is_require_call_later_at");
                  }
                }}
                disabled={spamDisabled}
              />
            </GridFieldWrap>
            <CallTimeWrap>
              {isCalled ? (
                <div>
                  <FieldLabel>{vi.call_time}</FieldLabel>
                  <CallTimeLabel>
                    {vi.handle_time} {values?.handle_status}
                  </CallTimeLabel>
                </div>
              ) : (
                <Button
                  variant="contained"
                  disabled={spamDisabled}
                  sx={{ bgcolor: "error.main" }}
                  onClick={() => {
                    values?.handle_status
                      ? handleChange(values.handle_status + 1, "handle_status")
                      : handleChange(1, "handle_status");
                    setIsCalled(true);
                  }}
                >
                  {vi.called}
                </Button>
              )}
            </CallTimeWrap>
            <Collapse in={isCalled} timeout="auto" unmountOnExit style={{ width: "100%" }}>
              <FormControl component="fieldset" aria-label="hello">
                <FieldLabel style={{ marginLeft: 10 }}>{vi.lead_status}</FieldLabel>
                <LeadRadio
                  name="lead_status"
                  value={values?.lead_status || ""}
                  onChange={(e) => handleChange(e.target.value, "lead_status")}
                >
                  {map(leadStatusOptions, (status) => (
                    <FormControlLabel
                      key={status.value}
                      value={status?.value?.toString()}
                      control={<Radio />}
                      label={status.label}
                    />
                  ))}
                </LeadRadio>
              </FormControl>
              {values?.lead_status === LEAD_STATUS.HAS_ORDER && (
                <GridFieldWrap item xs={12}>
                  <Stack direction="row">
                    <OrderNumberField
                      label={vi.order_id}
                      onChange={(value) => handleChange(value, "order_information")}
                      value={values?.order_information || ""}
                      // disabled
                      error={!!errors?.order_information}
                      helperText={errors?.order_information?.message}
                      size="small"
                    />
                    {/* <MAsyncAutocomplete
                      label="Nhập mã đơn hàng"
                      loading={loading}
                      data={data}
                      onLoadData={getOrder}
                      defaultValue={orderValue}
                      onSelect={handleCreateOrderSuccess}
                      getOptionLabel={(option: OrderType) =>
                        `${option.order_key} - ${option.customer_name} - ${option.customer_phone}`
                      }
                      isOptionEqualToValue={(option: OrderType) => !!option.order_key}
                    /> */}
                    <Box>
                      <FormOrderModal
                        open={isShowOrderModal}
                        onClose={handleCloseOrderDrawer}
                        onApplyChanges={handleCreateOrderSuccess}
                        submitText={vi.button.create}
                        defaultValue={{
                          source: channel,
                          status: "draft",
                          customer: orderCustomer || {
                            phone: values.phone,
                            full_name: values.name,
                          },
                          customer_name: values.name,
                          shipping_address: shippingAddress,
                          payment: {
                            total_actual: 0,
                            payment_status: "PENDING",
                          },
                          name: "",
                          line_items: [],
                          note: "",
                          total_actual: 0,
                          is_available_shipping: false,
                        }}
                        directionAfterAlternatived={false}
                      />
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        style={{ width: 125, marginLeft: 4, height: 40 }}
                        onClick={handleAddOrder}
                        loading={loading}
                      >
                        Thêm đơn
                      </LoadingButton>
                    </Box>
                  </Stack>
                </GridFieldWrap>
              )}

              {/*  Nếu như is_considering (6) hoặc no_order (5) thì show field lý do  */}
              {values?.lead_status === LEAD_STATUS.NO_ORDER && (
                <GridFieldWrap item xs={12}>
                  <MultiSelect
                    options={[
                      NULL_OPTION,
                      ...filterIsShowOptions(leadSlice.attributes.fail_reason),
                    ]}
                    label="fail_reason"
                    outlined
                    simpleSelect
                    defaultValue={values?.fail_reason || "none"}
                    title={vi.order_fail_status}
                    fullWidth
                    selectorId="phone-lead-fail_reason"
                    onChange={(value) => handleChange(value, "fail_reason")}
                  />
                </GridFieldWrap>
              )}
              {values?.lead_status === "7" && (
                <GridFieldWrap item xs={12}>
                  <MultiSelect
                    options={[
                      NULL_OPTION,
                      ...filterIsShowOptions(leadSlice.attributes.bad_data_reason),
                    ]}
                    label="bad_data_reason"
                    outlined
                    simpleSelect
                    defaultValue={values?.bad_data_reason || "none"}
                    title={vi.reason_bad_data}
                    fullWidth
                    selectorId="phone-lead-bad_data_reason"
                    onChange={(value) => handleChange(value, "bad_data_reason")}
                  />
                </GridFieldWrap>
              )}
            </Collapse>
          </Grid>
        </Box>
      ) : null}
    </>
  );
};

export default LeadStatusController;

const GridFieldWrap = styled(Grid)`
  padding: 10px;
  div {
    margin: 0px;
  }
`;

const LeadRadio = styled(RadioGroup)`
  display: inline-block !important;
  margin-left: 10px;
`;

const FieldLabel = styled("label")({
  fontSize: "14px !important",
  marginTop: 10,
});

const CallTimeWrap = styled(Grid)({
  padding: 10,
  width: 200,
});

const CallTimeLabel = styled("h4")({
  margin: 10,
  marginLeft: 0,
  height: 18,
  color: "#ff8e66",
});
