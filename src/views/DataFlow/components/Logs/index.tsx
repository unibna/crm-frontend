// Libraries
import { useEffect, useState } from "react";

// Services
import { windflowApi } from "_apis_/windflow.api";

// Hooks
import usePopup from "hooks/usePopup";

// Context
import { useCancelToken } from "hooks/useCancelToken";

// Components

// Types
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FlowLogType, FlowType } from "_types_/DataFlowType";

// Constants
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";
import { columnShowLogs, RUN_TYPE, TASK_STATUS } from "views/DataFlow/constants";
import DDataGrid from "components/DDataGrid";
import { formatDateTimeOriginalTimeZone } from "utils/dateUtil";
import { yyyy_MM_dd_HH_mm_ss } from "constants/time";
import { differenceInSeconds } from "date-fns";
import { Span } from "components/Labels";

// --------------------------------------------------------------------

const Logs = ({ workflowId }: { workflowId: string }) => {
  // Other
  const { newCancelToken } = useCancelToken();
  const { isSubmit } = usePopup<FlowType>();

  // State
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowLogs.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowLogs.columnsShowHeader)
  );

  const [data, setData] = useState<FlowLogType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 100,
    // offset: 0,
    // order_by: "-logical_date",
  });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  useEffect(() => {
    loadDataTable();
  }, [params, newCancelToken, isSubmit]);

  const loadDataTable = () => {
    getData(params);
  };

  const getData = async (params: any) => {
    setLoading(true);
    const result = await windflowApi.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      `workflows/${workflowId}/runs/logs`
    );

    if (result && result.data) {
      const data: { dag_runs: FlowLogType[]; total_entries: number } | any = result.data.data;
      const newData = (data?.dag_runs || []).map((item: any, index: number) => {
        return {
          ...item,
          start_date: formatDateTimeOriginalTimeZone(item.start_date, yyyy_MM_dd_HH_mm_ss),
          end_date: formatDateTimeOriginalTimeZone(item.end_date, yyyy_MM_dd_HH_mm_ss),
          logical_date: formatDateTimeOriginalTimeZone(item.logical_date, yyyy_MM_dd_HH_mm_ss),
          last_scheduling_decision: formatDateTimeOriginalTimeZone(
            item.last_scheduling_decision,
            yyyy_MM_dd_HH_mm_ss
          ),
          duration: `${differenceInSeconds(new Date(item.end_date), new Date(item.start_date))}s`,
          state: {
            value: item.state,
            content: (
              <Span color={TASK_STATUS[item.state]?.color}>{TASK_STATUS[item.state]?.label}</Span>
            ),
          },
          run_type: {
            value: item.run_type,
            content: (
              <Span color={RUN_TYPE[item.run_type]?.color}>{RUN_TYPE[item.run_type]?.label}</Span>
            ),
          },
          dag_run_id: data?.total_entries
            ? `Lần ${data.total_entries - params.limit * (params.page - 1) - index}`
            : "",
        };
      });

      setData(newData);
      setDataTotal(data.total_entries);
    }
    setLoading(false);
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const renderHeader = () => {
    return <></>;
  };

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      heightProps={300}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      isLoadingTable={isLoading}
      contentOptional={{
        arrColumnOptional: ["state", "run_type"],
      }}
      renderHeader={renderHeader}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
    />
  );
};

export default Logs;
