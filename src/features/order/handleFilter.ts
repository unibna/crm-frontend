import { UserType } from "_types_/UserType";
import { FilterChipType } from "components/Tables/HeaderWrapper";
import { HeaderOrderProps } from "views/OrderView/components/Header";
import { FilterOptionProps } from "_types_/HeaderType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { ALL_OPTION, FULL_OPTIONS } from "constants/index";
import map from "lodash/map";
import { PhoneLeadState } from "store/redux/leads/slice";
import { compareDateSelected } from "utils/dateUtil";
import { formatSelectorForQueryParams, revertFromQueryForSelector } from "utils/formatParamsUtil";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { TYPE_SHIPPING_COMPANIES, optionStatusShipping } from "views/ShippingView/constants";
import { BOOLEAN_VALUES, ORDER_STATUS } from "views/OrderView/constants/options";
import {
  CARRIER_STATUS,
  CREATED_BY_FILTER,
  CROSS_SALE_FILTER,
  DATE_OPTIONS_FILTER_COLOR,
  DELIVERY_FILTER,
  PRINT_STATUS_FILTER,
  SOURCE_FILTER,
  TAG_FILTER,
} from "views/OrderView/constants";

export const orderFilterOptions = ({
  leadSlice,
  leaderAndTelesaleUsers,
  tagsOptions,
  ...props
}: HeaderOrderProps & {
  leadSlice: PhoneLeadState;
  leaderAndTelesaleUsers: UserType[];
  tagsOptions: SelectOptionType[];
}): FilterOptionProps[] => [
  props.isFilterOrderStatus
    ? {
        key: "status",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              status: formatSelectorForQueryParams(value),
            }),
          options: [...FULL_OPTIONS, ...ORDER_STATUS],
          title: "Trạng thái đơn",
          defaultValue: revertFromQueryForSelector(props.params?.status),
          style: selectorStyle,
          selectorId: "status-order",
        },
      }
    : null,
  props.isFilterModifiedBy
    ? {
        key: "modified_by",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              modified_by: formatSelectorForQueryParams(value),
            }),
          options: [...FULL_OPTIONS, ...map(leaderAndTelesaleUsers, formatOptionSelect)],
          title: "Người xử lý",
          defaultValue: revertFromQueryForSelector(props.params?.modified_by),
          style: selectorStyle,
          selectorId: "handle-by",
        },
      }
    : null,
  props.isFilterCreator
    ? {
        key: "created_by",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              created_by: formatSelectorForQueryParams(value),
            }),
          options: [ALL_OPTION, ...map(leaderAndTelesaleUsers, formatOptionSelect)],
          title: "Người tạo đơn",
          defaultValue: revertFromQueryForSelector(props.params?.created_by),
          style: selectorStyle,
          selectorId: "create-by",
        },
      }
    : null,
  props.isFilterSource
    ? {
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              source: formatSelectorForQueryParams(value),
            }),
          options: [...FULL_OPTIONS, ...map(leadSlice.attributes.channel, formatOptionSelect)],
          title: "Kênh bán hàng",
          defaultValue: revertFromQueryForSelector(props.params?.source),
          style: selectorStyle,
          selectorId: "channel",
        },
      }
    : null,
  props.isFilterTag
    ? {
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              tags: formatSelectorForQueryParams(value),
            }),
          options: [...FULL_OPTIONS, ...tagsOptions],
          title: "Thẻ",
          defaultValue: revertFromQueryForSelector(props.params?.tags),
          style: selectorStyle,
          selectorId: "tags",
        },
      }
    : null,
  props.isFilterTrackingCompany
    ? {
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              delivery_company: formatSelectorForQueryParams(value),
            }),
          options: [ALL_OPTION, ...TYPE_SHIPPING_COMPANIES],
          title: "Đơn vị vận chuyển",
          defaultValue: revertFromQueryForSelector(props.params?.delivery_company),
          style: selectorStyle,
          selectorId: "tracking-company",
        },
      }
    : null,
  props.isFilterCrossSale
    ? {
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              is_cross_sale: formatSelectorForQueryParams(value),
            }),
          options: [
            ALL_OPTION,
            { label: "Đơn CrossSale", value: "true" },
            { label: "Không phải đơn CrossSale", value: "false" },
          ],
          title: "Đơn CrossSale",
          defaultValue: revertFromQueryForSelector(props.params?.is_cross_sale),
          style: selectorStyle,
          selectorId: "cross-sale",
        },
      }
    : null,
  props.isFilterPrinted
    ? {
        key: "printed_status",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              is_printed: formatSelectorForQueryParams(value),
            }),
          options: [
            ALL_OPTION,
            { label: "Đã in", value: "true" },
            { label: "Chưa in", value: "false" },
          ],
          title: "Trạng thái in đơn",
          defaultValue: revertFromQueryForSelector(props.params?.is_printed),
          style: selectorStyle,
          simpleSelect: true,
          selectorId: "print-status",
        },
      }
    : null,
  props.isFilterCarrierStatus
    ? {
        key: "carrier_status",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            props.setParams &&
            props.setParams({
              ...props.params,
              page: 1,
              carrier_status: formatSelectorForQueryParams(value),
            }),
          options: optionStatusShipping,
          title: "Trạng thái giao hàng",
          defaultValue: revertFromQueryForSelector(props.params?.carrier_status),
          style: selectorStyle,
          selectorId: "shipping-status",
        },
      }
    : null,
  props.isFilterModifiedDate
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          sxProps: dateInputStyle,
          handleSubmit: (from: string, to: string, value: string | number) => {
            const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);
            props.setParams &&
              props.setParams({
                ...props.params,
                last_handle_date_from: date_from,
                last_handle_date_to: date_to,
                modifiedAtDefault: toValue,
              });
          },
          defaultDateValue: props.params?.modifiedAtDefault,
          label: "Thời gian xử lý gần nhất",
          created_from: props.params?.last_handle_date_from,
          created_to: props.params?.last_handle_date_to,
        },
      }
    : null,
  props.isFilterDate
    ? {
        type: "time",
        timeProps: {
          label: "Ngày tạo đơn",
          handleSubmit: (from: string, to: string, value: string | number) => {
            const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);
            props.setParams &&
              props.setParams({
                ...props.params,
                created_from: date_from,
                created_to: date_to,
                dateValue: toValue,
              });
          },
          defaultDateValue: props.params?.dateValue,
          created_from: props.params?.created_from,
          created_to: props.params?.created_to,
          size: "small",
          sxProps: dateInputStyle,
          roadster: true,
        },
      }
    : null,
  props.isFilterConfirmDate
    ? {
        type: "time",
        timeProps: {
          label: "Ngày xác nhận",
          handleSubmit: (from: string, to: string, value: string | number) => {
            const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);
            props.setParams &&
              props.setParams({
                ...props.params,
                completed_time_from: date_from,
                completed_time_to: date_to,
                confirmDateValue: toValue,
              });
          },
          defaultDateValue: props?.params?.confirmDateValue,
          created_from: props.params?.completed_time_from,
          created_to: props.params?.completed_time_to,
          size: "small",
          sxProps: dateInputStyle,
          roadster: true,
        },
      }
    : null,
];

