import map from "lodash/map";
import { useEffect } from "react";
import FilterItem from "components/Chips/FilterChip/FilterChipItem";
import { KeysFilterType } from "_types_/FilterType";

const ParamsChip = ({
  handleDelete,
  keysFilter,
  params,
  formatValue,
  setFilterCount,
}: {
  handleDelete: (type: string) => void;
  keysFilter: KeysFilterType[];
  params?: any;
  setFilterCount?: (value: number) => void;
  formatValue?: (value: string | number) => string;
}) => {
  let filterCount = 0;

  useEffect(() => {
    setFilterCount && setFilterCount(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  return (
    <>
      {map(keysFilter, (item, idx) => {
        if (params[item.label]) {
          filterCount += 1;
        }
        if (params?.[item.label] || params?.[item.label] === 0) {
          const dataRender = {
            title: item.title,
            value: {
              label: formatValue
                ? formatValue(params?.[item.label]).toString()
                : params?.[item.label].toString(),
              onRemove: item.disabled ? undefined : () => handleDelete(item.label),
            },
          };
          return <FilterItem {...dataRender} key={idx} />;
        }
        return null;
      })}
    </>
  );
};

export default ParamsChip;
