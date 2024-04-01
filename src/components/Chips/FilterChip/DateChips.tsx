import map from "lodash/map";
import { fDate } from "utils/dateUtil";
import { useEffect } from "react";
import FilterItem, { DataRenderType } from "components/Chips/FilterChip/FilterChipItem";
import { ChipFilterType } from "_types_/FilterType";

const DateChips = ({
  handleDelete,
  keysFilter,
  params,
  setFilterCount,
}: {
  handleDelete?: (type: string, value: any) => void;
  keysFilter: ChipFilterType[];
  params?: any;
  setFilterCount?: (value: number) => void;
}) => {
  let filterCount = 0;

  useEffect(() => {
    setFilterCount && setFilterCount(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  return (
    <>
      {map(keysFilter, (item, idx) => {
        if (params?.[item?.keyFilters[0]?.label] || params?.[item?.keyFilters[1]?.label]) {
          filterCount += 1;
          const dataRender: DataRenderType = {
            title: item.title,
            value: [
              {
                label: `${fDate(params?.[item?.keyFilters[0]?.label])}`,
                onRemove: () =>
                  handleDelete &&
                  handleDelete(item?.keyFilters[0]?.label, params?.[item?.keyFilters[0]?.label]),
              },
              {
                label: `${fDate(params?.[item?.keyFilters[1]?.label])}`,
                onRemove: () =>
                  handleDelete &&
                  handleDelete(item?.keyFilters[1]?.label, params?.[item?.keyFilters[1]?.label]),
              },
            ],
          };
          return <FilterItem {...dataRender} key={idx} />;
        }
        return null;
      })}
    </>
  );
};

export default DateChips;
