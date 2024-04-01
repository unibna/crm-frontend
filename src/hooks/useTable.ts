import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnActionTypes, TableActions } from "_types_/ColumnType";
import { DGridType } from "_types_/DGridType";
import { useReducer } from "react";

export interface TableProps {
  // defaultColumnOrders: string[];
  columnOrders: string[];
  //ẩn cột
  hiddenColumnNames: string[];
  // defaultHiddenColumnNames: string[];
  //độ rộng cột
  // defaultColumnWidths: TableColumnWidthInfo[];
  columnWidths: TableColumnWidthInfo[];
  // định nghĩa cột
  columns: Column[];
  // full height table hoặc
  isFullRow: boolean;

  params?: any;
  //   iconFullRowVisible: "detail" | "edit" | "selection";
  //sort data theo label cột
  //   columnShowSort: ColumnShowSortType[];
  // summary cột
  //   summaryColumns: SummaryItem[];
  //   SummaryColumnsComponent: ({
  //     column,
  //     row,
  //     value,
  //   }: {
  //     column?: {
  //       name: string;
  //       title: string;
  //     };
  //     row?: RowType;
  //     value: string;
  //   }) => JSX.Element;
  //   totalRow: { [key: string]: string | number };

  //fix columns
  //   fixLeftColumns?: (string | symbol)[];
  //   fixRightColumns?: (string | symbol)[];

  //gom nhóm dòng
  //   grouping: Grouping[];
  //   groupSummaryItems: GroupSummaryItem[];
  //   formatGroupingItem: (cellProps: { columnName: string; value: string; row: any }) => string;

  //select dòng
  //   selection: (number | string)[];
  //   setSelection: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  //   showSelectAll?: boolean;
  //modal update item
  //   editRowChangeForInline: (changes: ChangeSet) => void;
  //   editInline: boolean;
  //   editComponent: ({
  //     onApplyChanges,
  //     onCancelChanges,
  //     onChange,
  //     editingRowIds,
  //     row,
  //     open,
  //   }: TEditProps<RowType>) => JSX.Element;
  //   editButtonLabel?: string;

  // detail row
  //   detailComponent: ({ row }: { row: RowType }) => React.ReactElement<any, any> | null;

  //
  //   columnExtensions: GridColumnExtension[];
  //   columnEditExtensions: GridColumnExtension[];
}

// const useTable = (props: TableProps) => {
//   const {
//     columnOrders,
//     columnWidths,
//     columns,
//     // defaultColumnOrders,
//     // defaultColumnWidths,
//     hiddenColumnNames,
//     //
//     // SummaryColumnsComponent,
//     // columnEditExtensions,
//     // columnExtensions,
//     // columnShowSort,
//     // detailComponent,
//     // editComponent,
//     // editInline,
//     // editRowChangeForInline,
//     // formatGroupingItem,
//     // groupSummaryItems,
//     // grouping,
//     // iconFullRowVisible,
//     isFullRow,
//     // selection,
//     // setSelection,
//     // summaryColumns,
//     // totalRow,
//     // editButtonLabel,
//     // fixLeftColumns,
//     // fixRightColumns,
//     // showSelectAll,
//   } = props;
//   const [useColumns, useSetColumns] = useState(columns);
//   const [useColumnOrders, useSetColumnOrders] = useState(
//     columnOrders || map(columns, (item) => item.name)
//   );
//   const [useColumnWidths, useSetColumnWidths] = useState(columnWidths);
//   const [useHiddenColumnNames, useSetHiddenColumnNames] = useState(hiddenColumnNames);
//   const [useIsFullRow, useSetIsFullRow] = useState(isFullRow);

//   return {
//     uC: useColumns,
//     uSetC: (payload: Column[]) => useSetColumns(payload),
//     uCO: useColumnOrders,
//     uSetCO: (payload: string[]) => useSetColumnOrders(payload),
//     uCW: useColumnWidths,
//     uSetCW: (payload: TableColumnWidthInfo[]) => useSetColumnWidths(payload),
//     uHC: useHiddenColumnNames,
//     uSetHC: (payload: string[]) => useSetHiddenColumnNames(payload),
//     uFR: useIsFullRow,
//     uSetFR: (payload: boolean) => useSetIsFullRow(payload),
//   };
// };

// export default useTable;

const Reducer = (state: Partial<DGridType>, action: TableActions): Partial<DGridType> => {
  switch (action.type) {
    case ColumnActionTypes.SetCO:
      return {
        ...state,
        columnOrders: action.payload.columnOrders,
      };
    case ColumnActionTypes.SetCW:
      return {
        ...state,
        columnWidths: action.payload.columnWidths,
      };
    case ColumnActionTypes.SetIsFullRow:
      return {
        ...state,
        isFullRow: action.payload.isFullRow,
      };
    case ColumnActionTypes.SetHC:
      return {
        ...state,
        hiddenColumnNames: action.payload.hiddenColumns,
      };
    case ColumnActionTypes.SetParams:
      return {
        ...state,
        params: action.payload.params,
      };

    default:
      return state;
  }
};

const useTable = ({
  columnWidths,
  columnOrders,
  params,
  hiddenColumnNames,
  isFullRow,
  columns,
}: TableProps): Partial<DGridType> => {
  const [state, dispatch] = useReducer(Reducer, {
    columnWidths,
    columnOrders,
    params,
    hiddenColumnNames,
    isFullRow,
    columns,
  });

  const setColumnWidths = (payload: TableColumnWidthInfo[]) => {
    dispatch({
      type: ColumnActionTypes.SetCW,
      payload: {
        columnWidths: payload,
      },
    });
  };
  const setColumnOrders = (payload: string[]) => {
    dispatch({
      type: ColumnActionTypes.SetCO,
      payload: {
        columnOrders: payload,
      },
    });
  };
  const setParams = (payload: any) => {
    dispatch({
      type: ColumnActionTypes.SetParams,
      payload: {
        params: payload,
      },
    });
  };
  const setHiddenColumnNames = (payload: string[]) => {
    dispatch({
      type: ColumnActionTypes.SetHC,
      payload: {
        hiddenColumns: payload,
      },
    });
  };
  const setFullRow = (payload: boolean) => {
    dispatch({
      type: ColumnActionTypes.SetIsFullRow,
      payload: {
        isFullRow: payload,
      },
    });
  };

  return {
    ...state,
    setFullRow,
    setColumnOrders,
    setColumnWidths,
    setHiddenColumnNames,
    setParams,
  };
};

export default useTable;
