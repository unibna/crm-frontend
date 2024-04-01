import { useEffect, useState } from "react";
import map from "lodash/map";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

import Paper from "@mui/material/Paper";

import LeadTable from "views/LeadCenterView/components/tables/LeadTable";
import PhoneLeadHeader from "views/LeadCenterView/components/Header";

import { REPORT_CRM_COLUMNS, REPORT_CRM_COLUMNS_WIDTH } from "views/LeadCenterView/constants/columns";

import { phoneLeadApi } from "_apis_/lead.api";
import { format, subDays } from "date-fns";
import { yyyy_MM_dd } from "constants/time";
import TableDetail from "./TableDetail";

const ReportCRM = () => {
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [columnsWidth, setColumnsWidth] =
    useState<TableColumnWidthInfo[]>(REPORT_CRM_COLUMNS_WIDTH);
  const [params, setParams] = useState<any>({
    limit: 100,
    page: 1,
    process_done_from: format(subDays(new Date(), 30), yyyy_MM_dd),
    process_done_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    dateValue: 30,
  });
  const [columnsOrder, setColumnsOrder] = useState<string[]>(
    map(REPORT_CRM_COLUMNS_WIDTH, (item) => item.columnName)
  );
  const [isFullRow, setIsFullRow] = useState(false);
  const [hiddenColumnNames, setHiddenColumnNames] = useState([]);

  const getData = async () => {
    setLoading(true);
    const result = await phoneLeadApi.get({
      params,
      endpoint: "crm-report/",
    });
    if (result && result.data) {
      const { results = [], count = 0 } = result.data;
      setData(results);
      setCount(count);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [params]);



  return (
    <Paper variant="outlined" style={{ marginBottom: 16 }}>
      <PhoneLeadHeader
        isFilterProcessTime
        tabName="report-crm"
        hiddenColumnNames={hiddenColumnNames}
        setHiddenColumnNames={setHiddenColumnNames}
        columns={REPORT_CRM_COLUMNS}
        isFullRow={isFullRow}
        setFullRow={() => setIsFullRow((prev) => !prev)}
        setParams={(newParams) => setParams({ ...params, ...newParams, page: 1 })}
        onRefresh={getData}
        params={params}
        // onSearch={(value) => setParams({ ...params, search: value })}
      />

      <LeadTable
        columns={REPORT_CRM_COLUMNS}
        columnWidths={columnsWidth}
        setColumnWidths={setColumnsWidth}
        data={{
          data,
          count,
          loading,
        }}
        params={params}
        setParams={setParams}
        columnOrders={columnsOrder}
        setColumnOrders={setColumnsOrder}
        hiddenColumnNames={hiddenColumnNames}
        isFullRow={isFullRow}
        detailComponent={({row})=> <TableDetail row={row} />}
      />
    </Paper>
  );
};

export default ReportCRM;
