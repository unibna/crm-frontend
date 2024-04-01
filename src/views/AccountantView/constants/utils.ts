import { CollationType } from "_types_/CollationType";
import { SHIPPING_COMPANIES } from "_types_/GHNType";
import { FilterOptionProps } from "_types_/HeaderType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { UserType } from "_types_/UserType";
import { ALL_OPTION, TYPE_FORM_FIELD } from "constants/index";
import vi from "locales/vi.json";
import filter from "lodash/filter";
import find from "lodash/find";
import map from "lodash/map";
import join from "lodash/join";
import { compareDateSelected, fDateTime } from "utils/dateUtil";
import { revertFromQueryForSelector } from "utils/formatParamsUtil";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { ORDER_PAYMENT_TYPE } from "views/OrderView/constants";
import { ORDER_STATUS, PAYMENT_TYPE_VALUES } from "views/OrderView/constants/options";
import { TYPE_SHIPPING_COMPANIES, optionStatusShipping } from "views/ShippingView/constants";
import { FilterChipType } from "components/Tables/HeaderWrapper";

export interface CollationFilter {
  isFilterAmount?: boolean;
  isFilterReceivedDate?: boolean;
  isFilterUploadBy?: boolean;
  isFilterUploadTime?: boolean;
  //
  users?: UserType[];
  params?: any;
  setParams: (payload: any) => void;
}

export const handleDataItem = (value: Partial<any>) => {
  const objStatusShipping = find(
    optionStatusShipping,
    (current) => current.value === value.shipping__carrier_status
  );

  const objStatus: any = find(ORDER_STATUS, (current) => current.value === value.status) || {};

  return {
    status: {
      value: objStatus?.label,
      color: objStatus?.color,
    },
    order_key: {
      value: value.order_key,
      props: { isCallApi: true, value: value.order_key },
    },
    is_printed: {
      value: value.is_printed ? "Đã in" : "Chưa in",
      color: value.is_printed ? "primary" : "error",
    },
    imported: {
      value: value.imported ? "Đã nhập kho" : "Chưa nhập kho",
      color: value.imported ? "primary" : "error",
    },
    exported: {
      value: value.exported ? "Đã xuất kho" : "Chưa xuất kho",
      color: value.exported ? "primary" : "error",
    },
    source__name: {
      value: value.source__name,
      color: "info",
    },
    tags__name: {
      value: value.tags__name,
      color: "warning",
    },
    shipping__delivery_company_name: {
      value: value.shipping__delivery_company_name,
      color: "warning",
    },
    shipping__carrier_status: {
      value: objStatusShipping?.label,
      color: objStatusShipping?.color,
    },
  };
};

export const filterData = ({
  optionCreatedBy,
  optionChannel,
  optionTags,
}: {
  optionCreatedBy: SelectOptionType[];
  optionChannel: SelectOptionType[];
  optionTags: SelectOptionType[];
}) => {
  return [
    {
      style: { width: 200 },
      title: "Trạng thái đơn",
      options: [{ label: "Tất cả", value: "all" }, ...ORDER_STATUS],
      label: "status",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Người tạo đơn",
      options: [{ label: "Tất cả", value: "all" }, ...optionCreatedBy],
      label: "created_by",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Kênh bán hàng",
      options: [{ label: "Tất cả", value: "all" }, ...optionChannel],
      label: "source",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Thẻ",
      options: [{ label: "Tất cả", value: "all" }, ...optionTags],
      label: "tags",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Trạng thái in đơn",
      options: [
        { label: "Tất cả", value: "all" },
        { label: "Đã in", value: "true" },
        { label: "Chưa in", value: "false" },
      ],
      label: "is_printed",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Đơn Crossale",
      options: [
        { label: "Tất cả", value: "all" },
        { label: "Đơn CrossSale", value: "true" },
        { label: "Không phải đơn CrossSale", value: "false" },
      ],
      label: "is_cross_sale",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Trạng thái giao hàng",
      options: optionStatusShipping,
      label: "carrier_status",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "PT thanh toán",
      options: [{ label: "Tất cả", value: "all" }, ...PAYMENT_TYPE_VALUES],
      label: "payment_type",
      defaultValue: "all",
    },
    {
      style: { width: 200 },
      title: "Đơn vị vận chuyển",
      options: [
        { label: "Tất cả", value: "all" },
        ...filter(TYPE_SHIPPING_COMPANIES, (item) => item.value !== SHIPPING_COMPANIES.NONE),
      ],
      label: "delivery_company",
      defaultValue: "all",
    },
    {
      type: TYPE_FORM_FIELD.DATE,
      title: "Ngày tạo",
      keyDateFrom: "created_from",
      keyDateTo: "created_to",
      keyDateValue: "created_dateValue",
    },
    {
      type: TYPE_FORM_FIELD.DATE,
      title: "Ngày xác nhận",
      keyDateFrom: "completed_time_from",
      keyDateTo: "completed_time_to",
      keyDateValue: "completed_time_dateValue",
    },
    {
      type: TYPE_FORM_FIELD.DATE,
      title: "Ngày hoàn thành",
      keyDateFrom: "shipping_finished_from",
      keyDateTo: "shipping_finished_to",
      keyDateValue: "shipping_finished_dateValue",
    },
  ];
};

const selectorStyle: React.CSSProperties = { width: 180 };
const datePickerStyle = { width: 180, marginLeft: 1 };

