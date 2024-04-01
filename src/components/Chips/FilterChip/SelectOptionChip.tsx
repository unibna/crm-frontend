import { SelectOptionType } from "_types_/SelectOptionType";
import { useEffect } from "react";
import FilterItem from "components/Chips/FilterChip/FilterChipItem";
import reduce from "lodash/reduce";
import { NULL_OPTION } from "constants/index";
import { KeysFilterType } from "_types_/FilterType";

const SelectOptionChip = ({
  handleDelete,
  options,
  keyFilter,
  params,
  setFilterCount,
  keyMatch = "value",
  isSimple,
}: {
  handleDelete: (type: string, value: any) => void;
  keyFilter?: KeysFilterType;
  options: SelectOptionType[];
  params?: any;
  setFilterCount?: (value: number) => void;
  keyMatch?: "value" | "name";
  isSimple?: boolean;
}) => {
  let filterCount = 0;

  useEffect(() => {
    setFilterCount && setFilterCount(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  const allOptions = [...options, { label: "Chưa có", value: "null" }, NULL_OPTION];

  const value =
    keyFilter && params?.[keyFilter.label]
      ? reduce(
          !isSimple ? params?.[keyFilter.label] : [params?.[keyFilter.label]],
          (prev: any, current: any) => {
            const matchOption = allOptions?.find(
              (item: { label: string; value: string | number }) =>
                `${item[keyMatch]}` === `${current}`
            );

            if (matchOption) {
              filterCount += 1;
              const matchOptionFormat = {
                label: matchOption?.label,
                onRemove: keyFilter.disabled
                  ? undefined
                  : () => handleDelete(keyFilter.label, matchOption[keyMatch]),
              };
              return [...prev, matchOptionFormat];
            }

            return prev;
          },
          []
        )
      : [];

  return <>{value.length > 0 && <FilterItem title={keyFilter?.title} value={value} />}</>;
};

export default SelectOptionChip;
