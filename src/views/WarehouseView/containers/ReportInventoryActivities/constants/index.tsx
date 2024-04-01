import { TYPE_FORM_FIELD } from "constants/index";
import { NameSheetWarehouse } from "views/WarehouseView/constants";
import { ALL_OPTION } from "constants/index";

import { ColumnShowDatagrid } from "_types_/FacebookType";
import { IReportInventoryActivities, TypeWarehouseSheet } from "_types_/WarehouseType";

export const columnShowReportInventoryActivities: ColumnShowDatagrid<IReportInventoryActivities> = {
  columnWidths: [
    { columnName: "sheet__confirmed_date__date", width: 160 },
    { columnName: "sheet__sheet_reason__name", width: 190 },
    { columnName: "sheet__sheet_reason__type", width: 120 },
    { columnName: "variant_batch__variant__name", width: 500 },
    { columnName: "variant_batch__variant__SKU_code", width: 180 },
    { columnName: "warehouse__name", width: 150 },
    { columnName: "variant_batch__batch_name", width: 150 },
    { columnName: "quantity_import", width: 140 },
    { columnName: "quantity_export", width: 140 },
  ],
  columnsShowHeader: [
    {
      name: "sheet__confirmed_date__date",
      title: "Ngày xác nhận phiếu",
      isShow: true,
    },
    {
      name: "sheet__sheet_reason__name",
      title: "Lí do tạo phiếu",
      isShow: true,
    },

    {
      name: "variant_batch__variant__name",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "variant_batch__variant__SKU_code",
      title: "SKU",
      isShow: true,
    },

    {
      name: "warehouse__name",
      title: "Kho",
      isShow: true,
    },
    {
      name: "variant_batch__batch_name",
      title: "Lô",
      isShow: true,
    },
    {
      name: "sheet__sheet_reason__type",
      title: "Loại phiếu",
      isShow: true,
    },
    {
      name: "quantity_import",
      title: "Số lượng nhập",
      isShow: true,
    },
    {
      name: "quantity_export",
      title: "Số lượng xuất",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "sheet__confirmed_date__date",
      column: "sheet__confirmed_date__date",
      title: "Ngày xác nhận phiếu",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "sheet__sheet_reason__name",
      column: "sheet__sheet_reason__name",
      title: "Lí do tạo phiếu",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "variant_batch__variant__name",
      column: "variant_batch__variant__name",
      title: "Sản phẩm",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "variant_batch__variant__SKU_code",
      column: "variant_batch__variant__SKU_code",
      title: "SKU",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "warehouse__name",
      column: "warehouse__name",
      title: "Kho",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "variant_batch__batch_name",
      column: "variant_batch__batch_name",
      title: "Lô",
      isShow: true,
      isShowTitle: false,
    },

    {
      name: "sheet__sheet_reason__type",
      column: "sheet__sheet_reason__type",
      title: "Loại phiếu",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "quantity_import",
      column: "quantity_import",
      title: "Số lượng nhập",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "quantity_export",
      column: "quantity_export",
      title: "Số lượng xuất",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const OPTIONS_SHEET_TYPE: { label: string; value: string; color?: string } | any = [
  ALL_OPTION,
  {
    label: NameSheetWarehouse.IP,
    value: TypeWarehouseSheet.IMPORTS,
    color: "info",
  },
  {
    label: NameSheetWarehouse.EP,
    value: TypeWarehouseSheet.EXPORTS,
    color: "error",
  },
  {
    label: NameSheetWarehouse.TF,
    value: TypeWarehouseSheet.TRANSFER,
    color: "warning",
  },
];

export const dataRenderHeaderDefault = [
  {
    style: {
      width: 200,
    },
    title: "Loại phiếu",
    options: OPTIONS_SHEET_TYPE,
    label: "sheet_type",
    defaultValue: ALL_OPTION.value,
  },
  {
    type: TYPE_FORM_FIELD.DATE,
    title: "Thời gian",
    keyDateFrom: "date_from",
    keyDateTo: "date_to",
    keyDateValue: "dateValue",
  },
];

export const paramsGetDefault = ["date_from", "date_to", "cancelToken", "dimentions", "sheet_type"];

export enum REPORT_DIMENSIONS {
  DATE = "DATE",
  REASON = "REASON",
  VARIANT = "VARIANT",
  VARIANT_BATCH = "VARIANT_BATCH",
  WAREHOUSE = "WAREHOUSE",
}

export enum REPORT_DIMENSION_LABELS {
  DATE = "Theo ngày",
  REASON = "Theo lí do",
  VARIANT = "Theo sản phẩm",
  WAREHOUSE = "Theo kho",
  VARIANT_BATCH = "Theo lô",
}

export const OPTIONS_REPORT_DIMENSIONS: any = [
  ALL_OPTION,
  {
    label: REPORT_DIMENSION_LABELS.DATE,
    value: REPORT_DIMENSIONS.DATE,
    columns: ["sheet__confirmed_date__date"],
  },
  {
    label: REPORT_DIMENSION_LABELS.REASON,
    value: REPORT_DIMENSIONS.REASON,
    columns: ["sheet__sheet_reason__name", "sheet__sheet_reason__type"],
  },
  {
    label: REPORT_DIMENSION_LABELS.VARIANT,
    value: REPORT_DIMENSIONS.VARIANT,
    columns: ["variant_batch__variant__name", "variant_batch__variant__SKU_code"],
  },
  {
    label: REPORT_DIMENSION_LABELS.VARIANT_BATCH,
    value: REPORT_DIMENSIONS.VARIANT_BATCH,
    columns: ["variant_batch__batch_name"],
  },
  {
    label: REPORT_DIMENSION_LABELS.WAREHOUSE,
    value: REPORT_DIMENSIONS.WAREHOUSE,
    columns: ["warehouse__name"],
  },
];
