import { DateFilterType } from "_types_/FilterType";
import { FilterOptionProps, HeaderType } from "_types_/HeaderType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { FilterChipType } from "components/Tables/HeaderWrapper";
import { ALL_OPTION, FULL_OPTIONS } from "constants/index";
import vi from "locales/vi.json";
import map from "lodash/map";
import { compareDateSelected } from "utils/dateUtil";
import { revertFromQueryForSelector } from "utils/formatParamsUtil";
import { VoipFilterType } from "views/LeadCenterView/components/TableVoipHeader";

const selectorStyle: React.CSSProperties = { width: 180 };
const datePickerStyle = { width: 180, marginLeft: 1 };

const CALL_DATE_FILTER_COLOR: DateFilterType[] = [
  {
    title: "Ngày gọi",
    keyFilters: [
      { label: "date_from", color: "#91f7d3", title: "Ngày gọi từ" },
      { label: "date_to", color: "#91f7d3", title: "Ngày gọi đến" },
      { label: "callDateValue" },
    ],
  },
];

export const voipFilterChipOptions = ({
  callAttributeOptions,
  telephonistOptions = [],
  isFilterCallAttribute,
  isFilterCallDate,
  isFilterModifiedByName,
  isFilterTelephonist,
  isFilterVoipProccess,
  isFilterVoipStatus,
}: {
  callAttributeOptions: SelectOptionType[];
  telephonistOptions?: SelectOptionType[];
} & VoipFilterType): FilterChipType[] | undefined => [
  {
    type: "date",
    dateFilterKeys: CALL_DATE_FILTER_COLOR,
  },
  {
    type: "select",
    keysFilter: {
      label: "telephonist_name",
      title: "Người trực line",
      disabled: !isFilterTelephonist,
    },
    options: telephonistOptions,
  },
  {
    type: "select",
    keysFilter: {
      label: "modified_by_name",
      title: "Người chỉnh sửa",
      disabled: !isFilterModifiedByName,
    },
    options: telephonistOptions,
  },
  {
    type: "select",
    keysFilter: {
      label: "business_call_type",
      title: "Loại cuộc gọi",
      disabled: !isFilterCallAttribute,
    },
    options: callAttributeOptions,
  },
  {
    type: "select",
    keysFilter: { label: "call_status", title: "Trạng thái", disabled: !isFilterVoipStatus },
    options: map(
      Object.keys(vi.skycall_status),
      (item: "meet_call" | "miss_call" | "stop_at_IVR" | "stop_at_survey_IVR") => ({
        label: vi.skycall_status[item],
        value: item,
      })
    ) as SelectOptionType[],
  },
  {
    type: "select",
    keysFilter: { label: "call_type", title: "Luồng gọi", disabled: !isFilterVoipProccess },
    options: map(Object.keys(vi.skycall_type), (item: "callin" | "callout") => ({
      label: vi.skycall_type[item],
      value: item,
    })),
  },
];

export const voipFilterOptions = ({
  onSetParams,
  callAttributeOptions,
  telephonistOptions = [],
  params,
  isFilterCallAttribute,
  isFilterCallDate,
  isFilterTelephonist,
  isFilterModifiedByName,
  isFilterVoipProccess,
  isFilterVoipStatus,
  setParams,
}: VoipFilterType &
  Partial<Pick<HeaderType, "params" | "setParams">> & {
    onSetParams: (
      name: string,
      value: string | number | "all" | "none" | (string | number)[]
    ) => void;
    callAttributeOptions: SelectOptionType[];
    telephonistOptions?: SelectOptionType[];
  }): FilterOptionProps[] => [
  isFilterVoipStatus
    ? {
        key: "call_status",
        type: "select",
        multiSelectProps: {
          selectorId: "voip-status",
          fullWidth: true,
          style: selectorStyle,
          title: "Trạng thái",
          options: [
            ALL_OPTION,
            ...(map(
              Object.keys(vi.skycall_status),
              (item: "meet_call" | "miss_call" | "stop_at_IVR" | "stop_at_survey_IVR") => ({
                label: vi.skycall_status[item],
                value: item,
              })
            ) as SelectOptionType[]),
          ],
          onChange: (value) => onSetParams("call_status", value),
          defaultValue: revertFromQueryForSelector(params?.call_status),
        },
      }
    : null,
  isFilterTelephonist
    ? {
        key: "telephonist_name",
        type: "select",
        multiSelectProps: {
          fullWidth: true,
          selectorId: "voip-src",
          style: selectorStyle,
          title: "Người trực line",
          options: [...FULL_OPTIONS, ...telephonistOptions],
          onChange: (value) => onSetParams("telephonist_name", value),
          defaultValue: revertFromQueryForSelector(params?.telephonist_name),
        },
      }
    : null,
  isFilterModifiedByName
    ? {
        key: "modified_by_name",
        type: "select",
        multiSelectProps: {
          fullWidth: true,
          selectorId: "modified_by_name",
          style: selectorStyle,
          title: "Người chỉnh sửa",
          options: [...FULL_OPTIONS, ...telephonistOptions],
          onChange: (value) => onSetParams("modified_by_name", value),
          defaultValue: revertFromQueryForSelector(params?.modified_by_name),
        },
      }
    : null,
  isFilterVoipProccess
    ? {
        key: "call_type",
        type: "select",
        multiSelectProps: {
          fullWidth: true,
          selectorId: "voip-proccess",
          style: selectorStyle,
          title: "Luồng gọi",
          options: [
            ALL_OPTION,
            ...(map(Object.keys(vi.skycall_type), (item: "callin" | "callout") => ({
              label: vi.skycall_type[item],
              value: item,
            })) as SelectOptionType[]),
          ],
          onChange: (value) => onSetParams("call_type", value),
          defaultValue: revertFromQueryForSelector(params?.call_type),
        },
      }
    : null,
  isFilterCallAttribute
    ? {
        key: "business_call_type",
        type: "select",
        multiSelectProps: {
          fullWidth: true,
          selectorId: "voip-call-attribute",
          style: selectorStyle,
          title: "Loại cuộc gọi",
          options: [ALL_OPTION, ...callAttributeOptions],
          onChange: (value) => onSetParams("business_call_type", value),
          defaultValue: revertFromQueryForSelector(params?.business_call_type),
        },
      }
    : null,
  isFilterCallDate
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          label: vi.CALL_DATE,
          sxProps: datePickerStyle,
          created_from: params?.date_from,
          created_to: params?.date_to,
          handleSubmit: (from: string, to: string, callDateValue: string | number) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(from, to, callDateValue);
            setParams?.({
              ...params,
              date_from,
              date_to,
              callDateValue: toValue,
            });
          },
          defaultDateValue: params?.callDateValue,
        },
      }
    : null,
];
