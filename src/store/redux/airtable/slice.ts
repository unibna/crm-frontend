import { ItemColumns, ItemColumnsDatagrid } from "_types_/ColumnType";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

// Constants & Utils
import { columnShowCskh } from "views/CskhView/constants";
import { yyyy_MM_dd } from "constants/time";

// Libraries
import produce from "immer";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { CskhType } from "_types_/CskhType";

export const handleToggleVisibleColumn = (
  column: any,
  arrColumnsShow: ColumnTypeDefault<CskhType>[] = [],
  arrResultColumnsShow: ColumnTypeDefault<CskhType>[] = []
) => {
  const { isShow, name } = column;
  let resultColumnsShow = [];
  const index = arrColumnsShow.findIndex((item) => item.name === name);
  const columnsShow = produce(arrColumnsShow, (draft) => {
    draft[index].isShow = !isShow;
  });

  if (isShow) {
    resultColumnsShow = arrResultColumnsShow.filter((item) => item.name !== name);
  } else {
    resultColumnsShow = columnsShow.filter((item: ColumnTypeDefault<CskhType>) => item.isShow);
  }

  return {
    columnsShow,
    resultColumnsShow,
    countShowColumn: resultColumnsShow.length,
  };
};

export const handleChangeColumnOrders = (
  payload: any,
  arrResultColumnsShow: ColumnTypeDefault<CskhType>[] = []
) => {
  const { columnsOrder } = payload;
  const arrResult = columnsOrder.reduce((prevArr: any, name: string) => {
    const column = arrResultColumnsShow.find((item) => item.name === name);
    return [...prevArr, column];
  }, []);

  return {
    resultColumnsShow: arrResult,
  };
};

export interface AirtableState {
  cskh: ItemColumnsDatagrid<CskhType>;
  params: any;
}

const initialState: AirtableState = {
  cskh: {
    columnsShow: columnShowCskh.columnsShowHeader,
    resultColumnsShow: columnShowCskh.columnsShowHeader,
    countShowColumn: columnShowCskh.columnsShowHeader.length,
    columnsWidthResize: columnShowCskh.columnWidths,
    columnSelected: [],
  },
  params: {
    created_dateValue: 31,
    created_from: format(subDays(new Date(), 30), yyyy_MM_dd),
    created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  },
};

export const airtableSlice = createSlice({
  name: "airtable",
  initialState,
  reducers: {
    updateCskh: (state, action) => {
      const { payload } = action;
      const { cskh } = state;
      const columns = handleToggleVisibleColumn(payload, cskh.columnsShow, cskh.resultColumnsShow);

      state.cskh = {
        ...cskh,
        ...columns,
      };
    },
    resizeColumnCskh: (state, action) => {
      const { payload } = action;
      const { cskh } = state;

      state.cskh = {
        ...cskh,
        ...payload,
      };
    },
    updateColumnOrderCskh: (state, action) => {
      const { payload } = action;
      const { cskh } = state;
      const columns = handleChangeColumnOrders(payload, cskh.resultColumnsShow);

      state.cskh = {
        ...cskh,
        ...columns,
      };
    },
    updateParams: (state, action) => {
      const { payload } = action;

      state.params = {
        ...state.params,
        ...payload,
      };
    },
  },
});

export const airtableStore = (state: RootState) => state.airtable;
export default airtableSlice.reducer;
