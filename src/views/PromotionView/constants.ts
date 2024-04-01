//components
import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { PromotionHeaderProps } from "./components/Header";

//types
import { FilterOptionProps } from "_types_/HeaderType";
import {
  DISCOUNT_METHOD,
  PROMOTION_ACTIVE_STATUS,
  PROMOTION_TYPE,
  PromotionRequireType,
  PromotionStatus,
  PromotionType,
} from "_types_/PromotionType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { FilterChipType } from "components/Tables/HeaderWrapper";

//utils
import { AttributeVariant } from "_types_/ProductType";
import { VALIDATION_MESSAGE } from "assets/messages/validation.messages";
import { ALL_OPTION } from "constants/index";
import { yyyy_MM_dd_HH_mm_ss } from "constants/time";
import format from "date-fns/format";
import vi from "locales/vi.json";
import map from "lodash/map";
import omit from "lodash/omit";
import { UserState } from "store/redux/users/slice";
import { compareDateSelected, fDateTime } from "utils/dateUtil";
import { formatSelectorForQueryParams, revertFromQueryForSelector } from "utils/formatParamsUtil";
import * as yup from "yup";

export const PROMOTION_COLUMNS: Column[] = [
  { name: "name", title: "Tên khuyến mãi" },
  { name: "applied_variant", title: "Sản phẩm khuyến mãi" },
  { name: "value", title: "Khuyến mãi" },
  { name: "status", title: "Trạng thái hoạt động" },
  { name: "requirements", title: "Điều kiện áp dụng" },
  { name: "note", title: "Nội dung" },
  { name: "created", title: "Thông tin tạo" },
  { name: "date_start", title: "Thời gian kích hoạt" },
];

export const PROMOTION_STATUS_VALUES = [
  { value: "INACTIVED", label: "Chưa hoạt động", color: "default" },
  { value: "ACTIVED", label: "Đang hoạt động", color: "success" },
  { value: "DEACTIVED", label: "Ngưng hoạt động", color: "error" },
];

export const PROMOTION_TYPE_VALUES = [
  { value: "ORDER", label: "Đơn hàng" },
  { value: "VARIANT", label: "Sản phẩm" },
];

export const PROMOTION_METHOD_VALUES = [
  { value: "PERCENTAGE", label: "Phần trăm" },
  { value: "AMOUNT", label: "Tiền" },
  { value: "COMBO", label: "Combo sản phẩm" },
];

export const PROMOTION_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 200 },
  { columnName: "created", width: 200 },
  { columnName: "applied_variant", width: 270 },
  { columnName: "date_start", width: 190 },
  { columnName: "status", width: 190 },
  { columnName: "value", width: 300 },
  { columnName: "requirements", width: 180 },
  { columnName: "note", width: 250 },
];

export const PROMOTION_COLUMN_ORDERS: string[] = [];
export const PROMOTION_HIDDEN_COLUMN_NAMES: string[] = [];

export const PROMOTION_INSTANCE_TYPES: SelectOptionType[] = [
  { label: "Đơn hàng", value: PROMOTION_TYPE.ORDER },
  { label: "Sản phẩm", value: PROMOTION_TYPE.VARIANT },
  // { label: "Danh mục", value: "category" },
];

export const AMOUNT_PERCENT_TYPES: SelectOptionType[] = [
  { label: "Tiền", value: "AMOUNT" },
  { label: "Phần trăm - %", value: "PERCENTAGE" },
  { label: "Sản phẩm", value: "PRODUCT" },
];

export const DISCOUNT_METHOD_VALUES: { [key: string]: string } = {
  PERCENTAGE: "Phần trăm",
  AMOUNT: "Giá tiền",
  PRODUCT: "Sản phẩm",
};

export const PROMOTION_TYPE_FILTER = { label: "type", color: "#91f7a4", title: "Loại khuyến mãi" };
export const PROMOTION_METHOD_FILTER = {
  label: "discount_method",
  color: "#91f7a4",
  title: "Khuyến mãi theo",
};
export const PROMOTION_PAYMENT_TYPE_FILTER = {
  label: "payment_type_id",
  color: "#91f7a4",
  title: "Tuỳ chọn thanh toán",
};
export const PROMOTION_CREATED_BY_FILTER = { label: "created_by", color: "", title: "Người tạo" };
export const SELECT_OPTIONS_FILTER_COLOR = [];

