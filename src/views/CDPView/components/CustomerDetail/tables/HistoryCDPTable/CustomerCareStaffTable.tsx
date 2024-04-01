import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useState } from "react";
import { customerApi } from "_apis_/customer.api";
import CDPTable from "views/CDPView/components/CDPTable";
import {
  CUSTOMER_CARE_STAFF_HISTORY_COLUMNS,
  CUSTOMER_CARE_STAFF_HISTORY_COLUMNS_WIDTH,
} from "views/CDPView/constants/columns";
import vi from "locales/vi.json";
import { CustomerCareStaffHistory } from "_types_/CustomerType";

const initParamsRankTable = {
  limit: 200,
  page: 1,
  ordering: "-history_date",
};

export const formatHistoryCustomerCareStaffData = (values: Partial<CustomerCareStaffHistory>[]) => {
  return values
    .sort((a, b) => ((a.history_date || "") >= (b.history_date || "") ? 1 : -1))
    .reduce((prev: Partial<CustomerCareStaffHistory>[], cur) => {
      const { datetime_modified_care_staff = null, customer_care_staff = null } =
        [...prev].pop() || {};
      // khi khác người chăm sóc hoặc khác ngày gán thời gian chăm sóc
      if (
        cur?.customer_care_staff?.id !== customer_care_staff?.id ||
        cur.datetime_modified_care_staff !== datetime_modified_care_staff
      ) {
        return [...prev, cur];
      }
      return prev;
    }, []);
};

interface Props {
  customerID?: string;
}

const CustomerCareStaffTable = ({ customerID }: Props) => {
  const [data, setData] = useState<Partial<CustomerCareStaffHistory>[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>(initParamsRankTable);

  const getHistoryCustomerCareStaff = useCallback(async () => {
    if (customerID) {
      setLoading(true);

      const result = await customerApi.get<Partial<CustomerCareStaffHistory>>({
        endpoint: `v2/${customerID}/history/`,
        params,
      });
      if (result.data) {
        setData(formatHistoryCustomerCareStaffData(result.data.results));
      }
      setLoading(false);
    } else {
      setData([]);
    }
  }, [customerID, params]);

  useEffect(() => {
    getHistoryCustomerCareStaff();
  }, [getHistoryCustomerCareStaff]);

  return (
    <Stack width="100%" my={2}>
      <CDPTable
        isFullRow
        data={{ data, count: data.length, loading }}
        columns={CUSTOMER_CARE_STAFF_HISTORY_COLUMNS}
        defaultColumnWidths={CUSTOMER_CARE_STAFF_HISTORY_COLUMNS_WIDTH}
        containerStyle={tableStyle}
        label={vi.customer_care_staff}
        params={params}
        setParams={setParams}
      />
    </Stack>
  );
};

export default CustomerCareStaffTable;

const tableStyle = { marginBottom: 0 };
