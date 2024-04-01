import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useState } from "react";
import { RankType } from "_types_/RankType";
import map from "lodash/map";
import { customerApi } from "_apis_/customer.api";
import CDPTable from "views/CDPView/components/CDPTable";
import { RANK_HISTORY_COLUMNS, RANK_HISTORY_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import vi from "locales/vi.json";

const initParamsRankTable = {
  limit: 200,
  page: 1,
  field_changed: "ranking",
  ordering: "-created",
};

interface Props {
  customerID?: string;
}

const RankHistoryTable = ({ customerID }: Props) => {
  const [data, setData] = useState<RankType[]>([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>(initParamsRankTable);

  const formatData = (ranks: RankType[]): RankType[] => {
    return map(ranks, (item) => {
      const customer = item?.customer;
      return {
        ...item,
        new_rank: item?.new_value,
        old_rank: item?.old_value,
        phone: customer?.phone,
        full_name: customer?.full_name,
        birthday: customer?.birthday,
        total_order: customer?.total_order,
        shipping_addresses: customer?.shipping_addresses,
        email: customer?.email,
        gender: customer?.gender,
        customer: undefined,
      };
    });
  };

  const getHistoryRank = useCallback(async () => {
    if (customerID) {
      setLoading(true);

      const result = await customerApi.get<RankType>({
        endpoint: "history/",
        params: {
          ...params,
          customer_id: customerID,
        },
      });
      if (result.data) {
        setData(formatData(result.data.results));
        setDataTotal(result.data.count || 0);
      }
      setLoading(false);
    } else {
      setData([]);
      setDataTotal(0);
    }
  }, [customerID, params]);

  useEffect(() => {
    getHistoryRank();
  }, [getHistoryRank]);

  return (
    <Stack width="100%" my={2}>
      <CDPTable
        isFullRow
        data={{ data, count: dataTotal, loading }}
        columns={RANK_HISTORY_COLUMNS}
        columnWidths={RANK_HISTORY_COLUMNS_WIDTH}
        containerStyle={tableStyle}
        label={vi.rank}
        params={params}
        setParams={setParams}
      />
    </Stack>
  );
};

export default RankHistoryTable;

const tableStyle = { marginBottom: 0 };
