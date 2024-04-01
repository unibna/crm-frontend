import {
  AirTableBase,
  AirTableColumn,
  AirTableColumnTypes,
  AirTableField,
  AirTableFieldConfig,
  AirTableOption,
  AirTableView,
  SortItem,
} from "_types_/SkyTableType";

import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isTomorrow,
  isYesterday,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import { Conjunction, Mode, Operator } from "views/AirtableV2/components/Filter/AbstractFilterItem";
import FilterItem from "views/AirtableV2/components/Filter/FilterItem";
import FilterSet from "views/AirtableV2/components/Filter/FilterSet";

import { AirTableColumnRenderViewFuncs, BEFieldType } from "views/AirtableV2/constants";
import { dateIsValid } from "./helpers";

export const checkFilterItem = (item: any, filterItem: FilterItem): boolean => {
  if (filterItem.columnId && filterItem.operator && filterItem.id) {
    let columnValue = item[filterItem.columnId]?.value;

    if (
      !filterItem.value &&
      typeof filterItem.value !== "boolean" &&
      filterItem.operator !== Operator.IS_EMPTY &&
      filterItem.operator !== Operator.IS_NOT_EMPTY
    )
      return true;
    switch (filterItem.operator) {
      case Operator.EQUAL:
        return +columnValue === +filterItem.value;

      case Operator.NOT_EQUAL:
        return +columnValue !== +filterItem.value;

      case Operator.GREATER:
        return +columnValue > +filterItem.value;

      case Operator.SMALLER:
        return +columnValue < +filterItem.value;

      case Operator.GREATER_OR_EQUAL:
        return +columnValue >= +filterItem.value;

      case Operator.SMALLER_OR_EQUAL:
        return +columnValue <= +filterItem.value;

      case Operator.IS_EMPTY:
        return columnValue === null || columnValue === undefined || columnValue === "";

      case Operator.IS_NOT_EMPTY:
        return !(columnValue === null || columnValue === undefined || columnValue === "");
      case Operator.CONTAINS:
        return columnValue?.includes(filterItem.value) || false;
      case Operator.DOES_NOT_CONSTAINS:
        return !columnValue?.includes(filterItem.value) || false;
      case Operator.IS:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.TODAY:
              return dateIsValid(columnValue) && isToday(columnValue);
            case Mode.TOMORROW:
              return dateIsValid(columnValue) && isTomorrow(columnValue);
            case Mode.YESTERDAY:
              return dateIsValid(columnValue) && isYesterday(columnValue);
            case Mode.ONE_WEEK_AGO:
              return (
                dateIsValid(columnValue) &&
                isSameDay(new Date(columnValue), subWeeks(new Date(), 1))
              );
            case Mode.ONE_WEEK_FROM_NOW:
              return false;
            case Mode.ONE_MONTH_AGO:
              return (
                dateIsValid(columnValue) &&
                isSameDay(new Date(columnValue), subMonths(new Date(), 1))
              );
            case Mode.ONE_MONTH_FROM_NOW:
              return false;
            case Mode.NUMBER_OF_DAYS_AGO:
              return (
                dateIsValid(columnValue) &&
                isSameDay(new Date(columnValue), subDays(new Date(), filterItem.value?.value))
              );
            case Mode.NUMBER_OF_DAYS_FROM_NOW:
              return false;
            case Mode.EXACT_DATE:
              return (
                dateIsValid(filterItem.value?.value) &&
                dateIsValid(columnValue) &&
                isSameDay(new Date(filterItem.value?.value), new Date(columnValue))
              );
            default:
              break;
          }
        }

        columnValue = columnValue === "True" ? true : columnValue === "False" ? false : columnValue;
        return columnValue === filterItem.value;

      case Operator.IS_NOT:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.TODAY:
              return !(dateIsValid(columnValue) && isToday(columnValue));
            case Mode.TOMORROW:
              return !(dateIsValid(columnValue) && isTomorrow(columnValue));
            case Mode.YESTERDAY:
              return !(dateIsValid(columnValue) && isYesterday(columnValue));
            case Mode.ONE_WEEK_AGO:
              return !(
                dateIsValid(columnValue) &&
                isSameDay(new Date(columnValue), subWeeks(new Date(), 1))
              );
            case Mode.ONE_WEEK_FROM_NOW:
              return true;
            case Mode.ONE_MONTH_AGO:
              return !(
                dateIsValid(columnValue) &&
                isSameDay(new Date(columnValue), subMonths(new Date(), 1))
              );
            case Mode.ONE_MONTH_FROM_NOW:
              return true;
            case Mode.NUMBER_OF_DAYS_AGO:
              return !(
                dateIsValid(columnValue) &&
                isSameDay(new Date(columnValue), subDays(new Date(), filterItem.value?.value))
              );
            case Mode.NUMBER_OF_DAYS_FROM_NOW:
              return true;
            case Mode.EXACT_DATE:
              return !(
                dateIsValid(filterItem.value?.value) &&
                dateIsValid(columnValue) &&
                isSameDay(new Date(filterItem.value?.value), new Date(columnValue))
              );
            default:
              break;
          }
        }
        return columnValue !== filterItem.value;
      case Operator.IS_ANY_OF:
        return filterItem.value.includes(columnValue);
      case Operator.IS_NONE_OF:
        return !filterItem.value.includes(columnValue);
      case Operator.IS_EXACTLY:
        return (
          Array.isArray(columnValue) &&
          columnValue?.every((id: string) => filterItem.value?.includes(id) || false) &&
          columnValue?.length === filterItem.value.length
        );
      case Operator.HAS_ANY_OF:
        return (
          Array.isArray(columnValue) &&
          filterItem.value?.some((id: string) => columnValue?.includes(id))
        );

      case Operator.HAS_ALL_OF:
        return (
          Array.isArray(columnValue) &&
          filterItem.value?.every((id: string) => columnValue?.includes(id))
        );

      case Operator.HAS_NONE_OF:
        return (
          Array.isArray(columnValue) &&
          !filterItem.value?.every((id: string) => columnValue?.includes(id))
        );
      case Operator.IS_WITHIN:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.THE_PAST_WEEK:
              return (
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), addDays(new Date(), 1)) &&
                isAfter(new Date(columnValue), subWeeks(new Date(), 1))
              );
            case Mode.THE_PAST_MONTH:
              return (
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), addDays(new Date(), 1)) &&
                isAfter(new Date(columnValue), subMonths(new Date(), 1))
              );
            case Mode.THE_PAST_YEAR:
              return (
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), addDays(new Date(), 1)) &&
                isAfter(new Date(columnValue), subYears(new Date(), 1))
              );
            case Mode.THE_NEXT_WEEK:
              return (
                dateIsValid(columnValue) &&
                isAfter(new Date(columnValue), addDays(new Date(), 1)) &&
                isBefore(new Date(columnValue), addWeeks(new Date(), 1))
              );
            case Mode.THE_NEXT_MONTH:
              return (
                dateIsValid(columnValue) &&
                isAfter(new Date(columnValue), addDays(new Date(), 1)) &&
                isBefore(new Date(columnValue), addMonths(new Date(), 1))
              );
            case Mode.THE_NEXT_YEAR:
              return (
                dateIsValid(columnValue) &&
                isAfter(new Date(columnValue), addDays(new Date(), 1)) &&
                isBefore(new Date(columnValue), addYears(new Date(), 1))
              );
            case Mode.THE_PAST_NUMBER_OF_DAYS:
              return (
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), addDays(new Date(), 1)) &&
                isAfter(new Date(columnValue), subDays(new Date(), filterItem.value?.value))
              );
            case Mode.THE_NEXT_NUMBER_OF_DAYS:
              return (
                dateIsValid(columnValue) &&
                isAfter(new Date(columnValue), addDays(new Date(), 1)) &&
                isBefore(new Date(columnValue), addDays(new Date(), filterItem.value?.value))
              );
            default:
              break;
          }
        }

        return true;

      case Operator.IS_BEFORE:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.TODAY:
              return dateIsValid(columnValue) && isBefore(new Date(columnValue), new Date());
            case Mode.TOMORROW:
              return (
                dateIsValid(columnValue) && isBefore(new Date(columnValue), addDays(new Date(), 1))
              );
            case Mode.YESTERDAY:
              return (
                dateIsValid(columnValue) && isBefore(new Date(columnValue), subDays(new Date(), 1))
              );
            case Mode.ONE_WEEK_AGO:
              return (
                dateIsValid(columnValue) && isBefore(new Date(columnValue), subWeeks(new Date(), 1))
              );
            case Mode.ONE_WEEK_FROM_NOW:
              return dateIsValid(columnValue) && isBefore(new Date(columnValue), new Date());
            case Mode.ONE_MONTH_AGO:
              return (
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), subMonths(new Date(), 1))
              );
            case Mode.ONE_MONTH_FROM_NOW:
              return dateIsValid(columnValue) && isBefore(new Date(columnValue), new Date());
            case Mode.NUMBER_OF_DAYS_AGO:
              return (
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), subDays(new Date(), filterItem.value?.value))
              );
            case Mode.NUMBER_OF_DAYS_FROM_NOW:
              return dateIsValid(columnValue) && isBefore(new Date(columnValue), new Date());
            case Mode.EXACT_DATE:
              return !(
                dateIsValid(filterItem.value?.value) &&
                dateIsValid(columnValue) &&
                isBefore(new Date(columnValue), new Date(filterItem.value?.value))
              );
            default:
              break;
          }
        }

        return (
          columnValue &&
          dateIsValid(columnValue) &&
          isBefore(new Date(columnValue), new Date(filterItem.value?.value))
        );
      case Operator.IS_AFTER:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.TODAY:
              return dateIsValid(columnValue) && isAfter(new Date(columnValue), new Date());
            case Mode.TOMORROW:
              return (
                dateIsValid(columnValue) && isAfter(new Date(columnValue), addDays(new Date(), 1))
              );
            case Mode.YESTERDAY:
              return (
                dateIsValid(columnValue) && isAfter(new Date(columnValue), subDays(new Date(), 1))
              );
            case Mode.ONE_WEEK_AGO:
              return (
                dateIsValid(columnValue) && isAfter(new Date(columnValue), subWeeks(new Date(), 1))
              );
            case Mode.ONE_WEEK_FROM_NOW:
              return dateIsValid(columnValue) && isAfter(new Date(columnValue), new Date());
            case Mode.ONE_MONTH_AGO:
              return (
                dateIsValid(columnValue) && isAfter(new Date(columnValue), subMonths(new Date(), 1))
              );
            case Mode.ONE_MONTH_FROM_NOW:
              return dateIsValid(columnValue) && isAfter(new Date(columnValue), new Date());
            case Mode.NUMBER_OF_DAYS_AGO:
              return (
                dateIsValid(columnValue) &&
                isAfter(new Date(columnValue), subDays(new Date(), filterItem.value?.value))
              );
            case Mode.NUMBER_OF_DAYS_FROM_NOW:
              return dateIsValid(columnValue) && isAfter(new Date(columnValue), new Date());
            case Mode.EXACT_DATE:
              return !(
                dateIsValid(filterItem.value?.value) &&
                dateIsValid(columnValue) &&
                isAfter(new Date(columnValue), new Date(filterItem.value?.value))
              );
            default:
              break;
          }
        }

        return (
          columnValue &&
          dateIsValid(columnValue) &&
          isAfter(new Date(columnValue), new Date(filterItem.value?.value))
        );

      case Operator.IS_ON_OR_BEFORE:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.TODAY:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.TOMORROW:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), addDays(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), addDays(new Date(), 1)))
              );
            case Mode.YESTERDAY:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), subDays(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), subDays(new Date(), 1)))
              );
            case Mode.ONE_WEEK_AGO:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), subWeeks(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), subWeeks(new Date(), 1)))
              );
            case Mode.ONE_WEEK_FROM_NOW:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.ONE_MONTH_AGO:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), subMonths(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), subMonths(new Date(), 1)))
              );
            case Mode.ONE_MONTH_FROM_NOW:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.NUMBER_OF_DAYS_AGO:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), subDays(new Date(), filterItem.value?.value)) ||
                  isSameDay(new Date(columnValue), subMonths(new Date(), filterItem.value?.value)))
              );
            case Mode.NUMBER_OF_DAYS_FROM_NOW:
              return (
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.EXACT_DATE:
              return !(
                dateIsValid(filterItem.value?.value) &&
                dateIsValid(columnValue) &&
                (isBefore(new Date(columnValue), new Date(filterItem.value?.value)) ||
                  isSameDay(new Date(columnValue), new Date(filterItem.value?.value)))
              );
            default:
              break;
          }
        }

        return (
          columnValue &&
          dateIsValid(columnValue) &&
          (isBefore(new Date(columnValue), new Date(filterItem.value?.value)) ||
            isSameDay(new Date(columnValue), new Date(filterItem.value?.value)))
        );
      case Operator.IS_ON_OR_AFTER:
        if (filterItem.value?.mode) {
          switch (filterItem.value?.mode) {
            case Mode.TODAY:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.TOMORROW:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), addDays(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), addDays(new Date(), 1)))
              );
            case Mode.YESTERDAY:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), subDays(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), subDays(new Date(), 1)))
              );
            case Mode.ONE_WEEK_AGO:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), subWeeks(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), subWeeks(new Date(), 1)))
              );
            case Mode.ONE_WEEK_FROM_NOW:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.ONE_MONTH_AGO:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), subMonths(new Date(), 1)) ||
                  isSameDay(new Date(columnValue), subMonths(new Date(), 1)))
              );
            case Mode.ONE_MONTH_FROM_NOW:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.NUMBER_OF_DAYS_AGO:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), subDays(new Date(), filterItem.value?.value)) ||
                  isSameDay(new Date(columnValue), subMonths(new Date(), filterItem.value?.value)))
              );
            case Mode.NUMBER_OF_DAYS_FROM_NOW:
              return (
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), new Date()) ||
                  isSameDay(new Date(columnValue), new Date()))
              );
            case Mode.EXACT_DATE:
              return !(
                dateIsValid(filterItem.value?.value) &&
                dateIsValid(columnValue) &&
                (isAfter(new Date(columnValue), new Date(filterItem.value?.value)) ||
                  isSameDay(new Date(columnValue), new Date(filterItem.value?.value)))
              );
            default:
              break;
          }
        }

        return (
          columnValue &&
          dateIsValid(columnValue) &&
          (isAfter(new Date(columnValue), new Date(filterItem.value?.value)) ||
            isSameDay(new Date(columnValue), new Date(filterItem.value?.value)))
        );
      default:
        return true;
    }
  }
  return true;
};

