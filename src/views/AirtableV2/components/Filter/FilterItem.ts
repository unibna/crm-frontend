import AbstractFilterItem, { Operator } from "./AbstractFilterItem";

class FilterItem extends AbstractFilterItem {
  id: string;
  columnId?: string;
  operator?: Operator;
  value?: any;

  constructor(id: string, columnId: string, operator: Operator | undefined, value: any) {
    super(id, columnId, operator, value);
    this.id = id;
    this.columnId = columnId;
    this.operator = operator;
    this.value = value;
  }
}

export default FilterItem;