export const DATE_OPTIONS_FILTER_COLOR = [
  {
    title: "KM hoạt động",
    keyFilters: [
      { label: "date_from", color: "#91f7a4", title: "KM hoạt động từ" },
      { label: "date_to", color: "#91f7a4", title: "KM hoạt động tới" },
    ],
  },
  {
    title: "Ngày tạo đơn",
    keyFilters: [
      { label: "created_from", color: "#91f7a4", title: "Ngày tạo đơn từ" },
      { label: "created_to", color: "#91f7a4", title: "Ngày tạo đơn tới" },
    ],
  },
];

export const PROMOTION_ACTIVE_LIST = [
  {
    label: "Chưa kích hoạt",
    value: PROMOTION_ACTIVE_STATUS.INACTIVED,
    checkDisabled: (defaultStatus: PromotionStatus) =>
      defaultStatus
        ? defaultStatus === PROMOTION_ACTIVE_STATUS.ACTIVED ||
          defaultStatus === PROMOTION_ACTIVE_STATUS.DEACTIVED
        : false,
  },
  {
    label: "Đã kích hoạt",
    value: PROMOTION_ACTIVE_STATUS.ACTIVED,
    checkDisabled: (defaultStatus: PromotionStatus) => false,
  },
  {
    label: "Ngừng kích hoạt",
    value: PROMOTION_ACTIVE_STATUS.DEACTIVED,
    checkDisabled: (defaultStatus: PromotionStatus) => false,
  },
];

export const promotionSchema = yup.object().shape({
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
  discount_method: yup.string().required(),
  discount_amount: yup.number().when("discount_method", {
    is: DISCOUNT_METHOD.AMOUNT,
    then: yup.number().min(1000, VALIDATION_MESSAGE.FORMAT_PRICE),
  }),
  discount_percent: yup.number().when("discount_method", {
    is: DISCOUNT_METHOD.PERCENTAGE,
    then: yup
      .number()
      .min(1, VALIDATION_MESSAGE.REQUIRE_FORMAT_PERCENT)
      .max(100, VALIDATION_MESSAGE.REQUIRE_FORMAT_PERCENT),
  }),
  combo_times: yup.number().when("discount_method", {
    is: DISCOUNT_METHOD.COMBO,
    then: yup
      .number()
      .min(1, VALIDATION_MESSAGE.REQUIRE_COMPO_TIMES)
      .required(VALIDATION_MESSAGE.REQUIRE_COMPO_TIMES),
  }),
  product_selected: yup.array().when("discount_method", {
    is: DISCOUNT_METHOD.COMBO,
    then: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
          quantity: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .required(VALIDATION_MESSAGE.REQUIRE_AMOUNT)
            .min(1, VALIDATION_MESSAGE.REQUIRE_AMOUNT),
        })
      )
      .min(1, VALIDATION_MESSAGE.SELECT_PRODUCT),
  }),
  type: yup.string().required(),
  applied_variant: yup
    .object()
    .when("type", {
      is: PROMOTION_TYPE.VARIANT,
      then: yup.object({
        id: yup.string().required(VALIDATION_MESSAGE.SELECT_PRODUCT),
      }),
    })
    .nullable(),
  note: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CONTENT),
});

