// Các phép logic để kết hợp các điều kiện trong Filter
export enum Conjunction {
  AND = "and",
  OR = "or",
}

// Các toán tử trong 1 điều kiện
export enum Operator {
  EQUAL = "=",
  NOT_EQUAL = "!==",
  GREATER = ">",
  SMALLER = "<",
  GREATER_OR_EQUAL = ">=",
  SMALLER_OR_EQUAL = "<=",
  CONTAINS = "contains",
  DOES_NOT_CONSTAINS = "doesNotContains",
  IS = "is",
  IS_NOT = "isNot",
  IS_ANY_OF = "isAnyOf",
  IS_NONE_OF = "isNoneOf",
  IS_EXACTLY = "isExactly",
  IS_WITHIN = "isWithin",
  HAS_ANY_OF = "hasAnyOf",
  HAS_ALL_OF = "hasAllOf",
  HAS_NONE_OF = "hasNoneOf",
  IS_BEFORE = "isBefore",
  IS_AFTER = "isAfter",
  IS_ON_OR_BEFORE = "isOnOrBefore",
  IS_ON_OR_AFTER = "isOnOrAfter",
  IS_EMPTY = "isEmpty",
  IS_NOT_EMPTY = "isNotEmpty",
}

// Các giá trị so sánh mặc định dùng cho các điều kiện so sánh dạng Date
export enum Mode {
  TODAY = "today",
  TOMORROW = "tomorrow",
  YESTERDAY = "yesterday",
  ONE_WEEK_AGO = "oneWeekAgo",
  ONE_WEEK_FROM_NOW = "oneWeekFromNow",
  ONE_MONTH_AGO = "oneMonthAgo",
  ONE_MONTH_FROM_NOW = "oneMonthFromNow",
  NUMBER_OF_DAYS_AGO = "numberOfDaysAgo",
  NUMBER_OF_DAYS_FROM_NOW = "numberOfDaysFromNow",
  EXACT_DATE = "exactDate",
  THE_PAST_WEEK = "thePastWeek",
  THE_PAST_MONTH = "thePastMonth",
  THE_PAST_YEAR = "thePastYear",
  THE_NEXT_WEEK = "theNextWeek",
  THE_NEXT_MONTH = "theNextMonth",
  THE_NEXT_YEAR = "theNextYear",
  THE_NEXT_NUMBER_OF_DAYS = "theNextNumberOfDays",
  THE_PAST_NUMBER_OF_DAYS = "thePastNumberOfDays",
}

class AbstractFilterItem {
  id?: string;
  columnId?: string;
  operator?: Operator;
  value?: any;

  constructor(id: string, columnId: string, operator: Operator | undefined, value: any) {
    this.id = id;
    this.columnId = columnId;
    this.operator = operator;
    this.value = value;
  }
}

export default AbstractFilterItem;
