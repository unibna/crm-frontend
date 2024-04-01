import {
  ChangeSet,
  Column,
  EditingColumnExtension,
  GridColumnExtension,
  Grouping,
  GroupSummaryItem,
  SummaryItem,
  TableColumnWidthInfo,
  TableHeaderRow,
} from "@devexpress/dx-react-grid";
import React from "react";

export interface ColumnShowSortType {
  name: string;
  fields: {
    title: string;
    name: string;
  }[];
}

export interface DGridType<ParamType = any, RowType = any, ValidationCellType = any> {
  cellStyle?: React.CSSProperties;
  disableExcuteRowPath?: string;

  // vị trí cột
  defaultColumnOrders: string[];
  columnOrders: string[];
  setColumnOrders: React.Dispatch<React.SetStateAction<string[]>>;
  //ẩn cột
  hiddenColumnNames: string[];
  defaultHiddenColumnNames: string[];
  setHiddenColumnNames: React.Dispatch<React.SetStateAction<string[]>>;
  //độ rộng cột
  defaultColumnWidths: TableColumnWidthInfo[];
  columnWidths: TableColumnWidthInfo[];
  setColumnWidths: React.Dispatch<React.SetStateAction<TableColumnWidthInfo[]>>;
  // định nghĩa cột
  columns: Column[];
  // full height table hoặc
  isFullRow: boolean;
  setFullRow: React.Dispatch<React.SetStateAction<boolean>>;
  iconFullRowVisible?: "detail" | "edit" | "selection";
  //sort data theo label cột
  columnShowSort?: ColumnShowSortType[];
  setColumnShowSort?: React.Dispatch<ColumnShowSortType[]>;
  sortingStateColumnExtensions?: { columnName: string; sortingEnabled: boolean }[];
  // summary cột
  summaryColumns: SummaryItem[];
  SummaryColumnsComponent: ({
    column,
    row,
    value,
  }: {
    column?: {
      name: string;
      title: string;
    };
    row?: RowType;
    value: string;
  }) => JSX.Element;
  totalRow: { [key: string]: string | number };

  //fix columns
  fixLeftColumns?: (string | symbol)[];
  fixRightColumns?: (string | symbol)[];

  //gom nhóm dòng
  grouping: Grouping[];
  groupSummaryItems: GroupSummaryItem[];
  formatGroupingItem: (cellProps: { columnName: string; value: string; row: any }) => string;

  //select dòng
  selection: (number | string)[];
  setSelection: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  showSelectAll?: boolean;
  //modal update item
  editRowChangeForInline: (changes: ChangeSet) => void;
  editInline: boolean;
  editComponent: ({
    onApplyChanges,
    onCancelChanges,
    onChange,
    editingRowIds,
    row,
    open,
  }: {
    row: RowType;
    onChange: ({ name, value }: { name: string; value: any }) => void;
    onApplyChanges: () => void;
    onCancelChanges: () => void;
    open: boolean;
    editingRowIds?: number[] | undefined;
  }) => JSX.Element;

  params: ParamType;
  setParams: React.Dispatch<React.SetStateAction<any>>;
  data: {
    data: RowType[];
    loading?: boolean;
    count: number;
  };

  // detail row
  detailComponent: ({ row }: { row: RowType }) => React.ReactElement<any, any> | null;
  // bao gồm các cột để format row data
  children: React.ReactNode | React.ReactElement | JSX.Element;

  //
  validationCellStatus: ValidationCellType;
  columnExtensions: GridColumnExtension[];
  columnEditExtensions: EditingColumnExtension[];

  //header cell
  headerCellComponent: (
    cellProps: React.PropsWithChildren<TableHeaderRow.CellProps>
  ) => JSX.Element;
  //
  heightTable?: number | "auto";
  hiddenPagination?: boolean;
  headerStyle?: React.CSSProperties;
  tableWrapStyles?: React.CSSProperties;
  isShowPrintStatus?: boolean;
}

export type DGridDataType<T> = {
  data: T[];
  loading: boolean;
  count: number;
  next?: string | null;
  previous?: string | null;
};
