export interface SortType {
  columnName: string;
  direction: DIRECTION_SORT_TYPE;
}
export enum DIRECTION_SORT_TYPE {
  ASC = "asc",
  DESC = "desc",
}

export enum SORT_TYPE {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}