export const promotionFilterOptions = ({
  userSlice,
  setParams,
  params,
  ...props
}: PromotionHeaderProps & { userSlice: UserState }): FilterOptionProps[] => [
  props.isFilterStatus
    ? {
        key: "status",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            setParams && setParams({ ...props, status: formatSelectorForQueryParams(value) }),
          options: [ALL_OPTION, ...PROMOTION_STATUS_VALUES],
          title: "Trạng thái",
          defaultValue: revertFromQueryForSelector(params?.status),
          style: selectorStyle,
          selectorId: "promotion-status",
        },
      }
    : null,
  props.isFilterType
    ? {
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            setParams && setParams({ ...props, type: formatSelectorForQueryParams(value) }),
          options: [ALL_OPTION, ...PROMOTION_TYPE_VALUES],
          title: "Loại khuyến mãi",
          defaultValue: revertFromQueryForSelector(params?.type),
          style: selectorStyle,
          selectorId: "promotion-type",
        },
      }
    : null,
  props.isFilterMethod
    ? {
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            setParams &&
            setParams({ ...props, discount_method: formatSelectorForQueryParams(value) }),
          options: [ALL_OPTION, ...PROMOTION_METHOD_VALUES],
          title: "Khuyến mãi theo",
          defaultValue: revertFromQueryForSelector(params?.discount_method),
          style: selectorStyle,
          selectorId: "promotion-by",
        },
      }
    : null,
  props.isFilterCreatedBy
    ? {
        key: "created_by",
        type: "select",
        multiSelectProps: {
          onChange: (value) =>
            setParams && setParams({ ...props, created_by: formatSelectorForQueryParams(value) }),
          options: [
            ALL_OPTION,
            ...map(userSlice.activeUsers, (item) => ({ label: item.name, value: item.id })),
          ],
          title: "Người tạo",
          defaultValue: revertFromQueryForSelector(params?.created_by),
          style: selectorStyle,
          selectorId: "promotion-create-by",
        },
      }
    : null,
  props.isFilterDate
    ? {
        type: "time",
        timeProps: {
          label: "Ngày tạo KM",
          handleSubmit: (from, to, value) => {
            const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);
            setParams &&
              setParams({
                ...props,
                created_from: date_from,
                created_to: date_to,
                dateValue: toValue,
              });
          },
          defaultDateValue: params?.dateValue,
          created_from: params?.created_from,
          created_to: params?.created_to,
          size: "small",
          sxProps: datePickerStyle,
          roadster: true,
        },
      }
    : null,
  props.isFilterActiveDate
    ? {
        type: "time",
        timeProps: {
          label: "Ngày hoạt động",
          handleSubmit: (from, to, value) => {
            const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);
            setParams &&
              setParams({
                ...props,
                date_from: date_from,
                date_to: date_to,
                activeDateValue: toValue,
              });
          },
          defaultDateValue: params?.activeDateValue,
          created_from: params?.date_from,
          created_to: params?.date_to,
          size: "small",
          sxProps: datePickerStyle,
          roadster: true,
        },
      }
    : null,
];

const selectorStyle = { width: 180 };
const datePickerStyle = { width: 220, marginLeft: 1 };

export const promotionFilterChipOptions = ({
  tabName,
  userSlice,
}: {
  userSlice: UserState;
  tabName?: string;
}): FilterChipType[] => [
  { type: "date", dateFilterKeys: DATE_OPTIONS_FILTER_COLOR },
  { type: "select", options: PROMOTION_TYPE_VALUES, keysFilter: PROMOTION_TYPE_FILTER },
  { type: "select", options: PROMOTION_METHOD_VALUES, keysFilter: PROMOTION_METHOD_FILTER },
  {
    type: "select",
    options: map(userSlice.activeUsers, (item) => ({ label: item.name, value: item.id })),
    keysFilter: PROMOTION_CREATED_BY_FILTER,
  },
  {
    type: "select",
    options: PROMOTION_STATUS_VALUES,
    keysFilter: {
      label: "status",
      title: "Trạng thái",
      disabled: tabName === "ALL" ? false : true,
    },
  },
];

const convertListAvailableVariantToSheetCellString = (
  variants: { id: string; quantity: number; variant: AttributeVariant }[]
) => {
  return variants.reduce((prev, cur) => {
    const availableVariant = `SKU: ${cur.variant.SKU_code}\nTên SP: ${cur.variant.name}\nSố lượng: ${cur.quantity} \n\n`;
    return `${prev}${availableVariant}`;
  }, "");
};

