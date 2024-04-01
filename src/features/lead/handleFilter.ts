import { interceptApi } from "_apis_/intercept";
import { DateFilterType } from "_types_/FilterType";
import { FilterOptionProps, HeaderType } from "_types_/HeaderType";
import { InterceptDataType, LeadFilterProps, ParamsPhoneLeadType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { UserType } from "_types_/UserType";
import { FilterChipType } from "components/Tables/HeaderWrapper";
import { ALL_OPTION, INIT_ATTRIBUTE_OPTIONS } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_LEAD } from "constants/rolesTab";
import vi from "locales/vi.json";
import map from "lodash/map";
import { PhoneLeadState } from "store/redux/leads/slice";
import { compareDateSelected } from "utils/dateUtil";
import { revertFromQueryForSelector } from "utils/formatParamsUtil";
import { isReadAndWriteRole } from "utils/roleUtils";
import { filterIsShowOptions, formatOptionSelect } from "utils/selectOptionUtil";
import {
  CUSTOMER_TYPE_OPTIONS,
  FULL_LEAD_STATUS_OPTIONS,
  HANDLE_STATUS_OPTIONS,
} from "views/LeadCenterView/constants";

const selectorStyle: React.CSSProperties = { width: 180 };
const datePickerStyle = { width: 180, marginLeft: 1 };

export const LEAD_STATUS_OPTIONS: SelectOptionType[] = [ALL_OPTION, ...FULL_LEAD_STATUS_OPTIONS];

const ADS_CHANNEL_OPTIONS: SelectOptionType[] = [
  { label: "Youtube", value: "youtube" },
  { label: "Tiktok", value: "tiktok" },
  { label: "Facebook", value: "facebook" },
  { label: "Google", value: "google" },
];

