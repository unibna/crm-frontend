import map from "lodash/map";
import filter from "lodash/filter";
import reduce from "lodash/reduce";
import produce from "immer";
import { DIRECTION_SORT_TYPE, SortType } from "_types_/SortType";
import {
  HEIGHT_DEVICE,
  HEIGHT_HEADER_BAR_APP,
  HEIGHT_PAGINATION_TABLE,
  WIDTH__DEVICE,
} from "constants/index";
import { ColumnTypeDefault } from "_types_/ColumnType";

export const BOTTOM_PAGE_HEIGHT = 45; // độ cao dòng license
const PROCCESS_HEIGHT = 10; // trừ thêm proccess height để khi kéo xuống cuối bảng vẫn có thể thấy loading của table
const LAYOUT_PADDING_WIDTH = 200;
const TAB_PANNEL_WIDTH = 120;
const SIDEBAR_WIDTH = 200;

export const handleSizeTable = (isTablet?: boolean, isCollapse?: boolean) => {
  const heightDefault =
    HEIGHT_DEVICE -
    HEIGHT_PAGINATION_TABLE -
    (isTablet ? HEIGHT_HEADER_BAR_APP : 0) -
    BOTTOM_PAGE_HEIGHT -
    PROCCESS_HEIGHT;
  const widthDefault =
    WIDTH__DEVICE - LAYOUT_PADDING_WIDTH - TAB_PANNEL_WIDTH - (isCollapse ? 0 : SIDEBAR_WIDTH);

  return { height: heightDefault, width: widthDefault };
};

export const commitChangesRow = (
  {
    added,
    changed,
    deleted,
  }: {
    added?: readonly any[];
    changed?: {
      [key: string]: any;
    };
    deleted?: readonly (string | number)[];
  },
  data: any
) => handleChageRow(changed, data);

const handleChageRow = (objData: any, data: any) => {
  return produce(data, (draft: any) => {
    const index = Object.keys(objData)[0];
    if (objData[index]) {
      draft[index] = {
        ...draft[index],
        ...objData[index],
      };
    }
  });
};

export const handleChangeSortingTableToParams = (value: SortType[]) => {
  const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

  return { ordering };
};

export const handleChangeParamsToSortingTable = (ordering?: string): SortType[] | undefined => {
  if (ordering) {
    let orderingClone = ordering;
    const direction = orderingClone.slice(0, 1);
    if (direction === "-") {
      return [{ columnName: orderingClone.slice(1), direction: DIRECTION_SORT_TYPE.DESC }];
    }
    return [{ columnName: orderingClone, direction: DIRECTION_SORT_TYPE.ASC }];
  }
  return undefined;
};

export const handleChangeOrderingUtil = (
  columnName: string,
  fieldName: string,
  direction: DIRECTION_SORT_TYPE
) => {
  const sortField = handleChangeSortingTableToParams([{ columnName: fieldName, direction }]);
  const sortColumnName = handleChangeSortingTableToParams([{ columnName: columnName, direction }]);

  return {
    ordering: sortField.ordering,
    orderingParent: sortColumnName.ordering,
  };
};

export const handleToggleVisibleColumn = (
  column: any,
  arrColumnsShow: ColumnTypeDefault<any>[]
) => {
  const columnsShow = map(arrColumnsShow, (item) => {
    return item.name === column.name
      ? {
          ...item,
          isShow: !item.isShow,
        }
      : item;
  });

  const countShowColumn = filter(columnsShow, (item) => item.isShow).length;

  return {
    columnsShow,
    countShowColumn,
  };
};

export const handleChangeColumnOrders = (
  payload: any,
  arrResultColumnsShow: ColumnTypeDefault<any>[]
) => {
  const arrResult = payload.reduce((prevArr: any, name: string) => {
    const column = arrResultColumnsShow.find((item) => item.name === name);
    return [...prevArr, column];
  }, []);

  return {
    resultColumnsShow: arrResult,
  };
};

export const getColumnsShow = (arrColumn: ColumnTypeDefault<any>[]) => {
  return reduce(
    arrColumn,
    (prevArr, current) => {
      return current.isShow ? [...prevArr, current] : prevArr;
    },
    []
  );
};
