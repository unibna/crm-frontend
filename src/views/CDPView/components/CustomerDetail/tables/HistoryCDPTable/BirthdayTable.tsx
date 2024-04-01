import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useState } from "react";
import { RankType } from "_types_/RankType";
import map from "lodash/map";
import { customerApi } from "_apis_/customer.api";
import { BIRTHDAY_COLUMNS, BIRTHDAY_COLUMNS_WIDTH } from "views/CDPView/constants/columns";
import vi from "locales/vi.json";
import CDPTable from "views/CDPView/components/CDPTable";

const initParamsRankTable = {
  limit: 200,
  page: 1,
  field_changed: "birthday",
  ordering: "-created",
};

interface Props {
  customerID?: string;
}

const BirthdayTable = ({ customerID }: Props) => {
  const [data, setData] = useState<RankType[]>([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>(initParamsRankTable);

  const formatData = (ranks: RankType[]): RankType[] => {
    return map(ranks, (item) => {
      const { phone, full_name, birthday, total_order, email, gender, shipping_addresses } =
        item?.customer || {};
      return {
        ...item,
        ranking: item?.new_value,
        new_birthday: item?.new_value,
        old_birthday: item?.old_value,
        phone,
        full_name,
        birthday,
        total_order,
        shipping_addresses,
        email,
        gender,
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
        columns={BIRTHDAY_COLUMNS}
        columnWidths={BIRTHDAY_COLUMNS_WIDTH}
        label={vi.birthday}
        params={params}
        setParams={setParams}
      />
    </Stack>
  );
};

export default BirthdayTable;
