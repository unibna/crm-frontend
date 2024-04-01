import { fNumber, fShortenNumber } from "utils/formatNumber";
import RangeDateV2 from "components/Pickers/RangeDateV2";

import Grid from "@mui/material/Grid";
import { useContext, useEffect, useState } from "react";
import useDebounce from "hooks/useDebounce";
import { compareDateSelected } from "utils/dateUtil";
import map from "lodash/map";
import RangeMonthDate from "components/Pickers/RangMonthDate";
import vi from "locales/vi.json";
import { MultiSelect } from "components/Selectors";
import { FULL_OPTIONS } from "constants/index";
import SliderFilter from "./SliderFilter";
import { TOTAL_ORDER_MARKS, TOTAL_SPENT_MARKS } from "views/CDPView/constants";
import TagsAutocomplete from "../TagsAutocomplete";
import { CDPContext } from "views/CDPView";
import { RANK_CHIP_OPTIONS } from "../CustomerDetail/Overview/RankField";

const FilterPopup = ({
  listTag,
  setParams,
  params,
}: {
  listTag: readonly { id: number; name: string }[];
  setParams?: (params: any) => void;
  params: any;
}) => {
  const cdpContext = useContext(CDPContext);
  const [totalOrder, setTotalOrder] = useState<number[]>([
    params.total_order_min,
    params.total_order_max,
  ]);
  const [currency, setCurrency] = useState<number[]>([
    params.total_spent_min,
    params.total_spent_max,
  ]);
  const [tags, setTags] = useState<{ id: number; name: string }[] | undefined>(params.tags || []);
  const debounceTotalOrder = useDebounce(totalOrder.toString(), 500);
  const debounceCurrency = useDebounce(currency.toString(), 500);

  /**
   * filter theo ngày đặt hangf
   * @param created_from
   * @param created_to
   * @param dateValue
   */
  const handleChangeLastOrderDate = (
    created_from: string,
    created_to: string,
    dateValue: string | number
  ) => {
    const {
      date_from,
      date_to,
      value: toValue,
    } = compareDateSelected(created_from, created_to, dateValue);
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        last_order_date_before: date_to,
        last_order_date_after: date_from,
        lastOrderDateValue: toValue,
        page: 1,
      }));
  };

  /**
   * filter theo ngày sinh
   * @param created_from
   * @param created_to
   * @param dateValue
   */
  const handleChangeBirthday = (
    created_from: string,
    created_to: string,
    dateValue: string | number
  ) => {
    const {
      date_from,
      date_to,
      value: toValue,
    } = compareDateSelected(created_from, created_to, dateValue);
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        birthday_before: date_to,
        birthday_after: date_from,
        birthdayValue: toValue,
        page: 1,
      }));
  };

  const handleFilterTags = () => {
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        tags: map(tags, (tag) => tag.id),
        page: 1,
      }));
  };

  const handleFilterRank = (value: string | number | (string | number)[]) => {
    setParams &&
      setParams((prev: any) => ({
        ...prev,
        ranking: value,
      }));
  };

  /**
   * filter bởi tổng đơn hàng và chi tiêu của khách hàng
   */
  useEffect(() => {
    if (
      debounceTotalOrder !==
        [params.total_order_min || 0, params.total_order_max || 500].toString() ||
      debounceCurrency !==
        [params.total_spent_min || 0, params.total_spent_max || 5000000].toString()
    )
      setParams &&
        setParams((prev: any) => ({
          ...prev,
          total_order_min: totalOrder[0],
          total_order_max: totalOrder[1],
          total_spent_min: currency[0],
          total_spent_max: currency[1],
          page: 1,
        }));
  }, [
    debounceTotalOrder,
    debounceCurrency,
    currency,
    params.total_order_max,
    params.total_order_min,
    params.total_spent_max,
    params.total_spent_min,
    setParams,
    totalOrder,
  ]);

  /**
   * update tags value by params
   */
  useEffect(() => {
    const tagsFilter = listTag.filter((tag) => params.tags?.includes(tag.id));
    setTags(tagsFilter);
  }, [params.tags, listTag]);

  return (
    <Grid container>
      <Grid xs={12} mt={2} px={2} item>
        <SliderFilter
          orders={totalOrder}
          setOrders={setTotalOrder}
          title={vi.order_total}
          inputFormatFunc={fNumber}
          rangeSliceArr={TOTAL_ORDER_MARKS}
        />
      </Grid>
      <Grid xs={12} mt={2} px={2} item>
        <SliderFilter
          orders={currency}
          setOrders={setCurrency}
          title={vi.revenue}
          inputFormatFunc={fNumber}
          sliderFormatFunc={fShortenNumber}
          rangeSliceArr={TOTAL_SPENT_MARKS}
        />
      </Grid>
      <Grid xs={12} md={6} mt={2} px={1} item>
        <RangeDateV2
          handleSubmit={handleChangeLastOrderDate}
          defaultDateValue={params.lastOrderDateValue}
          inputStyle={{ minWidth: 100, width: "100%" }}
          label={vi.order_lasted}
          created_to={params.last_order_date_before}
          created_from={params.last_order_date_after}
        />
      </Grid>
      <Grid xs={12} md={6} mt={2} px={1} item>
        <RangeMonthDate
          handleSubmit={handleChangeBirthday}
          defaultDateValue={params.birthdayValue}
          inputStyle={{ minWidth: 100, width: "65%" }}
          label={vi.birthday}
        />
      </Grid>
      <Grid xs={12} md={6} mt={2} px={1} item>
        <MultiSelect
          options={[...FULL_OPTIONS, ...RANK_CHIP_OPTIONS]}
          onChange={handleFilterRank}
          title={vi.rank}
          fullWidth
          outlined
          defaultValue={params.ranking}
          selectorId="filter-rank-customer"
        />
      </Grid>
      <Grid xs={12} md={6} mt={2} px={1} item>
        <TagsAutocomplete
          tags={tags}
          setTags={setTags}
          submitLabel="Duyệt thẻ"
          submit={handleFilterTags}
          options={cdpContext?.tags.tags || []}
        />
      </Grid>
    </Grid>
  );
};

export default FilterPopup;
