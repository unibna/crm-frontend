import DateChips from "components/Chips/FilterChip/DateChips";
import {
  KEY_FILTER_DATE,
  KEY_FILTER_RANKS,
  KEY_FILTER_TAGS,
  TOTAL_ORDER_MARKS,
  TOTAL_SPENT_MARKS,
} from "views/CDPView/constants";
import ParamsChip from "views/CDPView/components/Header/ParamsChip";
import React, { useContext, useMemo } from "react";
import SelectOptionChip from "components/Chips/FilterChip/SelectOptionChip";
import map from "lodash/map";
import filter from "lodash/filter";
import WrapFilterChip from "components/Chips/FilterChip/WrapFilterChip";
import { fShortenNumber } from "utils/formatNumber";
import { handleCheckKeyParamsActive } from "utils/formatParamsUtil";
import { CDPContext } from "views/CDPView";
import { RANK_CHIP_OPTIONS } from "../CustomerDetail/Overview/RankField";

interface Props {
  params?: any;
  setParams?: React.Dispatch<any>;
  setFilterCount: React.Dispatch<React.SetStateAction<number>>;
  onClearAll: (keys: string[]) => void;
}

const MIN_TOTAL_ORDER = TOTAL_ORDER_MARKS[0].value;
const MAX_TOTAL_ORDER = TOTAL_ORDER_MARKS[TOTAL_ORDER_MARKS.length - 1].value;

const MIN_TOTAL_SPEND = TOTAL_SPENT_MARKS[0].value;
const MAX_TOTAL_SPEND = TOTAL_SPENT_MARKS[TOTAL_SPENT_MARKS.length - 1].value;

const FilterChips = ({ params, setParams, setFilterCount, onClearAll }: Props) => {
  let filterCount = 0;
  const cdpContext = useContext(CDPContext);

  //trích xuất disabled delete chip filter
  const KEY_FILTER_TOTAL_ORDER = useMemo(
    () => [
      {
        label: "total_order_min",
        color: "#91f7d3",
        title: "Tổng đơn từ",
      },
      {
        label: "total_order_max",
        color: "#91f7d3",
        title: "Tổng đơn đến",
      },
    ],
    []
  );

  //trích xuất disabled delete chip filter
  const KEY_FILTER_TOTAL_SPEND = useMemo(
    () => [
      {
        label: "total_spent_min",
        color: "#91f7d3",
        title: "Chi tiêu từ",
        disabled: true,
      },
      {
        label: "total_spent_max",
        color: "#91f7d3",
        title: "Chi tiêu đến",
        disabled: true,
      },
    ],
    []
  );

  const handleDeleteTotalOrderFilter = (type: string) => {
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        [type]: type === "total_order_min" ? MIN_TOTAL_ORDER : MAX_TOTAL_ORDER,
        page: 1,
      }));
  };

  const handleDeleteTotalSpendFilter = (type: string) => {
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        [type]: type === "total_spent_min" ? MIN_TOTAL_SPEND : MAX_TOTAL_SPEND,
        page: 1,
      }));
  };

  const handleDeleteFilterTag = (_type: string, value: string) => {
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        tags: filter(params.tags, (tag) => tag.toString() !== value.toString()),
        page: 1,
      }));
  };
  const handleDeleteFilterRank = (_type: string, value: string) => {
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        ranking: filter(params.ranking, (rank) => rank.toString() !== value.toString()),
        page: 1,
      }));
  };

  const checkFilterCount = (value: number) => {
    filterCount += value;
    setFilterCount(filterCount);
  };

  return (
    <WrapFilterChip
      isActiveClearAllButton={handleCheckKeyParamsActive({
        keys: [
          ...KEY_FILTER_TOTAL_ORDER,
          ...KEY_FILTER_TOTAL_SPEND,
          KEY_FILTER_TAGS,
          KEY_FILTER_RANKS,
        ],
        params,
      })}
      onClearAll={onClearAll}
    >
      <>
        <DateChips params={params} keysFilter={KEY_FILTER_DATE} setFilterCount={checkFilterCount} />
        <ParamsChip
          params={params}
          handleDelete={handleDeleteTotalOrderFilter}
          keysFilter={KEY_FILTER_TOTAL_ORDER}
          setFilterCount={checkFilterCount}
        />
        {/* total spend */}
        <ParamsChip
          params={params}
          handleDelete={handleDeleteTotalSpendFilter}
          keysFilter={KEY_FILTER_TOTAL_SPEND}
          formatValue={(value) => fShortenNumber(parseInt(value.toString()))}
          setFilterCount={checkFilterCount}
        />
        {/* tags filter */}
        <SelectOptionChip
          keyFilter={KEY_FILTER_TAGS}
          handleDelete={handleDeleteFilterTag}
          options={map(cdpContext?.tags.tags, (tag) => ({ label: tag.name, value: tag.id }))}
          params={params}
          setFilterCount={checkFilterCount}
        />
        {/* ranks filter */}
        <SelectOptionChip
          keyFilter={KEY_FILTER_RANKS}
          handleDelete={handleDeleteFilterRank}
          options={map(RANK_CHIP_OPTIONS, (rank) => ({ label: rank.label, value: rank.value }))}
          params={params}
          setFilterCount={checkFilterCount}
        />
      </>
    </WrapFilterChip>
  );
};

export default FilterChips;
