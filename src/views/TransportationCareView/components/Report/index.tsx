// Libraries
import map from "lodash/map";
import { useEffect, useMemo, useReducer } from "react";

// Services
import { orderApi } from "_apis_/order.api";

// Context & Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";

// Constants & Utils
import { MultiSelect } from "components/Selectors";
import { TYPE_FORM_FIELD } from "constants/index";
import { ROLE_TAB } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import vi from "locales/vi.json";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { ActionType } from "views/ShippingView/constants";
import {
  ASSIGNED_REPORT_DIMENSIONS,
  OPTIONS_REASON_CREATED,
  columnShowReport,
} from "views/TransportationCareView/constant";
import { Page } from "components/Page";

// --------------------------------------------------------------------

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    dimension: "handle_by__name",
    date_start: format(new Date(), yyyy_MM_dd),
    date_end: format(new Date(), yyyy_MM_dd),
    created_dateValue: 0,
  },
  columns: {
    columnsShowHeader: columnShowReport.columnsShowHeader.filter(
      (item) => item.name !== "reason" && item.name !== "label"
    ),
    columnsShow: columnShowReport.columnsShowHeader.filter(
      (item) => item.name !== "reason" && item.name !== "label"
    ),
    columnOrders: [],
    columnWidths: columnShowReport.columnWidths,
  },
  dataTotal: 0,
  totalRow: {},
  isShowFullTable: false,
};

const storeReport = (state: InitialStateReport, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case ActionType.UPDATE_DATA: {
        return {
          ...state,
          ...payload,
        };
      }
      case ActionType.UPDATE_DATA_TOTAL: {
        return {
          ...state,
          ...payload,
        };
      }
      case ActionType.UPDATE_LOADING: {
        return {
          ...state,
          ...payload,
        };
      }
      case ActionType.UPDATE_PARAMS: {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }
      case ActionType.UPDATE_TOTAL_ROW: {
        return {
          ...state,
          ...payload,
        };
      }
      case ActionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
      case ActionType.UPDATE_COLUMNS_REPORT: {
        return {
          ...state,
          columns: {
            ...state.columns,
            ...payload,
          },
        };
      }
    }
  }
};

const Report = ({ isHiddenDimension = false }: { isHiddenDimension?: boolean }) => {
  const [state, dispatch] = useReducer(storeReport, initState);
  const { newCancelToken } = useCancelToken();

  const {
    data,
    loading,
    params,
    dataTotal,
    isShowFullTable,
    totalRow,
    columns: { columnsShowHeader, columnOrders, columnWidths, columnsShow },
  } = state;

  useEffect(() => {
    const newColumnOrder = map(columnsShowHeader, (item: any) => item.name);
    dispatch({
      type: ActionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnOrders: newColumnOrder,
      },
    });
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, newCancelToken]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
    };

    const newParams = chooseParams(objParams, ["date_start", "date_end", "dimension", "search"]);

    getListReport(newParams);
  };

  const getListReport = async (params: any) => {
    if (params) {
      dispatch({
        type: ActionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result: any = await orderApi.get({
        endpoint: "report/transportation-care",
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
      });

      if (result && result.data) {
        // const { results = [], count, total } = result.data;

        let newData = result.data.map((item: any) => ({
          ...item,
          ...(params.dimension === "reason_type" && {
            reason: item.reason ? OPTIONS_REASON_CREATED.find(_item => _item.value === item.reason)?.label : "",
          }),
        }));

        dispatch({
          type: ActionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: ActionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: result.data.length,
          },
        });

        // dispatch({
        //   type: ActionType.UPDATE_TOTAL_ROW,
        //   payload: {
        //     totalRow: result.data.length,
        //   },
        // });
      }

      dispatch({
        type: ActionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const handleResizeColumns = (value: any) => {
    dispatch({
      type: ActionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnWidths: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatch({
      type: ActionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnOrders: columns,
      },
    });
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        limit: rowPage,
        page: 1,
      },
    });
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        page: 1,
        ...params,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleShowFullTable = () => {
    dispatch({
      type: ActionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
      },
    });
  };

  const handleSwitchColumnByFilterReport = (value: string | any) => {
    const newColumnsShowHeader = columnShowReport.columnsShowHeader.filter((item: any) => {
      switch (value) {
        case "handle_by__name":
          return item.name !== "reason" && item.name !== "label";
        case "reason_type":
          return item.name !== "name" && item.name !== "label";
        case "late_reason__label":
        case "wait_return_reason__label":
        case "returning_reason__label":
        case "returned_reason__label":
          return item.name !== "name" && item.name !== "reason";
        default:
          return true;
      }
    });

    dispatch({
      type: ActionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnsShowHeader: newColumnsShowHeader,
        columnsShow: newColumnsShowHeader,
        columnOrders: map(newColumnsShowHeader, (item: any) => item.name),
      },
    });
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(params, [
      "date_start",
      "date_end",
      "created_dateValue",
      "search",
    ]);
  }, [params]);

  const columnShowExport = useMemo(() => {
    return columnsShowHeader.length
      ? columnsShowHeader.reduce((prevArr: any, current: any) => {
          return [
            ...prevArr,
            {
              name: current.name,
              title: current.title,
            },
          ];
        }, [])
      : [];
  }, [columnsShowHeader]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        type: TYPE_FORM_FIELD.DATE,
        title: isHiddenDimension ? "Thời gian chia số" : "Thời gian",
        keyDateFrom: "date_start",
        keyDateTo: "date_end",
        keyDateValue: "created_dateValue",
      },
    ];

    const contentOptionalLeft = (
      <MultiSelect
        zIndex={1303}
        title="Báo cáo theo"
        size="small"
        outlined
        fullWidth
        selectorId="dimension"
        options={ASSIGNED_REPORT_DIMENSIONS}
        onChange={(value) => {
          dispatch({
            type: ActionType.UPDATE_PARAMS,
            payload: {
              dimension: value,
            },
          });
          handleSwitchColumnByFilterReport(value);
        }}
        defaultValue={params.dimension}
        simpleSelect
      />
    );

    return (
      <HeaderFilter
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập lí do cụ thể, người được chia số",
            style: { minWidth: "150px" },
          },
        ]}
        isFullTable={isShowFullTable}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        dataExport={data}
        columnShowExport={columnShowExport}
        columnsCount={columnsShowHeader.length}
        originColumns={columnsShow}
        contentOptionalLeft={isHiddenDimension ? undefined : contentOptionalLeft}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  return (
    <Page title="Báo cáo CSVĐ">
      <DDataGrid
        // heightProps={500}
        isFullTable={isShowFullTable}
        data={data}
        dataTotal={dataTotal}
        totalSummaryRow={totalRow}
        page={params.page}
        pageSize={params.limit}
        columns={columnsShowHeader}
        columnOrders={columnOrders}
        columnWidths={columnWidths}
        isLoadingTable={loading}
        renderHeader={renderHeader}
        setColumnWidths={handleResizeColumns}
        handleChangeColumnOrder={handleChangeColumnOrder}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        handleSorting={handleChangeSorting}
      />
    </Page>
  );
};

export default Report;
