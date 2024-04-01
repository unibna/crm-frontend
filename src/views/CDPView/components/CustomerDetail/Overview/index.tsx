import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { customerApi } from "_apis_/customer.api";
import { CustomerType } from "_types_/CustomerType";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { NoDataPanel } from "components/DDataGrid/components";
import { PhoneCDPDrawer } from "components/Drawers";
import { TagInput } from "components/Fields";
import { MTextLine } from "components/Labels";
import { MultiSelect } from "components/Selectors";
import { ROLE_TAB, STATUS_ROLE_CDP } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import useIsMountedRef from "hooks/useIsMountedRef";
import vi from "locales/vi.json";
import isEqual from "lodash/isEqual";
import map from "lodash/map";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";
import { INVALID_DATE, fDate } from "utils/dateUtil";
import { fNumber } from "utils/formatNumber";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { isVietnamesePhoneNumber } from "utils/stringsUtil";
import SearchCustomerModal from "views/CDPView/components/SearchCustomerModal";
import BirthdayInput from "./BirthdayInput";
import NoteInput from "./NoteInput";
import OrderStatus from "./OrderStatus";
import RankField from "./RankField";
import SecondPhoneInput from "./SecondPhoneInput";
import SubmitButton from "./SubmitButton";

import Iconify from "components/Icons/Iconify";

interface Props {
  isMutationCustomer?: boolean;
  customer?: Partial<CustomerType>;
  setCustomer?: React.Dispatch<React.SetStateAction<Partial<CustomerType> | null>>;
  onRefreshCDPRow?: (customer: Partial<CustomerType>) => void;
  isSearchCustomer?: boolean;
  isShowTableDetail?: boolean;
  orderStatusAnalyst: {
    orders: number[];
    total: number;
  };
}