export const leadFilterOptions = ({
  onSetParams,
  leadSlice,
  telesales,
  telesalesAndLeaders,
  isFilterAssignedDate,
  isFilterBadDataReason,
  isFilterCallLaterAt,
  isFilterChannel,
  isFilterChannelByName,
  isFilterCreatedDate,
  isFilterCreator,
  isFilterDataStatus,
  isFilterFailReason,
  isFilterFanpage,
  isFilterHandleReason,
  isFilterHandleStatus,
  isFilterHandler,
  isFilterLeadStatus,
  isFilterProcessTime,
  isFilterProduct,
  isFilterCustomerType,
  isFilterProductByName,
  isFilterAds,
  params,
  setParams,
  tabName,
}: LeadFilterProps &
  Partial<Pick<HeaderType, "params" | "setParams">> & {
    onSetParams: (
      name: keyof ParamsPhoneLeadType,
      value: string | number | "all" | "none" | (string | number)[]
    ) => void;
    leadSlice: PhoneLeadState;
    telesales: UserType[];
    telesalesAndLeaders: UserType[];
  }): FilterOptionProps[] => [
  isFilterLeadStatus
    ? {
        key: "lead_status",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: "Trạng thái Lead",
          options: LEAD_STATUS_OPTIONS,
          onChange: (value: any) => onSetParams("lead_status", value),
          defaultValue: revertFromQueryForSelector(params?.lead_status),
          selectorId: "lead-status",
        },
      }
    : null,
  isFilterHandler
    ? {
        key: "handle_by",
        type: "select",
        multiSelectProps: {
          selectorId: "handle-by",
          style: selectorStyle,
          title: "Người được chia số",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...map(telesales, formatOptionSelect)],
          onChange: (value: any) => onSetParams("handle_by", value),
          defaultValue: revertFromQueryForSelector(params?.handle_by),
        },
      }
    : null,
  isFilterCreator
    ? {
        key: "created_by",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: "Người tạo",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...map(telesalesAndLeaders, formatOptionSelect)],
          onChange: (value: any) => onSetParams("created_by", value),
          defaultValue: revertFromQueryForSelector(params?.created_by),
          selectorId: "create-by",
        },
      }
    : null,
  isFilterChannel
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.channel,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.channel),
          ],
          onChange: (value: any) => onSetParams("channel", value),
          defaultValue: revertFromQueryForSelector(params?.channel),
          selectorId: "channel",
        },
      }
    : null,

  isFilterChannelByName
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.channel,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...map(filterIsShowOptions(leadSlice.attributes.channel), (item) => ({
              value: item.label,
              label: item.label,
            })),
          ],
          onChange: (value: any) => onSetParams("channel", value),
          defaultValue: revertFromQueryForSelector(params?.channel),
          selectorId: "channel",
        },
      }
    : null,
  isFilterProduct
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.product.product,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.product),
          ],
          onChange: (value: any) => onSetParams("product", value),
          defaultValue: revertFromQueryForSelector(params?.product),
          selectorId: "product",
        },
      }
    : null,
  isFilterProductByName
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.product.product,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...map(filterIsShowOptions(leadSlice.attributes.product), (item) => ({
              value: item.label,
              label: item.label,
            })),
          ],
          onChange: (value: any) => onSetParams("product", value),
          defaultValue: revertFromQueryForSelector(params?.product),
          selectorId: "product",
        },
      }
    : null,
  isFilterCustomerType
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.is_new_customer,
          simpleSelect: true,
          options: [ALL_OPTION, ...CUSTOMER_TYPE_OPTIONS],
          onChange: (value: any) => onSetParams("is_new_customer", value),
          defaultValue: revertFromQueryForSelector(params?.is_new_customer),
          selectorId: "is_new_customer",
        },
      }
    : null,
  isFilterFanpage
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.fanpage,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.fanpage),
          ],
          onChange: (value: any) => onSetParams("fanpage", value),
          defaultValue: revertFromQueryForSelector(params?.fanpage),
          selectorId: "fanpage",
        },
      }
    : null,
  isFilterHandleStatus
    ? {
        key: "handle_status",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.call_time,
          options: [...INIT_ATTRIBUTE_OPTIONS, ...HANDLE_STATUS_OPTIONS],
          onChange: (value: any) => onSetParams("handle_status", value),
          defaultValue: revertFromQueryForSelector(params?.handle_status),
          selectorId: "handle-status",
        },
      }
    : null,
  isFilterHandleReason
    ? {
        key: "handle_reason",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.handle_reason,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.handle_reason),
          ],
          onChange: (value: any) => onSetParams("handle_reason", value),
          defaultValue: revertFromQueryForSelector(params?.handle_reason),
          selectorId: "handle-reason",
        },
      }
    : null,
  isFilterBadDataReason
    ? {
        key: "bad_data_reason",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.bad_data_reason,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.bad_data_reason),
          ],
          onChange: (value: any) => onSetParams("bad_data_reason", value),
          defaultValue: revertFromQueryForSelector(params?.bad_data_reason),
          selectorId: "bad-data-reason",
        },
      }
    : null,
  isFilterFailReason
    ? {
        key: "fail_reason",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.fail_reason,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.fail_reason),
          ],
          onChange: (value: any) => onSetParams("fail_reason", value),
          defaultValue: revertFromQueryForSelector(params?.fail_reason),
          selectorId: "fail-reason",
        },
      }
    : null,
  isFilterDataStatus
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.data_status,
          options: [
            ...INIT_ATTRIBUTE_OPTIONS,
            ...filterIsShowOptions(leadSlice.attributes.data_status),
          ],
          onChange: (value: any) => onSetParams("data_status", value),
          defaultValue: revertFromQueryForSelector(params?.data_status),
          selectorId: "data-status",
        },
      }
    : null,
  isFilterAds
    ? {
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.phone_lead.ad_channel,
          options: [...INIT_ATTRIBUTE_OPTIONS, ...ADS_CHANNEL_OPTIONS],
          onChange: (value: any) => onSetParams("ad_channel", value),
          defaultValue: revertFromQueryForSelector(params?.ad_channel),
          selectorId: "ad-channel",
        },
      }
    : null,
  isFilterCreatedDate
    ? {
        type: "time",
        timeProps: {
          label: vi.created_time,
          roadster: true,
          size: "small",
          sxProps: datePickerStyle,
          created_from: params?.created_from,
          created_to: params?.created_to,
          handleSubmit: (created_from: string, created_to: string, dateValue: string | number) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(created_from, created_to, dateValue);
            setParams?.({
              created_from: date_from,
              created_to: date_to,
              dateValue: toValue,
            });
          },
          defaultDateValue: params?.dateValue,
        },
      }
    : null,

  isFilterAssignedDate
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          label: vi.share_time,
          sxProps: datePickerStyle,
          created_from: params?.handler_assigned_from,
          created_to: params?.handler_assigned_to,
          handleSubmit: (
            handler_assigned_from: string,
            handler_assigned_to: string,
            defaultAssignedDate: string | number
          ) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(
              handler_assigned_from,
              handler_assigned_to,
              defaultAssignedDate
            );
            setParams?.({
              handler_assigned_from: date_from,
              handler_assigned_to: date_to,
              defaultAssignedDate: toValue,
            });
          },
          defaultDateValue: params?.defaultAssignedDate,
        },
      }
    : null,
  isFilterProcessTime
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          label: vi.process_done_at,
          sxProps: datePickerStyle,
          created_from: params?.process_done_from,
          created_to: params?.process_done_to,
          handleSubmit: (
            process_done_from: string,
            process_done_to: string,
            defaultProcessDate: string | number
          ) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(process_done_from, process_done_to, defaultProcessDate);
            setParams?.({
              process_done_from: date_from,
              process_done_to: date_to,
              defaultProcessDate: toValue,
            });
          },
          defaultDateValue: params?.defaultProcessDate,
        },
      }
    : null,
  isFilterCallLaterAt
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          label: vi.callback_time,
          sxProps: datePickerStyle,
          created_from: params?.call_later_at_from,
          created_to: params?.call_later_at_to,
          handleSubmit: (
            call_later_at_from: string,
            call_later_at_to: string,
            defaultCallLaterAtDate: string | number
          ) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(call_later_at_from, call_later_at_to, defaultCallLaterAtDate);
            setParams?.({
              call_later_at_from: date_from,
              call_later_at_to: date_to,
              defaultCallLaterAtDate: toValue,
            });
          },
          defaultDateValue: params?.defaultCallLaterAtDate,
        },
      }
    : null,
];

