// Libraries
import { useEffect, useReducer, useMemo, useCallback } from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import produce from "immer";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";

// Services
import { orderApi } from "_apis_/order.api";
import { deliveryApi } from "_apis_/delivery.api";

// Context & Hooks
import { useCancelToken } from "hooks/useCancelToken";
import { useAppSelector } from "hooks/reduxHook";
import { leadStore } from "store/redux/leads/slice";

// Components
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import { MultiSelect } from "components/Selectors";
import LineChart from "components/Charts/LineChart";

// Types
import { SortType } from "_types_/SortType";
import { FacebookType, InitialStateReport } from "_types_/FacebookType";
import { ShippingReportType } from "_types_/ShippingType";
import { ColumnTypeDefault } from "_types_/ColumnType";

// Constants & Utils
import {
  ActionType,
  keyFilter,
  summaryColumnReport,
  optionReportBy,
  columnShowHeaderReport,
  columnWidthsReport,
  REPORT_BY,
} from "views/ShippingView/constants";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { TYPE_FORM_FIELD } from "constants/index";
import { fPercent, fValueVnd } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { yyyy_MM_dd } from "constants/time";

// --------------------------------------------------------------------

const paramsDefault = {
  created_dateValue: -1,
  created_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  created_to: format(new Date(), yyyy_MM_dd),
};

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: `-${REPORT_BY.CREATED_AT}`,
    isShowRevenue: false,
    dimension: optionReportBy[0].value,
    source: "all",
    ...paramsDefault,
  },
  columns: {
    columnsShowHeader: filter(
      columnShowHeaderReport[REPORT_BY.CREATED_AT],
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ),
    columnsShow: filter(
      columnShowHeaderReport[REPORT_BY.CREATED_AT],
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ),
    columnOrders: [],
    columnWidths: columnWidthsReport,
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

const Report = () => {
  const [state, dispatch] = useReducer(storeReport, initState);
  const { newCancelToken } = useCancelToken();
  const leadSlice = useAppSelector(leadStore);

  const {
    data,
    loading,
    params,
    dataTotal,
    isShowFullTable,
    totalRow,
    columns: { columnsShowHeader, columnOrders, columnWidths, columnsShow },
  } = state;
  const { isShowRevenue, dimension } = params;

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
      type: isShowRevenue ? ["report_revenue_net"] : ["report_normal"],
      carrier_status: "delivered",
      finish_date_from: params.created_from,
      finish_date_to: params.created_to,
      order_source: params.source,
    };

    dimension === REPORT_BY.DATE_DELIVERED
      ? getListReportFinishDate(
          chooseParams(objParams, [
            "dimension",
            "order_source",
            "type",
            "carrier_status",
            "finish_date_from",
            "finish_date_to",
          ])
        )
      : getListReport(
          chooseParams(objParams, ["dimension", "created_from", "created_to", "source", "type"])
        );
  };

  const convertValue = ({
    columnName,
    valueRow,
    isShowMulti = true,
    isSummary = false,
  }: {
    columnName: string;
    valueRow: ShippingReportType;
    isShowMulti?: boolean;
    isSummary?: boolean;
  }) => {
    const subRow = columnName as keyof ShippingReportType;
    const valueSubRow = valueRow[subRow] as number;
    const revenueSubRow = `${subRow}__revenue_net` as keyof ShippingReportType;
    const valueRevenueSubRow = valueRow[revenueSubRow] as number;
    return (
      <>
        {isShowRevenue ? (
          <Stack>
            {isShowMulti ? (
              <>
                <Typography variant="body2" sx={{ ...(isSummary && { fontWeight: "bold" }) }}>
                  {fValueVnd(valueRevenueSubRow)} -{" "}
                  {fPercent(valueRevenueSubRow / valueRow.total_order__revenue_net)}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ ...(isSummary && { fontWeight: "bold" }), fontSize: 12 }}
                >
                  {valueRow[subRow]} - {fPercent(valueSubRow / valueRow.total_order)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ ...(isSummary && { fontWeight: "bold" }) }}>
                {fValueVnd(valueSubRow)} -{" "}
                {fPercent(valueSubRow / valueRow.total_order_shipment__revenue_net)}
              </Typography>
            )}
          </Stack>
        ) : (
          <Stack>
            <Typography variant="body2" sx={{ ...(isSummary && { fontWeight: "bold" }) }}>
              {valueRow[subRow]} -{" "}
              {fPercent(
                valueSubRow / (!isShowMulti ? valueRow.total_order_shipment : valueRow.total_order)
              )}
            </Typography>
          </Stack>
        )}
      </>
    );
  };

  const getListReport = async (params: any) => {
    if (params) {
      dispatch({
        type: ActionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result = await orderApi.get({
        endpoint: "report/orders-status/",
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
      });

      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = map(results, (item: ShippingReportType) => {
          const {
            total_order,
            total_order__revenue_net,
            delivering,
            delivered,
            waiting_for_delivery,
            return_transporting,
            waiting_to_return,
            returned,
            lost,
            cancelled,
            total_order_completed__revenue_net,
            total_order_completed,
            total_order_cancel,
            total_order_cancel__revenue_net,
            total_order_draft__revenue_net,
            total_order_draft,
            total_order_shipment__revenue_net,
            total_order_shipment,
            total_order_not_shipment__revenue_net,
            total_order_not_shipment,
            total_order_not_cancel,
            total_order_not_cancel__revenue_net,
            total_order_finish,
            total_order_finish__revenue_net,
          } = item;

          return {
            ...item,
            total_order: {
              value: isShowRevenue
                ? `${fValueVnd(total_order__revenue_net)} - ${total_order}`
                : total_order,
              content: (
                <Stack>
                  {isShowRevenue ? (
                    <>
                      <Typography variant="body2">{fValueVnd(total_order__revenue_net)}</Typography>
                      <Typography color="text.secondary" variant="body2" fontSize={12}>
                        {total_order}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2">{total_order}</Typography>
                  )}
                </Stack>
              ),
            },
            delivering: {
              value: isShowRevenue ? fValueVnd(delivering) : delivering,
              content: convertValue({
                columnName: "delivering",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            delivered: {
              value: isShowRevenue ? fValueVnd(delivered) : delivered,
              content: convertValue({
                columnName: "delivered",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            waiting_for_delivery: {
              value: isShowRevenue ? fValueVnd(waiting_for_delivery) : waiting_for_delivery,
              content: convertValue({
                columnName: "waiting_for_delivery",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            return_transporting: {
              value: isShowRevenue ? fValueVnd(return_transporting) : return_transporting,
              content: convertValue({
                columnName: "return_transporting",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            waiting_to_return: {
              value: isShowRevenue ? fValueVnd(waiting_to_return) : waiting_to_return,
              content: convertValue({
                columnName: "waiting_to_return",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            returned: {
              value: isShowRevenue ? fValueVnd(returned) : returned,
              content: convertValue({
                columnName: "returned",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            cancelled: {
              value: isShowRevenue ? fValueVnd(cancelled) : cancelled,
              content: convertValue({
                columnName: "cancelled",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            lost: {
              value: isShowRevenue ? fValueVnd(lost) : lost,
              content: convertValue({
                columnName: "lost",
                valueRow: item,
                isShowMulti: false,
              }),
            },
            total_order_completed: {
              value: isShowRevenue
                ? `${fValueVnd(total_order_completed__revenue_net)} - ${total_order_completed}`
                : total_order_completed,
              content: convertValue({
                columnName: "total_order_completed",
                valueRow: item,
              }),
            },
            total_order_cancel: {
              value: isShowRevenue
                ? `${fValueVnd(total_order_cancel__revenue_net)} - ${total_order_cancel} `
                : total_order_cancel,
              content: convertValue({
                columnName: "total_order_cancel",
                valueRow: item,
              }),
            },
            total_order_not_cancel: {
              value: isShowRevenue
                ? `${fValueVnd(total_order_not_cancel__revenue_net)} - ${total_order_not_cancel} `
                : total_order_not_cancel,
              content: convertValue({
                columnName: "total_order_not_cancel",
                valueRow: item,
              }),
            },
            total_order_draft: {
              value: isShowRevenue
                ? `${fValueVnd(total_order_draft__revenue_net)} - ${total_order_draft}`
                : total_order_draft,
              content: convertValue({
                columnName: "total_order_draft",
                valueRow: item,
              }),
            },
            total_order_shipment: {
              value: isShowRevenue
                ? `${fValueVnd(total_order_shipment__revenue_net)} - ${total_order_shipment}`
                : total_order_shipment,
              content: convertValue({
                columnName: "total_order_shipment",
                valueRow: item,
              }),
            },
            total_order_not_shipment: {
              value: isShowRevenue
                ? `${fValueVnd(
                    total_order_not_shipment__revenue_net
                  )} - ${total_order_not_shipment}`
                : total_order_not_shipment,
              content: convertValue({
                columnName: "total_order_not_shipment",
                valueRow: item,
              }),
            },
            total_order_finish: {
              value: isShowRevenue
                ? `${fValueVnd(total_order_finish__revenue_net)} - ${total_order_finish}`
                : total_order_finish,
              content: convertValue({
                columnName: "total_order_finish",
                valueRow: item,
              }),
            },
          };
        });

        dispatch({
          type: ActionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: ActionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });

        dispatch({
          type: ActionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: total,
          },
        });
      }

      dispatch({
        type: ActionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const getListReportFinishDate = async (params: any) => {
    if (params) {
      dispatch({
        type: ActionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result = await deliveryApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/status/"
      );

      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = map(results, (item: ShippingReportType) => {
          const { delivered_revenue, delivered = 0 } = item;

          return {
            ...item,
            delivered: {
              value: isShowRevenue ? fValueVnd(delivered_revenue) : delivered,
              content: (
                <>
                  {isShowRevenue ? (
                    <Typography variant="body2">{fValueVnd(delivered_revenue)}</Typography>
                  ) : (
                    <Stack>
                      <Typography variant="body2">{delivered}</Typography>
                    </Stack>
                  )}
                </>
              ),
            },
          };
        });

        dispatch({
          type: ActionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: ActionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });

        dispatch({
          type: ActionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: total,
          },
        });
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

  const handleChangeColumn = (column: { name: string; isShow: boolean; title: string }) => {
    const index = columnShowHeaderReport[dimension].findIndex(
      (item: { name: string }) => item.name === column.name
    );
    const columnsShow: any = produce(
      columnShowHeaderReport[dimension],
      (draft: ColumnTypeDefault<FacebookType>[]) => {
        draft[index].isShow = !column.isShow;
      }
    );

    const resultColumnsShow = column.isShow
      ? filter(columnsShowHeader, (item: any) => item.name !== column.name)
      : filter(columnsShow, (item: ColumnTypeDefault<FacebookType>) => item.isShow);

    dispatch({
      type: ActionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnsShowHeader: resultColumnsShow,
        columnsShow,
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

  const headerFilterChannel = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.channel.length)
      ? map(leadSlice.attributes.channel, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const handleFormatSummary = (columnName: string, totalRow: any) => {
    const isShowMulti = [
      "total_order_completed",
      "total_order_draft",
      "total_order_cancel",
      "total_order_not_cancel",
      "total_order_shipment",
      "total_order_not_shipment",
      "total_order_finish",
    ].includes(columnName);

    switch (columnName) {
      case "total_order": {
        return (
          <Stack>
            {isShowRevenue ? (
              <>
                <Typography variant="body2" fontWeight="bold">
                  {fValueVnd(totalRow.total_order__revenue_net)}
                </Typography>
                <Typography color="text.secondary" variant="body2" fontWeight="bold" fontSize={12}>
                  {totalRow.total_order}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" fontWeight="bold">
                {totalRow.total_order}
              </Typography>
            )}
          </Stack>
        );
      }
      case "delivered": {
        return dimension === REPORT_BY.DATE_DELIVERED ? (
          <>
            {isShowRevenue ? (
              <Typography variant="body2">{fValueVnd(totalRow.delivered_revenue)}</Typography>
            ) : (
              <Typography variant="body2">{totalRow.delivered}</Typography>
            )}
          </>
        ) : (
          convertValue({
            columnName,
            valueRow: totalRow,
            isSummary: true,
            isShowMulti,
          })
        );
      }

      default: {
        return convertValue({
          columnName,
          valueRow: totalRow,
          isSummary: true,
          isShowMulti,
        });
      }
    }
  };

  const handleSwitchColumnByFilterReport = (value: string | any) => {
    const columnsShowHeader = filter(
      columnShowHeaderReport[value],
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    );

    dispatch({
      type: ActionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnsShowHeader,
        columnsShow: columnsShowHeader,
        columnOrders: map(columnsShowHeader, (item: any) => item.name),
      },
    });
  };

  const handleSortColumnOptional = (valueSort: string) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        ordering: valueSort,
      },
    });
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(params, [
      "source",
      "created_from",
      "created_to",
      "created_dateValue",
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

  const getValueSort = useCallback(
    (columnName: string) => [
      {
        label: "Doanh thu",
        value: `${columnName}__revenue_net`,
      },
      {
        label: "Số lượng",
        value: columnName,
      },
    ],
    []
  );

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.CHANNEL,
        title: "Kênh bán hàng",
        options: [
          {
            label: "Tất cả",
            value: "all",
          },
          {
            label: "Chưa có",
            value: "none",
          },
          ...headerFilterChannel,
        ],
        label: "source",
        defaultValue: "all",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian",
        keyDateFrom: "created_from",
        keyDateTo: "created_to",
        keyDateValue: "created_dateValue",
      },
    ];

    const contentOptional = (
      <Stack direction="row" alignItems="center" sx={{ mr: 3, mt: 2 }}>
        <Switch
          checked={isShowRevenue}
          onChange={() =>
            dispatch({
              type: ActionType.UPDATE_PARAMS,
              payload: {
                isShowRevenue: !isShowRevenue,
              },
            })
          }
        />
        <Typography variant="body2">Chỉ số doanh thu</Typography>
      </Stack>
    );

    const contentOptionalLeft = (
      <MultiSelect
        zIndex={1303}
        title="Báo cáo theo"
        size="medium"
        outlined
        fullWidth
        selectorId="report_by"
        options={optionReportBy}
        onChange={(value) => {
          dispatch({
            type: ActionType.UPDATE_PARAMS,
            payload: {
              dimension: value,
              ordering: value === REPORT_BY.DATE_DELIVERED ? "-finish_date" : `-${value}`,
            },
          });

          handleSwitchColumnByFilterReport(value);
        }}
        defaultValue={dimension}
        simpleSelect
      />
    );

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={paramsDefault}
        dataExport={data}
        columnShowExport={columnShowExport}
        columnsCount={columnsShowHeader.length}
        originColumns={columnsShow}
        contentOptional={contentOptional}
        arrNoneRenderSliderFilter={["created_dateValue"]}
        arrDate={["tracking_created_at", "delivered_at", "created_at", "finish_date"]}
        contentOptionalLeft={contentOptionalLeft}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={12} md={12} lg={12}>
        <LineChart
          title="Content ID Tổng"
          data={dataChart}
          keyFilter="created_date"
          defaultFilter={{
            filterOne: "Tổng chi phí",
            filterTwo: "Tổng doanh thu",
          }}
          isLoading={isLoadingChart}
          optionsFilter={FILTER_CHART_OPTIONS_CONTENT_ID_TOTAL}
        />
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <DDataGrid
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
          contentSummary={{
            arrFormatSummaryOptional: [
              "total_order",
              "total_order_completed",
              "total_order_draft",
              "total_order_cancel",
              "total_order_not_cancel",
              "total_order_shipment",
              "total_order_not_shipment",
              "total_order_finish",
              "delivering",
              "waiting_for_delivery",
              "return_transporting",
              "delivered",
              "waiting_to_return",
              "returned",
              "cancelled",
              "lost",
            ],
            handleFormatSummary,
          }}
          contentOptional={{
            arrColumnOptional: [
              "total_order",
              "total_order_completed",
              "total_order_draft",
              "total_order_cancel",
              "total_order_not_cancel",
              "total_order_shipment",
              "total_order_not_shipment",
              "total_order_finish",
              "delivering",
              "waiting_for_delivery",
              "return_transporting",
              "delivered",
              "waiting_to_return",
              "returned",
              "cancelled",
              "lost",
            ],
          }}
          contentSortOptional={{
            arrSortOptional: [
              "total_order_not_cancel",
              "total_order_cancel",
              "total_order",
              "total_order_completed",
              "total_order_draft",
              "total_order_shipment",
              "total_order_not_shipment",
              "total_order_finish",
            ],
            isShowSortOptional: isShowRevenue && dimension !== REPORT_BY.DATE_DELIVERED,
            getValueSort: getValueSort,
            handleSort: handleSortColumnOptional,
          }}
          arrDate={["tracking_created_at", "delivered_at", "created_at", "finish_date"]}
          summaryDataColumns={summaryColumnReport}
          renderHeader={renderHeader}
          setColumnWidths={handleResizeColumns}
          handleChangeColumnOrder={handleChangeColumnOrder}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          handleSorting={handleChangeSorting}
        />
      </Grid>
    </Grid>
  );
};

export default Report;
