export interface DateFilterType {
  title: string;
  keyFilters: [
    { label: string; color?: string; title?: string },
    { label: string; color?: string; title?: string },
    { label: string; color?: string; title?: string }
  ];
}
[];

export interface KeysFilterType {
  label: string;
  // color?: string;
  title?: string;
  disabled?: boolean;
}

export interface ChipFilterType {
  title: string;
  keyFilters: KeysFilterType[];
}