export const leadFilterChipOptions = ({
  tabName,
  leadSlice,
  user,
  telesales,
  landingPageDomain,
}: {
  tabName?: string;
  leadSlice: PhoneLeadState;
  user: Partial<UserType> | null;
  telesales: UserType[];
  landingPageDomain: SelectOptionType[];
}): FilterChipType[] | undefined => [
  {
    type: "date",
    dateFilterKeys: CREATED_FILTER_COLOR,
  },
  {
    type: "date",
    dateFilterKeys: CALL_FILTER_COLOR,
  },
  {
    type: "date",
    dateFilterKeys: PROCESS_DONE_FILTER_COLOR,
  },
  {
    type: "date",
    dateFilterKeys: ASSIGN_DATE_FILTER_COLOR,
  },
  {
    type: "attribute",
    keysFilter: { label: "channel", title: "Kênh bán hàng" },
    attributeOptions: [
      ...leadSlice.attributes.channel,
      ...map(leadSlice.attributes.channel, (item) => ({
        id: item.name,
        name: item.name,
        value: item.name,
      })),
    ],
  },
  {
    type: "attribute",
    keysFilter: { label: "bad_data_reason", title: "Dữ liệu kém" },
    attributeOptions: leadSlice.attributes.bad_data_reason,
  },
  {
    type: "attribute",
    keysFilter: { label: "product", title: "Sản phẩm/ Chiến dịch" },
    attributeOptions: [
      ...leadSlice.attributes.product,
      ...map(leadSlice.attributes.product, (item) => ({
        id: item.name,
        name: item.name,
        value: item.name,
      })),
    ],
  },
  {
    type: "attribute",
    keysFilter: { label: "data_status", title: "Trạng thái DL" },
    attributeOptions: leadSlice.attributes.data_status,
  },
  {
    type: "attribute",
    keysFilter: { label: "fanpage", title: "Fanpage" },
    attributeOptions: leadSlice.attributes.fanpage,
  },
  {
    type: "attribute",
    keysFilter: { label: "fail_reason", title: "Không mua" },
    attributeOptions: leadSlice.attributes.fail_reason,
  },
  {
    type: "select",
    keysFilter: {
      label: "lead_status",

      title: "Trạng thái",
      disabled: tabName === "all" ? false : true,
    },
    options: FULL_LEAD_STATUS_OPTIONS,
  },
  {
    type: "select",
    keysFilter: { label: "is_new_customer", title: "Khách hàng mới/ cũ" },
    options: [ALL_OPTION, ...CUSTOMER_TYPE_OPTIONS],
    isSimpleSelector: true,
  },
  {
    type: "select",
    keysFilter: { label: "landing_page_domain", title: "URL sản phẩm" },
    options: [...INIT_ATTRIBUTE_OPTIONS, ...landingPageDomain],
  },
  {
    type: "select",
    keysFilter: { label: "handle_status", title: "TT xử lý" },
    options: HANDLE_STATUS_OPTIONS,
  },
  {
    type: "select",
    keysFilter: { label: "ad_channel", title: vi.phone_lead.ad_channel },
    options: ADS_CHANNEL_OPTIONS,
  },
  {
    type: "select",
    keysFilter: {
      label: "handle_by",
      title: "Người xử lý",
      disabled: !isReadAndWriteRole(
        user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ),
    },
    options: map(telesales, formatOptionSelect),
  },
  {
    type: "select",
    keysFilter: {
      label: "created_by",
      title: "Người tạo",
      disabled: !isReadAndWriteRole(
        user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
      ),
    },
    options: map(telesales, formatOptionSelect),
  },
];

