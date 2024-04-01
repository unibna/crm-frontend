import compact from "lodash/compact";
import { useEffect } from "react";
import FilterItem from "components/Chips/FilterChip/FilterChipItem";
import { KeysFilterType } from "_types_/FilterType";
import { AttributeType } from "_types_/AttributeType";

const NONE_OPTIONS = [
  { id: "none", name: "Chưa có" },
  { id: "null", name: "Chưa có" },
];

const AttributeChips = ({
  handleDelete,
  attributes,
  params,
  setFilterCount,
  keyFilter,
  keyLabel = "name",
  keyMatch = "id",
}: {
  handleDelete: (type: string, value: any) => void;
  attributes?: {
    id: number | string;
    name?: string;
    value?: string;
    is_shown?: boolean;
  }[];
  params?: any;
  setFilterCount?: (value: number) => void;
  keyFilter?: KeysFilterType;
  keyLabel?: "name" | "value";
  keyMatch?: "name" | "id";
}) => {
  let filterCount = 0;

  useEffect(() => {
    setFilterCount && setFilterCount(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  const allOptions = [...(attributes || []), ...NONE_OPTIONS];

  const value: any =
    keyFilter && compact(params?.[keyFilter.label])
      ? compact(params?.[keyFilter.label])?.reduce((prev: any, current: any) => {
          const matchOption = allOptions?.find((item: AttributeType) => {
            return `${item[keyMatch]}` === `${current}`;
          });
          if (matchOption) {
            filterCount += 1;
            const matchOptionFormat = {
              label: matchOption[keyLabel],
              onRemove: () => handleDelete(keyFilter.label, matchOption[keyMatch]),
            };
            return [...prev, matchOptionFormat];
          }
          return prev;
        }, [])
      : [];

  return <>{value.length > 0 && <FilterItem title={keyFilter?.title} value={value} />}</>;
};

export default AttributeChips;