const convertRequirementToSheetCellString = (requirements: PromotionRequireType[]) => {
  return requirements.reduce((prev, cur) => {
    const requirementType =
      cur.requirement_type === "QUANTITY_MIN" ? "Số lượng yêu cầu" : "Tổng đơn hàng";
    const limitType =
      cur.limit_type === "QUANTITY_MAX" ? "Giới hạn số tiền" : "Giới hạn số lượng sản phẩm";
    const value = cur.limit || cur.requirement;
    const requirementItem = value ? `- ${requirementType || limitType}: ${value}\n` : "";
    return `${prev}${requirementItem}`;
  }, "");
};

export const formatExportPromotionData = (item: PromotionType) => {
  const convertItem: { [key: string]: string } = {
    [vi.promotion.name]: item.name,
    [vi.promotion.content]: item.note,
    [vi.promotion.created]: fDateTime(item.created)?.toString() || "",
    [vi.promotion.date_start]: fDateTime(item.date_start)?.toString() || "",
    [vi.promotion.date_end]: fDateTime(item.date_end)?.toString() || "",
    [vi.promotion.created_by]: item.created_by?.name || "",
    [vi.promotion.type]: item.type === PROMOTION_TYPE.VARIANT ? "Sản phẩm" : "Đơn hàng",
    [vi.promotion.status]:
      item.status === "ACTIVED"
        ? "Đang hoạt động"
        : item.status === "INACTIVED"
        ? "Chưa hoạt động"
        : "Ngừng hoạt động",
    [vi.promotion.discount_method]:
      item.discount_method === DISCOUNT_METHOD.AMOUNT
        ? "Giá trị"
        : item.discount_method === DISCOUNT_METHOD.COMBO
        ? "Sản phẩm"
        : "Phần trăm",
    [vi.promotion.discount_amount]: item.discount_amount?.toString(),
    [vi.promotion.discount_percent]: item.discount_percent?.toString(),
    // applied_variant: item.applied_variant?.name,
    [vi.promotion.applied_variant_name]: item.applied_variant?.name,
    [vi.promotion.applied_variant_sku]: item.applied_variant?.SKU_code,
    [vi.promotion.available_variants]: convertListAvailableVariantToSheetCellString(
      item.available_variants || []
    ),
    [vi.promotion.combo_times]: item.combo_times?.toString(),
    [vi.promotion.requirements]: convertRequirementToSheetCellString(item.requirements || []),
  };

  return convertItem;
};

export const handleFormatPromotionBody = (form: PromotionType) => {
  // prettier-ignore
  const { date_start, date_end, discount_method, discount_amount, discount_percent, applied_variant, type, product_selected } = form;

  let promotionBody: Omit<Partial<PromotionType>, "applied_variant" | "available_variants"> & {
    applied_variant?: string;
    available_variants?: { variant: string; quantity: number }[];
  } = {
    ...form,
    // khi type là VARIANT thì mới có applied_variant
    applied_variant:
      applied_variant && type === PROMOTION_TYPE.VARIANT ? applied_variant.id : undefined,
    // khi type là VARIANT và discount_method là PRODUCT thì mới có available_variants
    available_variants:
      product_selected?.length &&
      type === PROMOTION_TYPE.VARIANT &&
      discount_method === DISCOUNT_METHOD.COMBO
        ? map(product_selected, (item) => ({
            variant: item.id || "",
            quantity: item.quantity || 0,
            batch: item.batch?.id,
            warehouse: item.warehouse?.id,
          }))
        : undefined,
    // discount_method là AMOUNT thì mới có discount_amount
    discount_amount: discount_method === DISCOUNT_METHOD.AMOUNT ? discount_amount : undefined,
    // discount_method là PERCENTAGE thì mới có discount_percent
    discount_percent: discount_method === DISCOUNT_METHOD.PERCENTAGE ? discount_percent : undefined,
    product_selected: undefined,
    date_end: date_end ? format(new Date(date_end), yyyy_MM_dd_HH_mm_ss) : undefined,
    date_start: date_start ? format(new Date(date_start), yyyy_MM_dd_HH_mm_ss) : undefined,
  };

  promotionBody = omit(promotionBody, ["created_by", "created", "modified", "modified_by"]);

  return promotionBody;
};