export const checkFilterSet = (item: any, filterSet: FilterSet) => {
  if (filterSet.conjunction === Conjunction.AND) {
    const check = filterSet.filterSet.some((filterItem: FilterItem & FilterSet) =>
      filterItem.conjunction
        ? !checkFilterSet(item, filterItem)
        : !checkFilterItem(item, filterItem)
    );
    return !check;
  }

  const check = filterSet.filterSet.some((filterItem: FilterItem & FilterSet) =>
    filterItem.conjunction ? checkFilterSet(item, filterItem) : checkFilterItem(item, filterItem)
  );
  return check;
};

export const compareFunction =
  (columns: AirTableColumn[], sortSet: SortItem[]) => (a: any, b: any) => {
    return sortSet
      .map((sortItem) => {
        const { columnId, ascending } = sortItem;
        const column = columns.find((column) => column.id === columnId);
        const order = ascending ? 1 : -1;
        let check = 0;
        switch (column?.type) {
          case AirTableColumnTypes.MULTIPLE_SELECT:
          case AirTableColumnTypes.MULTIPLE_USER: {
            const choicesObj: { [key: string]: AirTableOption } | null =
              column.options?.choices?.reduce(
                (prev, current: AirTableOption) => ({ ...prev, [current.id]: current.name }),
                {}
              ) || null;

            const arrLabelA = choicesObj
              ? (a[columnId].value || []).map((id: string) => choicesObj[id])
              : [];
            const arrLabelB = choicesObj
              ? (b[columnId].value || []).map((id: string) => choicesObj[id])
              : [];
            check = compareTwoStringArrays(arrLabelB, arrLabelA);
            break;
          }

          case AirTableColumnTypes.SINGLE_SELECT:
          case AirTableColumnTypes.SINGLE_USER: {
            const choicesObj: { [key: string]: AirTableOption } | null =
              column.options?.choices?.reduce(
                (prev, current) => ({ ...prev, [current.id]: current.name }),
                {}
              ) || null;

            const labelA = (a[columnId].value && choicesObj?.[a[columnId].value]) || "";
            const labelB = (b[columnId].value && choicesObj?.[b[columnId].value]) || "";

            check = labelA.localeCompare(labelB);
            break;
          }

          case AirTableColumnTypes.CHECKBOX: {
            if (b[columnId].value !== a[columnId].value) {
              check = a[columnId].value ? 1 : -1;
            }
            break;
          }

          case AirTableColumnTypes.ATTACHMENT: {
            const arrA =
              a[columnId].value && Array.isArray(a[columnId].value) ? a[columnId].value : [];
            const arrB =
              b[columnId].value && Array.isArray(b[columnId].value) ? b[columnId].value : [];
            check = arrB.length > arrA.length ? -1 : arrB.length < arrA.length ? 1 : 0;
            break;
          }

          case AirTableColumnTypes.SINGLE_LINE_TEXT:
          case AirTableColumnTypes.LONG_TEXT:
          case AirTableColumnTypes.URL:
          case AirTableColumnTypes.EMAIL:
          case AirTableColumnTypes.PHONE_NUMBER: {
            check = `${a[columnId].value}`.localeCompare(`${b[columnId].value}`);
            break;
          }

          case AirTableColumnTypes.DATE:
          case AirTableColumnTypes.DATETIME: {
            const dateA = a[columnId].value ? new Date(a[columnId].value) : null;
            const dateB = b[columnId].value ? new Date(b[columnId].value) : null;
            if ((!dateA && !dateB) || (dateA && dateB && isSameDay(dateA, dateB))) {
              check = 0;
            }

            if ((!dateA && dateB) || (dateA && dateB && isAfter(dateB, dateA))) {
              check = -1;
            }

            if ((dateA && !dateB) || (dateA && dateB && isAfter(dateA, dateB))) {
              check = 1;
            }

            break;
          }

          default: {
            if (+a?.[columnId]?.value !== +b?.[columnId]?.value) {
              check = +a?.[columnId]?.value > +b?.[columnId]?.value ? 1 : -1;
            }
            break;
          }
        }

        return check * order;
      })
      .reduce((prev, current) => (prev ? prev : current), 0);
  };

