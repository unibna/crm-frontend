import { Column } from "@devexpress/dx-react-grid";
import { RangeDateV2Props } from "components/Pickers/RangeDateV2";
import { MultiSelectProps } from "components/Selectors/MultiSelect";
import React from "react";

export type FilterOptionProps = {
  type: "select" | "time";
  multiSelectProps?: MultiSelectProps;
  timeProps?: RangeDateV2Props;
  key?: string;
} | null;

export interface HeaderType {
  tableTitle?: string;

  columns: Column[];

  hiddenColumnNames: string[];
  setHiddenColumnNames: React.Dispatch<React.SetStateAction<string[]>>;

  isFullRow: boolean;
  setFullRow: React.Dispatch<React.SetStateAction<boolean>>;

  params: any;
  setParams: (payload: any) => void;

  exportData: any[];
  exportFileName?: string;
  exportFileToEmailProps?: {
    endpoint: string;
    service: any;
    keysMap?: any;
  };
  formatExportFunc?: (item: any) => any;

  onSearch: (value: string) => void;
  onRefresh?: () => void;

  filterChipCount?: number;
  setFilterChipCount?: (value: number) => void;
  filterOptions: FilterOptionProps[];

  children?: React.ReactNode | JSX.Element;
}
