//component
import { Box, FormHelperText, Grid, Paper, TextField, styled } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MultiSelect } from "components/Selectors";
import { MDateTimeMobilePicker } from "components/Pickers";
//constant
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { leadStore } from "store/redux/leads/slice";
//store
import { UserState } from "store/redux/users/slice";
//util
import { filterIsShowOptions, formatOptionSelect } from "utils/selectOptionUtil";
//type
import { AttributeType } from "_types_/AttributeType";
import { CustomerType } from "_types_/CustomerType";
import { PhoneLeadType } from "_types_/PhoneLeadType";
import vi from "locales/vi.json";
import { TagInput } from "components/Fields";
import { NULL_OPTION } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { yyyy_MM_dd_HH_mm_ss } from "constants/time";
import format from "date-fns/format";
import { memo } from "react";
import { FieldErrors } from "react-hook-form";
import { isReadAndWriteRole } from "utils/roleUtils";
import { isVietnamesePhoneNumber, toSimplest } from "utils/stringsUtil";
import { LEAD_TABS } from "views/LeadCenterView/constants";
import CustomerAutocomplete from "../CustomerAutocomplete";

const ORDER_NO_ORDER = [LEAD_TABS.HAS_ORDER, LEAD_TABS.NO_ORDER, LEAD_TABS.BAD_DATA];