export const compareTwoStringArrays = (array1: string[], array2: string[]) => {
  const [arr1, arr2, order] =
    array1.length < array2.length ? [array1, array2, -1] : [array2, array1, 1];
  return arr1.some((str, strIndex) => str.localeCompare(arr2[strIndex]) === 1) ? 1 : -1 * order;
};

export const convertTableRecordToOptions: any = (
  dataTable: AirTableBase,
  recordDisplay: string,
  userOptions: AirTableOption[]
) => {
  const field = dataTable?.fields?.find((item) => item.id === recordDisplay);
  if (field && recordDisplay && dataTable?.records) {
    return Object.keys(dataTable?.records).map((recordId: string) => {
      const cell = dataTable?.records?.[recordId]?.find((item) => item.field === recordDisplay);
      const columnType: any =
        field?.options?.feType ||
        Object.keys(BEFieldType).find((item: AirTableColumnTypes) => BEFieldType[item] === field?.type);

      let name = recordId;
      switch (columnType) {
        case AirTableColumnTypes.SINGLE_USER:
        case AirTableColumnTypes.MULTIPLE_USER:
          name = AirTableColumnRenderViewFuncs[columnType](userOptions, cell?.value);
          break;
        case AirTableColumnTypes.SINGLE_SELECT:
        case AirTableColumnTypes.MULTIPLE_SELECT:
          name = AirTableColumnRenderViewFuncs[columnType](
            (field?.options?.choices && Object.values(field?.options?.choices)) || [],
            cell?.value
          );
          break;
        default:
          name = AirTableColumnRenderViewFuncs[columnType](cell?.value);
          break;
      }
      return {
        id: recordId,
        name: !cell?.value ? "Chưa phân loại" : name,
      };
    });
  }
  return [];
};

