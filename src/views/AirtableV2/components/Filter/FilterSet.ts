import AbstractFilterItem, { Conjunction, Operator } from "./AbstractFilterItem";

class FilterSet implements AbstractFilterItem {
  id: string = "";
  filterSet: AbstractFilterItem[] = [];
  conjunction?: Conjunction;

  constructor(id: string, filterSet: AbstractFilterItem[], conjunction: Conjunction) {
    this.id = id;
    this.filterSet = filterSet;
    this.conjunction = conjunction;
  }
}

export default FilterSet;
