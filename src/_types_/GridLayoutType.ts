export type GridLayoutType = boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridWrapType {
  xs?: GridLayoutType;
  sm?: GridLayoutType;
  md?: GridLayoutType;
  lg?: GridLayoutType;
  xl?: GridLayoutType;
}

export type GridSizeType = false | "sm" | "xs" | "md" | "lg" | "xl";