export function getStyle({ draggableStyle, virtualStyle, isDragging }: any) {
  const combined = {
    ...virtualStyle,
    ...draggableStyle,
  };

  const grid = 8;

  const result = {
    ...combined,
    height: isDragging ? combined.height : "auto",
    left: isDragging ? combined.left : combined.left + grid,
    width: isDragging ? draggableStyle.width : `calc(${combined.width} - ${grid * 2}px)`,
    marginBottom: grid,
  };

  return result;
}

export const convertColumnToField = (column: AirTableColumn) =>
  ({
    id: column.isCreateByFe ? undefined : column.id,
    type: BEFieldType[column.type],
    name: column.name,
    description: column.description,
    options: {
      ...column.options,
      choices: column?.options?.choices?.reduce(
        (prev, current) => ({ ...prev, [current.id]: current }),
        {}
      ),
      choiceOrder: column?.options?.choiceOrder,
      feType: column.type,
    },
  } as AirTableField);

export const convertRowToRecord = (row: any, columns: AirTableColumn[]) => {
  const fields = columns.reduce((prev: any, item: AirTableColumn) => {
    if (row[item.id]) {
      prev.push({
        cell: {
          field: item.id,
          type: BEFieldType[item.type],
          value: formatDataCell(item.type, row[item.id]),
        },
      });
    }
    return prev;
  }, []);
  return {
    id: row.id,
    fields,
  };
};

