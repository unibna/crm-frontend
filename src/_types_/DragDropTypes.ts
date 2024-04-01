export interface RowDrop {
  id: string,
  label: string,
  value: string | number,
  columnData: ColumnDrop[],
  [key: string]: any
}

export interface ColumnDrop {
  id: string;
  label: string;
  [key: string]: any;
}