export const collationOptions = ({
  isFilterAmount,
  isFilterReceivedDate,
  isFilterUploadBy,
  isFilterUploadTime,
  users,
  params,
  setParams,
}: CollationFilter): FilterOptionProps[] => [
  isFilterUploadBy
    ? {
        key: "upload_by",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.upload_by,
          options: [ALL_OPTION, ...map(users, formatOptionSelect)] as SelectOptionType[],
          onChange: (value: any) => setParams({ ...params, upload_by: value }),
          defaultValue: revertFromQueryForSelector(params?.upload_by),
          selectorId: "upload_by",
        },
      }
    : null,
  isFilterAmount
    ? {
        key: "amount",
        type: "select",
        multiSelectProps: {
          style: selectorStyle,
          title: vi.amount,
          simpleSelect: true,
          options: [
            ALL_OPTION,
            { label: "0 - 1.000.000", value: "0-1000000" },
            { label: "1.000.000 - 10.000.000", value: "1000000-10000000" },
            { label: "10.000.000 - 50.000.000", value: "10000000-50000000" },
            { label: "50.000.000 - 100.000.000", value: "50000000-100000000" },
            { label: "> 100.000.000", value: "100000000" },
          ],
          onChange: (value: any) => {
            const [amount_gte, amount_lte] = value.split("-");
            setParams({ ...params, amount_gte, amount_lte, amountValue: value });
          },
          defaultValue: revertFromQueryForSelector(params?.amountValue),
          selectorId: "amount",
        },
      }
    : null,
  isFilterReceivedDate
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          label: vi.receive_time,
          sxProps: datePickerStyle,
          created_from: params?.receive_date_from,
          created_to: params?.receive_date_to,
          handleSubmit: (
            receive_date_from: string,
            receive_date_to: string,
            receivedDate: string | number
          ) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(receive_date_from, receive_date_to, receivedDate);
            setParams?.({
              ...params,
              receive_date_from: date_from,
              receive_date_to: date_to,
              receivedDate: toValue,
            });
          },
          defaultDateValue: params?.receivedDate,
        },
      }
    : null,
  isFilterUploadTime
    ? {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          label: vi.upload_time,
          sxProps: datePickerStyle,
          created_from: params?.upload_at_from,
          created_to: params?.upload_at_to,
          handleSubmit: (
            upload_at_from: string,
            upload_at_to: string,
            uploadAt: string | number
          ) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(upload_at_from, upload_at_to, uploadAt);
            setParams?.({
              ...params,
              upload_at_from: date_from,
              upload_at_to: date_to,
              uploadAt: toValue,
            });
          },
          defaultDateValue: params?.uploadAt,
        },
      }
    : null,
];

export const collationChipOptions = ({
  users,
}: {
  users?: UserType[];
}): FilterChipType[] | undefined => [
  {
    type: "date",
    dateFilterKeys: [
      {
        title: "Ngày nhận",
        keyFilters: [
          { label: "receive_date_from", title: "Ngày nhận từ" },
          { label: "receive_date_to", title: "Ngày nhận đến" },
          { label: "receivedDate" },
        ],
      },
    ],
  },
  {
    type: "date",
    dateFilterKeys: [
      {
        title: "Ngày up file",
        keyFilters: [
          { label: "upload_at_from", title: "Ngày up từ" },
          { label: "upload_at_to", title: "Ngày up đến" },
          { label: "receivedDate" },
        ],
      },
    ],
  },
  {
    type: "select",
    keysFilter: {
      label: "upload_by",
      title: "Người Upload",
    },
    options: map(users, formatOptionSelect),
  },
  {
    type: "select",
    keysFilter: {
      label: "amountValue",
      title: vi.amount,
    },
    isSimpleSelector: true,
    options: [
      { label: "0 - 1.000.000", value: "0-1000000" },
      { label: "1.000.000 - 10.000.000", value: "1000000-10000000" },
      { label: "10.000.000 - 50.000.000", value: "10000000-50000000" },
      { label: "50.000.000 - 100.000.000", value: "50000000-100000000" },
      { label: "> 100.000.000", value: "100000000" },
    ],
  },
];

export const formatExportCollationFunc = (item: CollationType) => {
  const deliveryStatus = find(
    optionStatusShipping,
    (status) => status.value === item.delivery_status?.toString()
  );

  const images = map(item["images"], (image) => image.image);
  const paymentMethod = ORDER_PAYMENT_TYPE[item.payment_method]?.value;

  return {
    [vi.collation["3rd_cod_amount"]]: item["3rd_cod_amount"] || 0,
    [vi.collation["3rd_cod_transfer_date"]]: fDateTime(item["3rd_cod_transfer_date"]),
    [vi.collation["amount"]]: item["amount"],
    [vi.collation["delivery_status"]]: deliveryStatus?.label,
    [vi.collation["file_amount"]]: item["file_amount"],
    [vi.collation["file_name"]]: item["file_name"],
    [vi.collation["images"]]: join(images, " "),
    [vi.collation["is_confirm"]]: item["is_confirm"] ? "Đã xác nhận" : "",
    [vi.collation["order_key"]]: item["order_key"],
    [vi.collation["payment"]]: item["payment"],
    [vi.collation["payment_method"]]: paymentMethod,
    [vi.collation["receive_time"]]: fDateTime(item["receive_time"]),
    [vi.collation["shipping_unit"]]: item["shipping_unit"],
    [vi.collation["transaction_code"]]: item["transaction_code"],
    [vi.collation["upload_at"]]: fDateTime(item["upload_at"]),
    [vi.collation["upload_by"]]: item["upload_by"]?.name,
  };
};