const CALL_FILTER_COLOR: DateFilterType[] = [
  {
    title: "Ngày gọi lại",
    keyFilters: [
      { label: "call_later_at_from", color: "#91f7d3", title: "Ngày gọi từ" },
      { label: "call_later_at_to", color: "#91f7d3", title: "Ngày gọi đến" },
      { label: "defaultCallLaterAtDate" },
    ],
  },
];

const CREATED_FILTER_COLOR: DateFilterType[] = [
  {
    title: "Ngày tạo",
    keyFilters: [
      { label: "created_from", title: "Ngày tạo từ" },
      { label: "created_to", title: "Ngày tạo đến" },
      { label: "dateValue" },
    ],
  },
];

const PROCESS_DONE_FILTER_COLOR: DateFilterType[] = [
  {
    title: "Ngày hoàn thành",
    keyFilters: [
      { label: "process_done_from", color: "#91f7d3", title: "Ngày XL từ" },
      { label: "process_done_to", color: "#91f7d3", title: "Ngày XL đến" },
      { label: "defaultProcessDate" },
    ],
  },
];

const ASSIGN_DATE_FILTER_COLOR: DateFilterType[] = [
  {
    title: "Ngày xử lý",
    keyFilters: [
      { label: "handler_assigned_from", color: "#91f7d3", title: "Ngày XL từ" },
      { label: "handler_assigned_to", color: "#91f7d3", title: "Ngày XL đến" },
      { label: "dateValue" },
    ],
  },
];

export const handleDeleteIntercept = async ({ data }: { data: string[] }) => {
  const res = await interceptApi.remove({
    endpoint: `data-spam/delete/`,
    data: { data },
  });
  if (res) {
    return true;
  }
  return false;
};

export const handleAddIntercept = async ({
  data,
  status,
  type,
  userId,
}: {
  status?: string;
  data?: string;
  type: string;
  userId?: string;
}) => {
  const form = {
    data,
    spam_type: type,
    created_by_id: userId,
    status,
  };
  const res = await interceptApi.create(form, "data-spam/");
  if (res.data) {
    return true;
  } else {
    return false;
  }
};

export const handleAddMultiIntercept = async ({ data }: { data: Partial<InterceptDataType>[] }) => {
  const form = { data };
  const res = await interceptApi.create(form, "data-spam/bulk-create/");
  if (res.data) {
    return true;
  } else {
    return false;
  }
};