const PhoneLeadFormControl = ({
  values,
  defaultValues,
  errors,
  handleChange,
  tabName,
  userSlice,
  setLoadCDP,
  isLoadCDP,
  setCustomer,
  channel,
}: {
  values?: Partial<PhoneLeadType>;
  defaultValues?: Partial<PhoneLeadType>;
  errors?: FieldErrors<PhoneLeadType>;
  handleChange: (value: any, name?: keyof PhoneLeadType) => void;
  tabName?: string;
  userSlice: UserState;
  setLoadCDP: (value: boolean) => void;
  isLoadCDP: boolean;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerType | undefined>>;
  channel?: AttributeType;
}) => {
  const leadSlice = useAppSelector(leadStore);
  const { user } = useAuth();

  const phoneDisabled = isVietnamesePhoneNumber(defaultValues?.phone || "");

  // trạng thái ổn định của lead form
  const fixedLeadStatus = tabName && ORDER_NO_ORDER.includes(tabName);
  const spamDisabled = tabName === LEAD_TABS.SPAM;

  // được chia số
  const isReadAndWriteHandleByRole = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.HANDLE_BY]
  );
  const isHandleBy = values?.handle_by === user?.id;

  const channelOptions = map(filterIsShowOptions(leadSlice.attributes.channel), (item) => ({
    ...item,
    disabled: toSimplest(item.label).includes("system"),
  }));

  return (
    <>
      <Box>
        <Grid container alignItems="flex-start">
          <GridFieldWrap item xs={12}>
            <CustomerAutocomplete
              size="small"
              onChange={({ name, phone }) => {
                handleChange(phone, "phone");
                name !== undefined && handleChange(name, "name");
              }}
              onSearch={() => setLoadCDP(true)}
              disabled={phoneDisabled || spamDisabled}
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
              defaultValue={values?.phone || ""}
              label={vi.phone_number}
              required
              autoFocus
              isShowAdornment={!isLoadCDP && values?.phone !== ""}
              onSelected={(value) => setCustomer(value)}
            />
          </GridFieldWrap>
          <GridFieldWrap item container xs={12} alignItems="flex-start" className="relative">
            <TextField
              name="Tên khách hàng"
              disabled={!!fixedLeadStatus || spamDisabled}
              error={!!errors?.name}
              value={values?.name || ""}
              onChange={(e) => handleChange(e.target.value, "name")}
              helperText={errors?.name?.message}
              fullWidth
              label={vi.customer_name}
              required
              margin="normal"
              variant="outlined"
              size="small"
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12}>
            <MultiSelect
              options={filterIsShowOptions(leadSlice.attributes.product)}
              label="Sản phẩm"
              error={!!errors?.product}
              required
              defaultValue={values?.product || ""}
              disabled={!!fixedLeadStatus || spamDisabled}
              title={vi.product.product}
              outlined
              simpleSelect
              fullWidth
              selectorId="phone-lead-product"
              onChange={(value) => handleChange(value, "product")}
              helperText={errors?.product?.message}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12}>
            <MultiSelect
              options={[NULL_OPTION, ...filterIsShowOptions(leadSlice.attributes.fanpage)]}
              label="Fanpage"
              defaultValue={values?.fanpage || NULL_OPTION.value}
              title={vi.fanpage}
              outlined
              simpleSelect
              required
              disabled={!!fixedLeadStatus || spamDisabled}
              fullWidth
              selectorId="phone-lead-fanpage"
              error={!!errors?.fanpage}
              helperText={errors?.fanpage?.message}
              onChange={(value) => handleChange(value, "fanpage")}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12}>
            <MultiSelect
              options={channelOptions}
              label="Kênh bán hàng"
              outlined
              simpleSelect
              error={!!errors?.channel}
              defaultValue={values?.channel || ""}
              helperText={errors?.channel?.message}
              required
              disabled={!!values?.id || spamDisabled}
              title={vi.channel}
              fullWidth
              selectorId="phone-lead-channel"
              onChange={(value) => handleChange(value, "channel")}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12}>
            <MDateTimeMobilePicker
              onChange={(date) =>
                handleChange(
                  date ? format(date as Date, yyyy_MM_dd_HH_mm_ss) : null,
                  "call_later_at"
                )
              }
              label={vi.callback_time}
              value={values?.call_later_at ? (new Date(values.call_later_at) as any) : null}
              inputProps={{
                size: "small",
                error: !!errors?.call_later_at,
                disabled: spamDisabled,
              }}
              dateProps={{ disablePast: true, disabled: spamDisabled }}
            />
            {!!errors?.call_later_at && (
              <FormHelperText error>{errors?.call_later_at?.message}</FormHelperText>
            )}
          </GridFieldWrap>
          <GridFieldWrap item xs={12}>
            <TextField
              size="small"
              value={values?.note || ""}
              fullWidth
              name="note"
              variant="outlined"
              label={vi.note}
              multiline
              onChange={(e) => handleChange(e.target.value, "note")}
            />
          </GridFieldWrap>
          <GridFieldWrap item xs={12} sx={{ ".grid-layout-tag-values > div": { padding: 0 } }}>
            <TagInput
              size="small"
              options={leadSlice.attributes.tag}
              placeholder={vi.lead_attributes.tag}
              onSubmit={(tags: string[]) => handleChange(tags, "tags")}
              value={values?.tags}
              returnType="name"
              disabled={spamDisabled}
            />
          </GridFieldWrap>
        </Grid>
      </Box>

      {/* khi tạo đơn: đối với người chia số thì hiện values chia số, đối người được chia số thì hiện checkbox nhận số và kênh bán hàng là Hotline */}
      {!values?.id && channel?.name === "Hotline" && (
        <Box component={Paper}>
          <Grid container alignItems="flex-end">
            {user ? (
              isReadAndWriteHandleByRole ? (
                <GridFieldWrap item xs={12}>
                  <MultiSelect
                    options={[
                      { value: "", label: "" },
                      ...map(userSlice.telesaleUsers, formatOptionSelect),
                    ]}
                    label="handle_by"
                    title={vi.handle_by}
                    outlined
                    simpleSelect
                    defaultValue={values?.handle_by}
                    fullWidth
                    selectorId="phone-lead-handle-by"
                    onChange={(value) => handleChange(value, "handle_by")}
                    size="small"
                  />
                </GridFieldWrap>
              ) : null
            ) : null}
          </Grid>
        </Box>
      )}
      {/* ---------------------------------------------------- */}
    </>
  );
};

export default memo(PhoneLeadFormControl);

const GridFieldWrap = styled(Grid)`
  padding: 10px;
  div {
    margin: 0px;
  }
`;

const HandleByCheckbox = styled(FormControlLabel)`
  margin-left: 0px !important;
`;