const Overview = ({
  isMutationCustomer,
  setCustomer,
  customer,
  onRefreshCDPRow,
  isSearchCustomer,
  isShowTableDetail,
  orderStatusAnalyst,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userSlice = useAppSelector(getDraftSafeSelector("users"));
  const isMounted = useIsMountedRef();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(customer);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  const staffOptions = map(userSlice.leaderAndTelesaleUsers, (item) => ({
    label: item.name,
    value: item.id,
  }));

  const getData = useCallback(async () => {
    if (customerInfo?.phone && customer?.source !== "3rd") {
      setLoading(true);
      const result = await customerApi.getById({
        params: {
          id: customerInfo?.phone,
          limit: 1,
          page: 1,
        },
        endpoint: `${customerInfo.phone}/`,
      });
      if (result.data) {
        setCustomer?.(result.data);
      } else {
        dispatch(toastError({ message: "Khách hàng chưa được tạo SĐT" }));
        setCustomer?.(null);
      }
      setLoading(false);
    }
  }, [setCustomer, customerInfo?.phone, customer?.source]);

  const handleUpdateCustomer = async () => {
    // kiểm tra số điện thoại

    if (customerInfo?.id) {
      if (
        (customerInfo.second_phone && !isVietnamesePhoneNumber(customerInfo.second_phone)) ||
        !customerInfo.full_name
      ) {
        return;
      }

      const { tags, birthday, customer_note, second_phone, full_name, customer_care_staff, id } =
        customerInfo;

      const result = await customerApi.update({
        endpoint: `${id}/`,
        params: {
          tags,
          customer_note,
          handle_by: user?.id,
          birthday,
          note: customer_note,
          second_phone,
          last_name: full_name,
          customer_care_staff: customer_care_staff?.id,
          first_name: "",
        },
      });
      if (result.data) {
        onRefreshCDPRow && onRefreshCDPRow(result.data);
        setCustomer && setCustomer({ ...customerInfo, ...result.data });
      }
    }
  };

  const address =
    customerInfo?.shipping_addresses?.find((item) => item.is_default) ||
    customerInfo?.shipping_addresses?.[0];

  const getListTags = useCallback(async (search?: string) => {
    const result = await customerApi.get<{ id: number; name: string }>({
      endpoint: "tags/",
      params: {
        limit: 1000,
        page: 1,
        search,
      },
    });
    if (result.data) {
      setTags(result.data.results);
    }
  }, []);

  const goToDetail = (value: Partial<CustomerType>) => {
    navigate(`/cdp/detail/?name=${value.full_name}&phone=${value.phone}`);
  };

  const handleChangeCustomerCareStaff = (value: string) => {
    const staff = userSlice.leaderAndTelesaleUsers.find((item) => item.id === value);
    setCustomerInfo((prev) => ({ ...prev, customer_care_staff: staff }));
  };

  useEffect(() => {
    isMounted.current && setCustomerInfo(customer);
  }, [customer, isMounted]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getListTags();
  }, [getListTags]);

  const isMatchCustomerCareStaffRole = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.CUSTOMER_CARE_STAFF]
  );
  const isMasterCustomerCareStaffRole = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.CUSTOMER_CARE_STAFF]
  );

  const isShow3rd =
    customerInfo?.full_name_3rd ||
    customerInfo?.birthday_3rd ||
    customerInfo?.address_3rd ||
    customerInfo?.facebook_id_3rd ||
    customerInfo?.modified_3rd;

  if (!customerInfo?.phone) {
    return (
      <Paper
        elevation={3}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", flex: 1, margin: 1 }}
      >
        <NoDataPanel
          message="Không có thông tin khách hàng"
          showImage
          messageStyles={{ marginBottom: 5, fontSize: 15 }}
          wrapImageStyles={{ minHeight: 410 }}
        />
      </Paper>
    );
  }

  return (
    <Stack spacing={1}>
      <Paper
        elevation={3}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", flex: 1, margin: 1 }}
      >
        {isSearchCustomer && (
          <Box mb={2}>
            <SearchCustomerModal
              onSelect={(value) => {
                goToDetail(value);
              }}
              defaultValue={customer}
            />
          </Box>
        )}
        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" height={98} />
            <Skeleton variant="rectangular" height={98} />
            <Skeleton variant="rectangular" height={98} />
          </Stack>
        ) : (
          <Stack
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
            sx={{ ".MuiGrid-root": { paddingRight: 0 } }}
          >
            <Stack>
              <Stack
                style={{
                  marginBottom: "10px",

                  borderBottom: "1px solid rgb(102 102 102 / 32%)",
                }}
                sx={{ ".MuiGrid-root": { paddingRight: 0 } }}
              >
                <MTextLine
                  label={`${vi.phone}:`}
                  value={customerInfo?.phone}
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
                <SecondPhoneInput
                  secondPhone={customerInfo?.second_phone}
                  setSecondPhone={(phone) =>
                    setCustomerInfo((prev) => ({ ...prev, second_phone: phone }))
                  }
                  sx={containerTextlineStyle}
                  disabled={!isMutationCustomer}
                />
                <MTextLine
                  label={`${vi.username}:`}
                  value={
                    <TextField
                      value={customerInfo?.full_name}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, full_name: e.target.value }))
                      }
                      fullWidth
                      disabled={!isMutationCustomer}
                      size="small"
                      error={isMutationCustomer && !customerInfo?.full_name}
                      helperText={
                        isMutationCustomer &&
                        !customerInfo?.full_name &&
                        VALIDATION_MESSAGE.REQUIRE_CUSTOMER_NAME
                      }
                    />
                  }
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
                <BirthdayInput
                  sx={containerTextlineStyle}
                  value={
                    customerInfo?.birthday ? new Date(customerInfo?.birthday).toString() : null
                  }
                  onChangeDate={(value) => {
                    const date = format(new Date(value), yyyy_MM_dd);
                    setCustomerInfo((prev) => ({
                      ...prev,
                      birthday: date !== INVALID_DATE ? date : null,
                    }));
                  }}
                  disabled={!isMutationCustomer}
                />
                {/* <Address /> */}
                <MTextLine
                  label={`${vi.address}:`}
                  value={address?.address ? address?.address : "---"}
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
              </Stack>

              {/* <Rank /> */}
              <Stack
                style={{
                  marginBottom: "10px",

                  borderBottom: "1px solid rgb(102 102 102 / 32%)",
                }}
                sx={{ ".MuiGrid-root": { paddingRight: 0 } }}
              >
                <MTextLine
                  label={`${vi.from}:`}
                  value={customer?.source === "skycom" ? "Skycom" : "Bên thứ 3"}
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
                <MTextLine
                  label={`${vi.rank}:`}
                  value={<RankField value={customerInfo?.ranking} />}
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
                <MTextLine
                  label={`${vi.update_level_date}:`}
                  value={fDate(customerInfo?.latest_up_rank_date) || "---"}
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
              </Stack>

              <Stack
                style={{
                  marginBottom: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid rgb(102 102 102 / 32%)",
                }}
                sx={{ ".MuiGrid-root": { paddingRight: 0 } }}
              >
                <MTextLine
                  label={`${vi.revenue_by_order_complete}:`}
                  value={fNumber(customerInfo?.shipping_completed_spent)}
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />
                <MTextLine
                  label={`${vi.order_lasted}:`}
                  value={
                    customerInfo?.last_order_date ? fDate(customerInfo.last_order_date) : "---"
                  }
                  containerStyle={containerTextlineStyle}
                  displayType="grid"
                />

                {isMasterCustomerCareStaffRole ? (
                  <MTextLine
                    label={`${vi.customer_care_staff}:`}
                    value={
                      <MultiSelect
                        simpleSelect
                        selectorId="customer-care-staff"
                        options={staffOptions}
                        onChange={handleChangeCustomerCareStaff}
                        fullWidth
                        outlined
                        placeholder="--Chọn--"
                        defaultValue={customerInfo.customer_care_staff?.id}
                        disabled={!isMutationCustomer}
                      />
                    }
                    containerStyle={containerTextlineStyle}
                    displayType="grid"
                  />
                ) : isMatchCustomerCareStaffRole ? (
                  <MTextLine
                    label={`${vi.customer_care_staff}:`}
                    value={
                      customerInfo?.customer_care_staff
                        ? customerInfo.customer_care_staff.name
                        : "---"
                    }
                    containerStyle={containerTextlineStyle}
                    displayType="grid"
                  />
                ) : null}
                <NoteInput
                  note={customerInfo?.customer_note}
                  setCustomerInfo={(note) =>
                    setCustomerInfo((prev) => ({ ...prev, customer_note: note }))
                  }
                  isMutation={isMutationCustomer}
                />
                <MTextLine
                  label={`${vi.customer_tag}:`}
                  value={
                    <TagInput
                      value={customerInfo?.tags}
                      disabled={!isMutationCustomer}
                      loading={loading}
                      onSubmit={(tags: string[]) => setCustomerInfo((prev) => ({ ...prev, tags }))}
                      returnType="name"
                      placeholder={`Chọn thẻ`}
                      options={tags}
                      inputStyle={tagInputStyle}
                      inputProps={{ size: "small" }}
                    />
                  }
                  displayType="grid"
                />
              </Stack>

              {/* thirty code */}
              {isShow3rd && (
                <Stack sx={{ ".MuiGrid-root": { paddingRight: 0 } }}>
                  <MTextLine
                    label={`${vi.customer_thirty}:`}
                    containerStyle={containerTextlineStyle}
                    displayType="grid"
                  />
                  <Stack
                    style={{
                      padding: "10px",
                      border: "1px solid rgb(102 102 102 / 32%)",
                    }}
                  >
                    {customerInfo?.full_name_3rd && (
                      <MTextLine
                        label={`${vi.full_name_3rd}:`}
                        value={customerInfo?.full_name_3rd}
                        containerStyle={containerTextlineStyle}
                        displayType="grid"
                      />
                    )}
                    {customerInfo?.gender_3rd && (
                      <MTextLine
                        label={`${vi.customer_gender_3rd}:`}
                        value={customerInfo?.gender_3rd === "0" ? "Nữ" : "Nam"}
                        containerStyle={containerTextlineStyle}
                        displayType="grid"
                      />
                    )}
                    {customerInfo?.birthday_3rd && (
                      <MTextLine
                        label={`${vi.customer_birthday_3rd}:`}
                        value={customerInfo?.birthday_3rd}
                        containerStyle={containerTextlineStyle}
                        displayType="grid"
                      />
                    )}
                    {customerInfo?.address_3rd && (
                      <MTextLine
                        label={`${vi.customer_address_3rd}:`}
                        value={customerInfo?.address_3rd}
                        containerStyle={containerTextlineStyle}
                        displayType="grid"
                      />
                    )}
                    {customerInfo?.modified_3rd && (
                      <MTextLine
                        label={`${vi.customer_modified_3rd}:`}
                        value={
                          fDate(customerInfo?.modified_3rd)
                            ? fDate(customerInfo?.modified_3rd)
                            : "---"
                        }
                        containerStyle={containerTextlineStyle}
                        displayType="grid"
                      />
                    )}
                  </Stack>
                </Stack>
              )}

              <Stack
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                {customerInfo?.facebook_id_3rd ? (
                  <IconButton
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/${customerInfo?.facebook_id_3rd}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <Iconify
                      icon={"devicon:facebook"}
                      width={30}
                      height={40}
                      sx={{ pointerEvents: "none" }}
                    />
                  </IconButton>
                ) : null}

                <IconButton
                  onClick={() =>
                    window.open(
                      `https://zalo.me/${customerInfo?.phone}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <Iconify
                    icon={"simple-icons:zalo"}
                    width={40}
                    height={40}
                    color={"#1768aa"}
                    sx={{ pointerEvents: "none" }}
                  />
                </IconButton>
              </Stack>
              {/* End thirty code */}
            </Stack>
          </Stack>
        )}
        {isShowTableDetail && (
          <OrderStatus analystData={orderStatusAnalyst.orders} total={orderStatusAnalyst.total} />
        )}
        <Stack direction="row">
          <SubmitButton
            disabled={!isMutationCustomer || isEqual(customer, customerInfo) || !customerInfo.id}
            onSubmit={handleUpdateCustomer}
          />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default memo(Overview);

const tagInputStyle = { marginTop: 8 };
const containerTextlineStyle: SxProps<Theme> = {
  paddingRight: 1,
  paddingBottom: 1,
};