const selectorStyle = { width: 180, marginTop: 4 };
const dateInputStyle = { width: 180, marginLeft: 1, mt: 0.5 };

export const orderFilterChipOptions = ({
  leadSlice,
  tagsOptions,
  leaderAndTelesaleUsers,
  tabName,
}: {
  leadSlice: PhoneLeadState;
  leaderAndTelesaleUsers: UserType[];
  tabName?: string;
  tagsOptions: SelectOptionType[];
}): FilterChipType[] => [
  { type: "date", dateFilterKeys: DATE_OPTIONS_FILTER_COLOR },
  {
    type: "select",
    options: [ALL_OPTION, ...TYPE_SHIPPING_COMPANIES],
    keysFilter: DELIVERY_FILTER,
  },
  {
    type: "select",
    options: tagsOptions,
    keysFilter: TAG_FILTER,
  },
  {
    type: "select",
    options: map(leaderAndTelesaleUsers, formatOptionSelect),
    keysFilter: CREATED_BY_FILTER,
  },
  {
    type: "select",
    options: map(leadSlice.attributes.channel, formatOptionSelect),
    keysFilter: SOURCE_FILTER,
  },
  {
    type: "select",
    options: ORDER_STATUS,
    keysFilter: {
      label: "status",
      title: "Trạng thái đơn",
      disabled: tabName === "all" ? false : true,
    },
  },
  {
    type: "select",
    options: optionStatusShipping,
    keysFilter: CARRIER_STATUS,
  },
  {
    type: "select",
    options: BOOLEAN_VALUES,
    keysFilter: PRINT_STATUS_FILTER,
    isSimpleSelector: true,
  },
  {
    type: "select",
    options: BOOLEAN_VALUES,
    keysFilter: CROSS_SALE_FILTER,
    isSimpleSelector: true,
  },
];