export const formatDataCell = (type: AirTableColumnTypes, value: any) => {
  switch (type) {
    case AirTableColumnTypes.DATE:
      return new Date(value)?.toISOString();
    default:
      return value;
  }
};

export const standardView = (view: AirTableView, columns: AirTableColumn[]) => {
  let visibleFields =
    view.visible_fields && Array.isArray(view.visible_fields) ? [...view.visible_fields] : [];
  columns.map((column) => {
    const isExisted = visibleFields.find((item) => item.field_id === column.id);
    if (!isExisted) {
      visibleFields = [
        ...visibleFields,
        {
          field_configs: null,
          field_id: column.id,
          visible: true,
          width: 150,
        },
      ];
    }
  });

  visibleFields = visibleFields.filter((item) =>
    columns.find((column) => column.id === item.field_id)
  );
  return {
    ...view,
    visible_fields: visibleFields,
  };
};

export const getTotalLeft = (fieldsOrder: AirTableFieldConfig[]) => {
  let distance = 115;
  const result = fieldsOrder.reduce((fields, field) => {
    if (field.visible) {
      distance += field.width;
    }
    fields = {
      ...fields,
      [field.field_id]: field.visible ? distance : -1,
    };
    return fields;
  }, []);

  return result;
};

export const getFixedDirection = (
  fieldsOrder: AirTableFieldConfig[],
  columnId: string,
  tableWidth: number
) => {
  if (fieldsOrder.find((item) => item.field_id === columnId && !item.visible)) return "";
  const visibileFieldsOrder = fieldsOrder.filter((field) => field.visible);

  const columnIndex = visibileFieldsOrder.findIndex((item) => item.field_id === columnId);
  if (columnIndex !== -1) {
    let distance = 115;
    visibileFieldsOrder.slice(0, columnIndex).map((field) => (distance += field.width));
    return distance < tableWidth ? "left" : "";
  }
  return "";
};
