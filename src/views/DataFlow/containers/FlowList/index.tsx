// Libraries
import { useEffect, useContext, useState } from "react";
import find from "lodash/find";

// Services
import { windflowApi } from "_apis_/windflow.api";

// Hooks
import usePopup from "hooks/usePopup";

// Context
import { DataFlowContext } from "views/DataFlow/context";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import AddIcon from "@mui/icons-material/Add";

// Types
import { SortType } from "_types_/SortType";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnTypeDefault, MColumnType } from "_types_/ColumnType";
import { FlowType } from "_types_/DataFlowType";
import { ColorSchema } from "_types_/ThemeColorType";

// Constants
import { paramsDefault, paramsGetDefault } from "views/ShippingView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { ActionType, columnShowFlowList, OPTION_SCHEDULE } from "views/DataFlow/constants";
import { ROLE_TAB } from "constants/rolesTab";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import Logs from "views/DataFlow/components/Logs";

// --------------------------------------------------------------------

const FlowList = () => {
  // Other
  const { newCancelToken } = useCancelToken();
  const { openPopup } = useContext(DataFlowContext);
  const { isSubmit } = usePopup<FlowType>();

  // State
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowFlowList.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowFlowList.columnsShowHeader)
  );
  const [data, setData] = useState<FlowType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 30, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  useEffect(() => {
    loadDataTable();
  }, [params, newCancelToken, isSubmit]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };

    const newParams = chooseParams(objParams, ["search", ...paramsGetDefault]);

    getListFlow(newParams);
  };

  const getListFlow = async (params: any) => {
    setLoading(true);
    const result = await windflowApi.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      `workflows`
    );

    if (result && result.data) {
      const { data = [], count = 0 } = result.data;
      const newData = (data || []).map((item: any) => {
        const newSchedule = find(OPTION_SCHEDULE, (current) => current.value === item?.schedule);

        return {
          ...item,
          name: {
            value: item.name,
            props: {
              href: `/${ROLE_TAB.DATA_FLOW}/${getObjectPropSafely(() => item.id)}`,
            },
          },
          operation: {
            isShowEdit: true,
          },
          schedule: {
            value: newSchedule?.label,
            color: "warning",
          },
          is_paused: !item.is_paused,
        };
      });

      setData(newData);
      setDataTotal(count);
    }
    setLoading(false);
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleFilter = (params: any) => {
    setParams({
      ...params,
      page: 1,
    });
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const handleChangeColumn = (columns: MColumnType) => {
    const newColumns = handleToggleVisibleColumn(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.columnsShow);
  };

  const onToggleSwitch = async (isActive: boolean, id: string, columnName: string) => {
    const params = {
      is_paused: !isActive,
    };

    const result = await windflowApi.update({ ...params }, `workflows/${id}/paused`);

    if (result && result.data) {
      loadDataTable();
    }
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const renderHeader = () => {
    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema | any;
      handleClick: () => void;
    }[] = [
      {
        content: (
          <>
            <AddIcon /> Tạo flow
          </>
        ),
        color: "warning",
        handleClick: () => openPopup(ActionType.CREATE_FLOW),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        dataExport={data}
        dataRenderHeader={[]}
        paramsDefault={paramsDefault}
        arrNoneRenderSliderFilter={["created_dateValue"]}
        columns={{
          resultColumnsShow: columnsShowHeader,
          columnsShow: columnsShowHeader,
          // columnShowExport: columnsShowHeader,
        }}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={(paramsProps: Partial<any>) => handleFilter({ ...params, ...paramsProps })}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <DataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      isLoadingTable={isLoading}
      contentColumnSwitch={{
        arrColumnSwitch: ["is_paused"],
        keySwitchToggle: "id",
        onToggleSwitch: onToggleSwitch,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["name", "description", "start_date", "end_date"],
        infoCell: columnShowFlowList.columnShowTable,
      }}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: (row: FlowType) => openPopup(ActionType.EDIT_FLOW, row),
      }}
      arrDate={["start_date", "end_date"]}
      // arrColumnEditLabel={["schedule"]}
      arrColumnHandleLink={["name"]}
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
      handleSorting={handleChangeSorting}
      renderTableDetail={(row: any)=> <Logs workflowId={row?.id} />}
    />
  );
};

export default FlowList;
